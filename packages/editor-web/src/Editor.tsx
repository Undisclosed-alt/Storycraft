import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  Connection,
  Edge,
  Node,
  OnEdgesChange,
  OnNodesChange,
  useEdgesState,
  useNodesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useCallback, useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import produce from 'immer';

export default function Editor() {
  const [nodes, setNodes, onNodesChange] = useNodesState([] as Node[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([] as Edge[]);
  const [history, setHistory] = useState<{ nodes: Node[]; edges: Edge[] }[]>([]);
  const [future, setFuture] = useState<{ nodes: Node[]; edges: Edge[] }[]>([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const { data } = await supabase.from('nodes').select('id, text');
    if (data) {
      const loadedNodes: Node[] = data.map((n: any, idx: number) => ({
        id: n.id,
        position: { x: idx * 100, y: idx * 80 },
        data: { label: n.text },
      }));
      setNodes(loadedNodes);
    }
  };

  const save = useCallback(
    (nodes: Node[]) => {
      supabase
        .from('nodes')
        .upsert(nodes.map((n) => ({ id: n.id, text: (n.data as any).label })));
    },
    []
  );

  useEffect(() => {
    if (nodes.length === 0) return;
    const t = setTimeout(() => save(nodes), 1000);
    return () => clearTimeout(t);
  }, [nodes, save]);

  const addNode = () => {
    setHistory((h) => [...h, { nodes, edges }]);
    const id = crypto.randomUUID();
    setNodes((nds) => [
      ...nds,
      { id, position: { x: 0, y: nds.length * 80 }, data: { label: 'New Node' } },
    ]);
  };

  const onConnect = useCallback((params: Connection) => {
    setHistory((h) => [...h, { nodes, edges }]);
    setEdges((eds) => addEdge(params, eds));
  }, [edges, nodes, setEdges]);

  const handleNodesChange: OnNodesChange = useCallback(
    (changes) => {
      setHistory((h) => [...h, { nodes, edges }]);
      onNodesChange(changes);
    },
    [edges, nodes, onNodesChange]
  );

  const handleEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      setHistory((h) => [...h, { nodes, edges }]);
      onEdgesChange(changes);
    },
    [edges, nodes, onEdgesChange]
  );

  const undo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setFuture((f) => [{ nodes, edges }, ...f]);
    setHistory((h) => h.slice(0, -1));
    setNodes(prev.nodes);
    setEdges(prev.edges);
  };

  const redo = () => {
    if (future.length === 0) return;
    const next = future[0];
    setHistory((h) => [...h, { nodes, edges }]);
    setFuture((f) => f.slice(1));
    setNodes(next.nodes);
    setEdges(next.edges);
  };

  return (
    <div className="h-screen">
      <div className="p-2 space-x-2">
        <button onClick={addNode} className="bg-blue-500 text-white px-2 py-1 rounded">Add Node</button>
        <button onClick={undo} className="bg-gray-300 px-2 py-1 rounded">Undo</button>
        <button onClick={redo} className="bg-gray-300 px-2 py-1 rounded">Redo</button>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}
