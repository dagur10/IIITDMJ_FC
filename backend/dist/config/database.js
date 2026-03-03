"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_connection_string_1 = require("pg-connection-string");
exports.default = ({ env }) => {
    const client = env('DATABASE_CLIENT', 'postgres');
    const dbConfig = (0, pg_connection_string_1.parse)(env('DATABASE_URL'));
    return {
        connection: {
            client,
            connection: {
                host: dbConfig.host,
                port: dbConfig.port ? parseInt(dbConfig.port) : undefined,
                database: dbConfig.database,
                user: dbConfig.user,
                password: dbConfig.password,
                ssl: { rejectUnauthorized: false },
            },
            options: {
                ssl: true,
            },
        },
    };
};
