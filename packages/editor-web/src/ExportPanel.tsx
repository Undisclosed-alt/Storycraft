import { useState } from 'react';
import { Edge, Node } from 'reactflow';
import { supabase } from './supabaseClient';

export default function ExportPanel({
  nodes,
  edges,
}: {
  nodes: Node[];
  edges: Edge[];
}) {
  const [link, setLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onExport = async () => {
    const nodeIds = new Set(nodes.map((n) => n.id));
    for (const e of edges) {
      if (!nodeIds.has(e.target)) {
        setError(`Missing target for edge ${e.id}`);
        return;
      }
    }
    setError(null);
    const story = {
      id: 'demo-story',
      nodes: nodes.map((n) => ({
        id: n.id,
        text: (n.data as any).label,
        image: (n.data as any).image ?? '',
      })),
      edges: edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        label: e.label,
      })),
    };
    const blob = new Blob([JSON.stringify(story, null, 2)], {
      type: 'application/json',
    });
    const path = `exports/${story.id}/story.json`;
    await supabase.storage.from('exports').upload(path, blob, { upsert: true });
    const { data } = supabase.storage.from('exports').getPublicUrl(path);
    setLink(data.publicUrl);
  };

  return (
    <div className="space-y-2 p-2 border-t">
      <button
        onClick={onExport}
        className="bg-green-600 text-white px-2 py-1 rounded"
      >
        Export Story
      </button>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      {link && (
        <div className="space-y-1">
          <a href={link} download className="text-blue-600 underline">
            Download story.json
          </a>
          <button
            onClick={() => navigator.clipboard.writeText(link)}
            className="text-sm underline"
          >
            Copy Link
          </button>
          <iframe
            src={`/mobile-app/web/index.html?url=${encodeURIComponent(link)}`}
            className="w-full h-64 border"
          />
        </div>
      )}
    </div>
  );
}
