export const upsert_node = async (supabase: any, payload: any) => {
  // TODO: implement upsert logic with validation
  // placeholder returns the inserted or updated node
  const { data, error } = await supabase.rpc('upsert_node', { payload });
  if (error) throw error;
  return data;
};
