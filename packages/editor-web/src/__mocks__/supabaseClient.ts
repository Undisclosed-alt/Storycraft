export const uploadMock = jest.fn();
export const getPublicUrlMock = jest.fn(() => ({ data: { publicUrl: 'http://url' } }));
export const fromMock = jest.fn(() => ({ upload: uploadMock, getPublicUrl: getPublicUrlMock }));
export const api = {
  validate_graph: jest.fn().mockResolvedValue([]),
  client: {
    storage: { from: fromMock },
  },
};
