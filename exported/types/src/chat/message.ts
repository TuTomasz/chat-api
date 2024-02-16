import { z } from "zod";

export const messageTransport = z.strictObject({
  message_id: z.string().uuid(),
  sender_user_id: z.string().uuid(),
  receiver_user_id: z.string().uuid(),
  message: z.string(),
  epoch: z.number(),
});

export type MessageTransport = z.infer<typeof messageTransport>;
