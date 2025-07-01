import nock from 'nock';
import { api } from '../index';

afterEach(() => {
  nock.cleanAll();
});

test('supabase client loads', () => {
  expect(api.client).toBeDefined();
});

test('validate_graph RPC call', async () => {
  nock('http://localhost')
    .post('/rest/v1/rpc/validate_graph')
    .reply(200, [{ nodeId: '1', message: 'dup' }]);
  const res = await api.validate_graph(api.client);
  expect(res).toEqual([{ nodeId: '1', message: 'dup' }]);
});
