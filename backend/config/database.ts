import { parse } from 'pg-connection-string';

interface Env {
  (key: string, defaultValue?: string): string;
}

export default ({ env }: { env: Env }) => {
  const client = env('DATABASE_CLIENT', 'postgres');
  const dbConfig = parse(env('DATABASE_URL'));

  return {
    connection: {
      client,
      connection: {
        host: dbConfig.host as string,
        port: dbConfig.port ? parseInt(dbConfig.port) : undefined,
        database: dbConfig.database as string,
        user: dbConfig.user as string,
        password: dbConfig.password as string,
        ssl: { rejectUnauthorized: false },
      },
      options: {
        ssl: true,
      },
    },
  };
};
