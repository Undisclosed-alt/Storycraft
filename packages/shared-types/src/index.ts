import { z } from 'zod';

export const StorySchema = z.object({
  id: z.string(),
  title: z.string(),
});
export type Story = z.infer<typeof StorySchema>;

export const NodeSchema = z.object({
  id: z.string(),
  storyId: z.string(),
  text: z.string(),
});
export type Node = z.infer<typeof NodeSchema>;

export const ActionSchema = z.object({
  label: z.string(),
  targetId: z.string(),
});
export type Action = z.infer<typeof ActionSchema>;
