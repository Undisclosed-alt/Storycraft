export interface NodeSearchResult {
  id: string;
  title: string;
}

export const search_nodes = async (
  supabase: any,
  query: string
): Promise<NodeSearchResult[]> => {
  const { data, error } = await supabase.rpc('search_nodes', { query });
  if (error) throw error;
  return data as NodeSearchResult[];
};
