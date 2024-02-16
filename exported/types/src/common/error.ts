import { z } from "zod";

export const errorResponse = z.object({
  error_code: z.number(),
  error_title: z.string(),
  error_message: z.string(),
});

export type ErrorResponse = z.infer<typeof errorResponse>;
