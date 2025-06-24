import { NodeSchema } from '../index';

describe('NodeSchema', () => {
  it('validates correct data', () => {
    expect(() => NodeSchema.parse({ id: '1', storyId: 's', text: 'hello' })).not.toThrow();
  });

  it('rejects missing fields', () => {
    expect(() => NodeSchema.parse({ id: '1' })).toThrow();
  });
});
