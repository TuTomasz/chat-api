import { z } from "zod";

export const messageTransport = z.strictObject({
  message_id: z.number(),
  sender_user_id: z.number(),
  receiver_user_id: z.number(),
  message: z.string(),
  epoch: z.number(),
});

export const messageCreateTransport = z.strictObject({
  sender_user_id: z.number(),
  receiver_user_id: z.number(),
  message: z.string(),
});

export type MessageTransport = z.infer<typeof messageTransport>;
export type MessageCreateTransport = z.infer<typeof messageCreateTransport>;
