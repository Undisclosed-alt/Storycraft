import React from 'react';
import { useState } from 'react';
import { Edge, Node } from 'reactflow';
import { api } from './supabaseClient';

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
    const issues = await api.validate_graph(api.client);
    if (issues.length > 0) {
      setError(issues.map((i: any) => `Node ${i.nodeId}: ${i.message}`).join('\n'));
      return;
    }
    setError(null);
    const actions: Record<string, { id: string; label: string; target: string }[]> = {};
    for (const e of edges) {
      if (!actions[e.source]) actions[e.source] = [];
      actions[e.source].push({
        id: e.id,
        label: (e.label as string) ?? '',
        target: e.target,
      });
    }
    const story = {
      id: 'demo-story',
      nodes: nodes.map((n) => ({
        id: n.id,
        text: (n.data as any).text,
        image: (n.data as any).image ?? '',
        actions: actions[n.id] ?? [],
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
    await api.client.storage.from('exports').upload(path, blob, { upsert: true });
    const { data } = api.client.storage.from('exports').getPublicUrl(path);
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
