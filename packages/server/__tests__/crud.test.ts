import nock from 'nock';

// Set environment before importing api
process.env.SUPABASE_URL = 'http://localhost';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'key';

import { api } from '../index';

afterEach(() => {
  nock.cleanAll();
});

test('CRUD operations via supabase client', async () => {
  const node = { id: 1, story_id: 's', text: 'hi' };

  // insert
  nock('http://localhost')
    .post('/rest/v1/nodes')
    .query({ select: '*' })
    .reply(201, [node]);

  const insertRes = await api.client.from('nodes').insert(node).select();
  expect(insertRes.data).toEqual([node]);

  const updated = { ...node, text: 'bye' };
  nock('http://localhost')
    .patch('/rest/v1/nodes')
    .query({ id: 'eq.1', select: '*' })
    .reply(200, [updated]);

  const updateRes = await api.client.from('nodes').update({ text: 'bye' }).eq('id', 1).select();
  expect(updateRes.data).toEqual([updated]);

  nock('http://localhost')
    .delete('/rest/v1/nodes')
    .query({ id: 'eq.1' })
    .reply(204);

  const deleteRes = await api.client.from('nodes').delete().eq('id', 1);
  expect(deleteRes.error).toBeNull();
});
