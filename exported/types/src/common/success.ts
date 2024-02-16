import { z } from "zod";

export const successResponse = z.object({
  success_code: z.number(),
  success_title: z.string(),
  success_message: z.string(),
});

export type SuccessResponse = z.infer<typeof successResponse>;
