import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateLogDto } from "./dto/log.dto";
import { Log } from "./entities/log.entity";
import { Response } from 'express';
import { LogConstant } from "./log.constant";
import { v4 as uuidv4 } from 'uuid';

let unique_code = uuidv4();

@Injectable()
export class LogService {

    constructor(
        @InjectRepository(Log)
        private logRepository: Repository<Log>
    ) { }

    // Method to capture and log the response
    async getResponseLog(res: Response) {
        try {
            // Capture write and end methods of the response
            const rawResponse = res.write;
            const rawResponseEnd = res.end;

            const chunkBuffers = [];

            res.write = (...chunks) => {
                try {
                    // Process each chunk
                    const resArgs = [];
                    for (let i = 0; i < chunks.length; i++) {
                        resArgs[i] = chunks[i];

                        // If chunk is null, wait for drain event
                        if (!resArgs[i]) {
                            // Once 'drain' event occurs, reattempt to write the chunk
                            res.once('drain', res.write);
                            --i; // Decrement i to reprocess the same index after the drain event
                        }
                    }
                    // Push non-null chunks to buffer
                    if (resArgs[0]) {
                        chunkBuffers.push(Buffer.from(resArgs[0]));
                    }

                    // Call the original 'write' method with the processed arguments
                    return rawResponse.apply(res, resArgs);
                }
                catch (e) {
                    // Log error if encountered during writing
                    this.createLog(res, JSON.stringify({ msg: LogConstant.ERROR_IN_LOGGER, error: e.message }), true);

                    // Call the original 'write' method with the original arguments
                    return rawResponse.apply(res, chunks);
                }
            };


            res.end = (...chunk) => {
                try {
                    // Set custom header indicating the origin of the response
                    res.setHeader('origin', 'log-middleware');
                    res.setHeader('Authorization', `${res.req.get('Authorization')}`);

                    // Process the response chunk
                    let data: any = this.processHttpResponseChunk(chunk, res)

                    // If processed data is available, assign it to 'data', else keep the original chunk
                    data ? data = chunk : data;

                    // Return the result of the original 'end' method with the processed data or the original chunk
                    return rawResponseEnd.apply(res, data || chunk);
                }
                catch (e) {
                    // Log error if encountered during ending
                    this.createLog(res, JSON.stringify({ msg: LogConstant.ERROR_IN_LOGGER, error: e.message }), true);

                    // Return the result of the original 'end' method with the original chunk
                    return rawResponseEnd.apply(res, chunk);
                }
            }
        }
        catch (e) {
            // Log error if encountered during capturing response
            this.createLog(res, JSON.stringify({ msg: LogConstant.ERROR_IN_LOGGER, error: e.message }), true);
        }
    }

    // Method to process response chunks and create log
    processHttpResponseChunk(chunk: any, res) {
        try {
            const resArgs = [];
            const chunkBuffers = [];

            // Iterate through each chunk in the chunk array
            for (let i = 0; i < chunk.length; i++) {
                // Assign each chunk to the corresponding index in the resArgs array
                resArgs[i] = chunk[i];
            }

            // Check if the first chunk is present
            if (resArgs[0]) {
                // Convert the first chunk to a buffer and push it to the chunkBuffers array
                chunkBuffers.push(Buffer.from(resArgs[0]));
            }


            // Convert chunks to response body
            let response_body: any = Buffer.concat(chunkBuffers).toString('utf8');

            try {
                // Try to parse the response body as JSON
                response_body = JSON.parse(response_body)
            }
            catch (e) {
                // If parsing fails, construct a simple object with the original response body and an error message
                response_body = { response_body, msg: LogConstant.BODY_ERROR_MSG };
            }


            // Create log with processed response body
            this.createLog(res, response_body, false);
        }
        catch (e) {
            // Log error if encountered during processing chunks
            this.createLog(res, JSON.stringify({ msg: LogConstant.ERROR_IN_LOGGER, error: e.message }), true)
        }
    }

    // Method to create log
    async createLog(res: Response, response_body: any, isError?: boolean) {
        try {

            // Generate a unique code for the log and group them
            res.on('close', () => { unique_code = uuidv4() })

            // Determine statusCode and routePath based on error status
            let statusCode, routePath;
            !isError ? (routePath = res.req.route.path, statusCode = res.statusCode)
                : (routePath = res.req.originalUrl, statusCode = 500)

            // Construct log data
            const data: CreateLogDto = {
                method: res.req.method,
                api: routePath,
                body: JSON.stringify(res.req.body),
                params: JSON.stringify(res.req.params),
                query: JSON.stringify(res.req.query),
                headers: JSON.stringify(res.getHeaders()),
                response_body: JSON.stringify(response_body),
                status_code: statusCode,
                unique_code: unique_code
            };

            // Create and save log entity
            const create_log = this.logRepository.create(data);
            await this.logRepository.save(create_log);

            // Log error if isError is true
            isError ? console.log(`++++++++++++++++ The error occurred and was logged ++++++++++++++++`) : null;

            return create_log;
        }
        catch (e) {
            // Log error if encountered during log creation
            console.log(`++++++++++++++++ (LOGGER TRY-CATCH) The error occurred and was logged ++++++++++++++++`);
            this.createLog(res, JSON.stringify({ msg: LogConstant.ERROR_IN_LOGGER_TRYCATCH, error: e }), true);
        }
    }
}
