export class CreateLogDto {
    method: string;
    api: string;
    body?: string;
    response_body: string;
    params?: string;
    query?: string;
    headers?: string;
    status_code: number;
    unique_code: string;
}
