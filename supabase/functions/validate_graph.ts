export interface ValidationError {
  nodeId: number;
  message: string;
}

export const validate_graph = async (supabase: any): Promise<ValidationError[]> => {
  const { data, error } = await supabase.rpc('validate_graph');
  if (error) throw error;
  return data as ValidationError[];
};
