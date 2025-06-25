import { createClient } from '@supabase/supabase-js';
import * as functions from '../../supabase/functions';

const url = process.env.SUPABASE_URL || 'http://localhost';
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'public-anon-key';

export const supabase = createClient(url, serviceKey);
export const api = {
  ...functions,
  client: supabase,
};

// Example usage: fetch all nodes
async function main() {
  const { data, error } = await api.client.from('nodes').select('*');
  if (error) throw error;
  console.log(data);
}

if (require.main === module) {
  main();
}
