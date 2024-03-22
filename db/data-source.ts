import { DataSource, DataSourceOptions } from "typeorm";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { config } from "dotenv";

config();
export const typeOrmDbSource: TypeOrmModuleOptions = {


    type: 'mysql',

    host: process.env.DB_HOST,

    username: process.env.DB_USERNAME,

    password: process.env.DB_PASSWORD,

    database: process.env.DB_NAME,

    migrations: ['../migrations/*.ts'],

    autoLoadEntities: true
};


export const dataSourceOptions: DataSourceOptions = {

    type: 'mysql',

    host: process.env.DB_HOST,

    username: process.env.DB_USERNAME,

    password: process.env.DB_PASSWORD,

    database: process.env.DB_NAME,

    entities: ['src/**/entities/*.entity.ts'],

    migrations: ['migrations/*.ts'],

};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;