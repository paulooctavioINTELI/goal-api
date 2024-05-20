import { z } from 'zod';

export const userSchema = z.object({
  phoneNumber: z.string().min(10).max(15),
});

export type UserSchema = z.infer<typeof userSchema>;
