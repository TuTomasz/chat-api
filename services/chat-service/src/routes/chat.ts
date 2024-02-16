import {
  Chat,
  ErrorResponse,
  errorResponse,
  SuccessResponse,
  successResponse,
} from "@repo/types";
import { FastifyInstance } from "fastify";
import { z } from "zod";

export const chat = async (fastify: FastifyInstance) => {
  //////////////////////////////////////////////////
  // VIEW MESSAGES BETWEEN TWO USERS
  //////////////////////////////////////////////////

  fastify.get<{
    Params: { sender_user_id: string; receiver_user_id: string };
    Reply: Chat.MessageTransport[] | ErrorResponse;
  }>(
    "/view_messages/:sender_user_id/:receiver_user_id",
    {
      schema: {
        params: z.object({
          sender_user_id: z.string(),
          receiver_user_id: z.string(),
        }),
        response: {
          200: z.array(Chat.messageTransport),
          400: errorResponse,
          500: errorResponse,
        },
      },
    },
    async (request, reply) => {
      const { sender_user_id } = request.params;
      const { receiver_user_id } = request.params;

      console.log(parseInt(sender_user_id), parseInt(receiver_user_id));

      // make user both are numbers
      if (
        isNaN(parseInt(sender_user_id)) ||
        isNaN(parseInt(receiver_user_id))
      ) {
        return reply.status(400).send({
          error_code: 400,
          error_title: "Invalid user id",
          error_message: "Invalid user id",
        });
      }

      try {
        const [rows] = await fastify.mysql.query<any>(
          "SELECT * FROM Messages WHERE (sender_user_id = ? AND receiver_user_id = ?) OR (sender_user_id = ? AND receiver_user_id = ?) ORDER BY epoch",
          [sender_user_id, receiver_user_id, receiver_user_id, sender_user_id]
        );

        const transport = rows.map((row: any) => {
          return {
            message_id: row.message_id,
            sender_user_id: row.sender_user_id,
            receiver_user_id: row.receiver_user_id,
            message: row.message,
            epoch: row.epoch,
          };
        });

        return transport;
      } catch (err: any) {
        return reply.status(400).send({
          error_code: 400,
          error_title: "Failed to get messages",
          error_message: err.message,
        });
      }
    }
  );
  //////////////////////////////////////////////////
  // SEND MESSAGE
  //////////////////////////////////////////////////

  fastify.post<{
    Params: { userId: string; otherUserId: string };
    Body: Chat.MessageCreateTransport;
    Reply: SuccessResponse | ErrorResponse;
  }>(
    "/send_message",
    {
      schema: {
        body: Chat.messageCreateTransport,
        response: {
          200: successResponse,
          400: errorResponse,
          500: errorResponse,
        },
      },
    },
    async (request, reply) => {
      const { message, sender_user_id, receiver_user_id } = request.body;

      console.log(message, sender_user_id, receiver_user_id);

      try {
        const [rows] = await fastify.mysql.query(
          "INSERT INTO Messages (sender_user_id, receiver_user_id, message, epoch) VALUES (?, ?, ?, ?)",
          [sender_user_id, receiver_user_id, message, Date.now()]
        );
        return {
          success_code: 200,
          success_title: "Message sent",
          success_message: "Message sent successfully",
        };
      } catch (err: any) {
        return reply.status(400).send({
          error_code: 400,
          error_title: "Failed to send message",
          error_message: "Make sure you are sending to a valid user",
        });
      }
    }
  );
};
