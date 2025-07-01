import { z } from 'zod';

const Action = z.object({
  id: z.string().optional(),
  label: z.string(),
  target_id: z.string(),
});

const Node = z.object({
  id: z.string(),
  title: z.string(),
  text: z.string(),
  image_url: z.string().nullable().optional(),
});

const Payload = z.object({
  node: Node,
  actions: z.array(Action).optional(),
});
export type UpsertPayload = z.infer<typeof Payload>;

export const upsert_node = async (supabase: any, payload: UpsertPayload) => {
  Payload.parse(payload);
  const { data, error } = await supabase.rpc('upsert_node', { payload });
  if (error) throw error;
  return data as UpsertPayload['node'];
};
