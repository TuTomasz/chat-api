import z from "zod";

export const userTransport = z.strictObject({
  user_id: z.string().uuid(),
  email: z.string().email(),
  first_name: z.string(),
  last_name: z.string(),
});

export const userCreateTransport = z.strictObject({
  email: z.string().email(),
  password: z.string(),
  first_name: z.string(),
  last_name: z.string(),
});

export type UserTransport = z.infer<typeof userTransport>;
export type UserCreateTransport = z.infer<typeof userCreateTransport>;
