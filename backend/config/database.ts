const { parse } = require("pg-connection-string");

module.exports = ({ env }) => {
  // If Strapi Cloud provides the URL, parse and use it
  if (env("DATABASE_URL")) {
    const config = parse(env("DATABASE_URL"));
    return {
      connection: {
        client: "postgres",
        connection: {
          host: config.host,
          port: config.port,
          database: config.database,
          user: config.user,
          password: config.password,
          ssl: { rejectUnauthorized: false },
        },
      },
    };
  }

  // Safe fallback for the build process
  return {
    connection: {
      client: "sqlite",
      connection: {
        filename: env("DATABASE_FILENAME", ".tmp/data.db"),
      },
      useNullAsDefault: true,
    },
  };
};