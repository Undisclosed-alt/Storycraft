import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import ExportPanel from '../src/ExportPanel';
import { Node, Edge } from 'reactflow';
jest.mock('../src/supabaseClient');
const { uploadMock, fromMock, getPublicUrlMock } = jest.requireMock('../src/supabaseClient');

describe('ExportPanel', () => {
  let OriginalBlob: typeof Blob;
  let captured: any[] = [];
  beforeEach(() => {
    uploadMock.mockReset();
    fromMock.mockReturnValue({ upload: uploadMock, getPublicUrl: getPublicUrlMock });
    OriginalBlob = global.Blob;
    global.Blob = class extends OriginalBlob {
      constructor(parts: any[], options?: any) {
        super(parts, options);
        captured = parts;
      }
    } as unknown as typeof Blob;
  });
  afterEach(() => {
    global.Blob = OriginalBlob;
  });

  it('exports node text', async () => {
    const nodes: Node[] = [
      { id: '1', position: { x: 0, y: 0 }, data: { text: 'hello' } } as any,
    ];
    const edges: Edge[] = [];
    const { getByText } = render(<ExportPanel nodes={nodes} edges={edges} />);

    fireEvent.click(getByText('Export Story'));

    await waitFor(() => expect(uploadMock).toHaveBeenCalled());
    const json = JSON.parse(captured[0]);
    expect(json.nodes[0].text).toBe('hello');
  });
});
