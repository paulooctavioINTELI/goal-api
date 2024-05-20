import { z } from 'zod';

export const habitSchema = z.object({
  userId: z.number(),
  title: z.string(),
  voters: z.array(z.number()), // IDs dos usuários que votarão
});

export type HabitSchema = z.infer<typeof habitSchema>;
