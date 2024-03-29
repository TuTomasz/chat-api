import z from "zod";

export const userEntity = z.object({
  user_id: z.number(),
  password: z.string(),
  email: z.string().email(),
  first_name: z.string(),
  last_name: z.string(),
});

export const userTransport = z.strictObject({
  user_id: z.number(),
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

export type UserEntity = z.infer<typeof userEntity>;

export type UserTransport = z.infer<typeof userTransport>;
export type UserCreateTransport = z.infer<typeof userCreateTransport>;
