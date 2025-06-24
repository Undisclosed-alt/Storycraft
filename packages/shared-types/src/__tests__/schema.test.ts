import { StorySchema } from '../index';

describe('StorySchema', () => {
  it('parses valid story', () => {
    const data = { id: '1', title: 'Test' };
    const parsed = StorySchema.parse(data);
    expect(parsed).toEqual(data);
  });
});
