import Fastify from "fastify";
import config from "./config";
import { setupRoutes } from "./routes/index";
import cors from "@fastify/cors";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";

import { MySQLPromiseConnection } from "@fastify/mysql";
import mysql from "@fastify/mysql";

// Extend FastifyInstance to include MySQL connection
declare module "fastify" {
  interface FastifyInstance {
    mysql: MySQLPromiseConnection;
  }
}

const fastify = Fastify({
  logger: true,
});

// Add schema validator and serializer
fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

// Initialize the server
const initialize = async () => {
  // Register cors
  fastify.register(cors, {
    origin: "*",
  });

  // Register db plugin
  await fastify.register(mysql, {
    promise: true,
    host: config.get("db.host"),
    user: config.get("db.user"),
    password: config.get("db.password"),
    database: config.get("db.database"),
  });
  // Register routes
  await setupRoutes(fastify);

  // Check database connection
  try {
    await fastify.mysql.query("SELECT 1");
    console.log("Database connection established");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }

  // Run the server!
  try {
    await fastify.listen({
      port: config.get("port"),
    });
    console.log("Server is running on port:", config.get("port"));
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
initialize();
