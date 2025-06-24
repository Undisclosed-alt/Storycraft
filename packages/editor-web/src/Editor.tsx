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
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useCallback, useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import Sidebar from './Sidebar';
import ImageUpload from './ImageUpload';
import ExportPanel from './ExportPanel';

export default function Editor() {
  const [nodes, setNodes, onNodesChange] = useNodesState([] as Node[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([] as Edge[]);
  const [history, setHistory] = useState<{ nodes: Node[]; edges: Edge[] }[]>([]);
  const [future, setFuture] = useState<{ nodes: Node[]; edges: Edge[] }[]>([]);
  const [selected, setSelected] = useState<Node | null>(null);
  const reactFlow = useReactFlow();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const { data: nodeData } = await supabase
      .from('nodes')
      .select('id, text, image_url');
    if (nodeData) {
      const loadedNodes: Node[] = nodeData.map((n: any, idx: number) => ({
        id: n.id,
        position: { x: idx * 100, y: idx * 80 },
        data: { label: n.text, image: n.image_url ?? '' },
      }));
      setNodes(loadedNodes);
    }

    const { data: actionData } = await supabase
      .from('actions')
      .select('id, node_id, target_id, label');
    if (actionData) {
      const loadedEdges: Edge[] = actionData.map((a: any) => ({
        id: a.id,
        source: a.node_id,
        target: a.target_id,
        label: a.label,
      }));
      setEdges(loadedEdges);
    }
  };

  const save = useCallback(
    (nodes: Node[], edges: Edge[]) => {
      supabase
        .from('nodes')
        .upsert(
          nodes.map((n) => ({
            id: n.id,
            text: (n.data as any).label,
            image_url: (n.data as any).image ?? null,
          }))
        );

      supabase
        .from('actions')
        .upsert(
          edges.map((e) => ({
            id: e.id,
            node_id: e.source,
            target_id: e.target,
            label: (e.label as string) ?? '',
          }))
        );

      supabase.from('revisions').insert({
        id: crypto.randomUUID(),
        story_id: 'demo-story',
        data: { nodes, edges },
      });
    },
    []
  );

  useEffect(() => {
    if (nodes.length === 0) return;
    const t = setTimeout(() => save(nodes, edges), 1000);
    return () => clearTimeout(t);
  }, [nodes, edges, save]);

  const addNode = () => {
    setHistory((h) => [...h, { nodes, edges }]);
    const id = crypto.randomUUID();
    setNodes((nds) => [
      ...nds,
      {
        id,
        position: { x: 0, y: nds.length * 80 },
        data: { label: 'New Node', image: '' },
      },
    ]);
  };

  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const type = event.dataTransfer.getData('application/reactflow');
    if (type) {
      const position = reactFlow.project({ x: event.clientX, y: event.clientY });
      const id = crypto.randomUUID();
      setNodes((nds) => [
        ...nds,
        { id, position, data: { label: 'New Node', image: '' } },
      ]);
    }
  };

  const onConnect = useCallback((params: Connection) => {
    setHistory((h) => [...h, { nodes, edges }]);
    setEdges((eds) => addEdge(params, eds));
  }, [edges, nodes, setEdges]);

  const onNodeClick = (_: any, node: Node) => {
    setSelected(node);
  };

  const handleNodesChange: OnNodesChange = useCallback(
    (changes) => {
      setHistory((h) => [...h, { nodes, edges }]);
      onNodesChange(changes);
    },
    [edges, nodes, onNodesChange]
  );

  useEffect(() => {
    if (!selected) return;
    const n = nodes.find((n) => n.id === selected.id);
    if (n) setSelected(n);
  }, [nodes]);

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
      <div className="h-screen flex">
        <Sidebar />
        <div className="flex-1" onDrop={onDrop} onDragOver={onDragOver}>
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
            onNodeClick={onNodeClick}
            fitView
          >
            <MiniMap />
            <Controls />
            <Background />
          </ReactFlow>
        </div>
        <div className="w-64 border-l flex flex-col">
          {selected && (
            <div className="p-2 space-y-2 flex-1 overflow-auto">
              <textarea
                className="w-full border p-1"
                rows={6}
                value={(selected.data as any).label}
                onChange={(e) =>
                  setNodes((nds) =>
                    nds.map((n) =>
                      n.id === selected.id
                        ? { ...n, data: { ...n.data, label: e.target.value } }
                        : n
                    )
                  )
                }
              />
              <ImageUpload
                nodeId={selected.id}
                onUrl={(url) =>
                  setNodes((nds) =>
                    nds.map((n) =>
                      n.id === selected.id
                        ? { ...n, data: { ...n.data, image: url } }
                        : n
                    )
                  )
                }
              />
              {(selected.data as any).image && (
                <img
                  src={(selected.data as any).image}
                  alt=""
                  className="w-full"
                />
              )}
            </div>
          )}
          <ExportPanel nodes={nodes} edges={edges} />
        </div>
      </div>
  );
}
