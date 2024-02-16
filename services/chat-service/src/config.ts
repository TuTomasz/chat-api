import convict from "convict";
import dotenv from "dotenv";

// LOAD ENVIRONMENT VARIABLES FROM .env FILE
dotenv.config();

// CONFIGURATION SCHEMA
const config = convict({
  env: {
    doc: "The application environment.",
    format: ["production", "development", "test"],
    default: "development",
    env: "NODE_ENV",
  },
  port: {
    doc: "The port to bind.",
    format: "port",
    default: 5000,
    env: "PORT",
  },
  db: {
    host: {
      doc: "The MySQL host.",
      format: "*",
      default: "localhost",
      env: "DB_HOST",
    },
    user: {
      doc: "The MySQL username.",
      format: "*",
      default: "admin",
      env: "DB_USER",
    },
    password: {
      doc: "The MySQL password.",
      format: "*",
      default: "password",
      env: "DB_PASSWORD",
    },
    database: {
      doc: "The MySQL database name.",
      format: "*",
      default: "Chat",
      env: "DB_DATABASE",
    },
  },
});

config.validate({ allowed: "strict" });

export default config;
