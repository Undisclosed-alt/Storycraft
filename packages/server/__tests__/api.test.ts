import { api } from '../index';

test('supabase client loads', () => {
  expect(api.client).toBeDefined();
});
