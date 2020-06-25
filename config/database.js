module.exports = ({ env }) => ({
  defaultConnection: "default",
  connections: {
    default: {
      connector: "mongoose",
      options: {
        authenticationDatabase: env("AUTHENTICATION_DATABASE"),
        ssl: env.bool("DATABASE_SSL"),
      },
      settings: {
        host: env("DATABASE_HOST"),
        srv: env.bool("DATABASE_SRV"),
        port: env.int("DATABASE_PORT"),
        database: env("DATABASE_NAME"),
        username: env("DATABASE_USERNAME"),
        password: env("DATABASE_PASSWORD"),
      },
    },
  },
});
