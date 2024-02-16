import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { healthCheck } from "./health-check";
import { chat } from "./chat";
import { user } from "./user";
import { ZodTypeProvider } from "fastify-type-provider-zod";

export async function setupRoutes(
  fastifyInstance: FastifyInstance
): Promise<void> {
  [healthCheck, chat, user].forEach((routeDefinition: FastifyPluginAsync) => {
    fastifyInstance
      .withTypeProvider<ZodTypeProvider>()
      .register(routeDefinition);
  });
}
