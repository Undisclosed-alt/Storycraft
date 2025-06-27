import { useEffect, useState } from 'react';
import { Node, Edge } from 'reactflow';
import ImageUpload from './ImageUpload';

interface Props {
  node: Node;
  nodes: Node[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  edges: Edge[];
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
}

export default function NodeEditor({ node, nodes, setNodes, edges, setEdges }: Props) {
  const [error, setError] = useState<string | null>(null);
  const outgoing = edges.filter((e) => e.source === node.id);

  const updateNode = (data: any) =>
    setNodes((nds) => nds.map((n) => (n.id === node.id ? { ...n, data: { ...n.data, ...data } } : n)));

  const setButtonCount = (count: number) => {
    const current = outgoing.length;
    if (count > current) {
      const newEdges: Edge[] = [];
      for (let i = current; i < count; i++) {
        newEdges.push({ id: crypto.randomUUID(), source: node.id, target: node.id, label: '' });
      }
      setEdges((eds) => [...eds, ...newEdges]);
    } else if (count < current) {
      const remove = outgoing.slice(count).map((e) => e.id);
      setEdges((eds) => eds.filter((e) => !remove.includes(e.id)));
    }
  };

  const updateEdge = (id: string, data: Partial<Edge>) =>
    setEdges((eds) => eds.map((e) => (e.id === id ? { ...e, ...data } : e)));

  useEffect(() => {
    if (!node.data.title) {
      setError('Title is required');
      return;
    }
    for (const e of outgoing) {
      if (!nodes.find((n) => n.id === e.target)) {
        setError(`Target ${e.target} does not exist`);
        return;
      }
    }
    setError(null);
  }, [node, outgoing, nodes]);

  return (
    <div className="p-2 space-y-2 flex-1 overflow-auto">
      <input
        className="w-full border p-1"
        placeholder="Title"
        value={(node.data as any).title || ''}
        onChange={(e) => updateNode({ title: e.target.value })}
      />
      <textarea
        className="w-full border p-1"
        rows={6}
        placeholder="Description"
        value={(node.data as any).text || ''}
        onChange={(e) => updateNode({ text: e.target.value })}
      />
      <ImageUpload
        nodeId={node.id}
        onUrl={(url) => updateNode({ image: url })}
      />
      {(node.data as any).image && <img src={(node.data as any).image} alt="" className="w-full" />}
      <div>
        <label className="block text-sm">Buttons</label>
        <select
          className="border p-1"
          value={outgoing.length}
          onChange={(e) => setButtonCount(parseInt(e.target.value, 10))}
        >
          {[1, 2, 3, 4].map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <div className="space-y-2 mt-2">
          {outgoing.map((e, idx) => (
            <div key={e.id} className="space-y-1">
              <input
                className="w-full border p-1"
                placeholder={`Label ${idx + 1}`}
                value={(e.label as string) || ''}
                onChange={(ev) => updateEdge(e.id, { label: ev.target.value })}
              />
              <select
                className="w-full border p-1"
                value={e.target}
                onChange={(ev) => updateEdge(e.id, { target: ev.target.value })}
              >
                {nodes.map((n) => (
                  <option key={n.id} value={n.id}>
                    {(n.data as any).title || n.id}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
    </div>
  );
}

