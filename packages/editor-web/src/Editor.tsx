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
  NodeTypes,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useCallback, useEffect, useState } from 'react';
import { api } from './supabaseClient';
import Sidebar from './Sidebar';
import ExportPanel from './ExportPanel';
import NodeEditor from './NodeEditor';
import StoryNode from './StoryNode';

export default function Editor() {
  const [nodes, setNodes, onNodesChange] = useNodesState([] as Node[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([] as Edge[]);
  const [history, setHistory] = useState<{ nodes: Node[]; edges: Edge[] }[]>([]);
  const [future, setFuture] = useState<{ nodes: Node[]; edges: Edge[] }[]>([]);
  const [selected, setSelected] = useState<Node | null>(null);
  const reactFlow = useReactFlow();
  const nodeTypes: NodeTypes = { story: StoryNode };

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const { data: nodeData } = await api.client
      .from('nodes')
      .select('id, title, text, image_url');
    if (nodeData) {
      const loadedNodes: Node[] = nodeData.map((n: any, idx: number) => ({
        id: String(n.id),
        type: 'story',
        position: { x: idx * 100, y: idx * 80 },
        data: { title: n.title ?? '', text: n.text ?? '', image: n.image_url ?? '' },
      }));
      setNodes(loadedNodes);
    }

    const { data: actionData } = await api.client
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
      api.client
        .from('nodes')
        .upsert(
          nodes.map((n) => ({
            id: parseInt(n.id, 10),
            title: (n.data as any).title,
            text: (n.data as any).text,
            image_url: (n.data as any).image ?? null,
          }))
        );

      api.client
        .from('actions')
        .upsert(
          edges.map((e) => ({
            id: e.id,
            node_id: e.source,
            target_id: e.target,
            label: (e.label as string) ?? '',
          }))
        );

      api.client.from('revisions').insert({
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
    setHistory((h) => [...h.slice(-9), { nodes, edges }]);
    const nextId =
      nodes.reduce((max, n) => Math.max(max, parseInt(n.id, 10)), 0) + 1;
    setNodes((nds) => [
      ...nds,
      {
        id: String(nextId),
        type: 'story',
        position: { x: 0, y: nds.length * 80 },
        data: { title: '', text: '', image: '' },
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
      const nextId =
        nodes.reduce((max, n) => Math.max(max, parseInt(n.id, 10)), 0) + 1;
      setNodes((nds) => [
        ...nds,
        {
          id: String(nextId),
          type: 'story',
          position,
          data: { title: '', text: '', image: '' },
        },
      ]);
    }
  };

  const onConnect = useCallback((params: Connection) => {
    setHistory((h) => [...h.slice(-9), { nodes, edges }]);
    setEdges((eds) => addEdge(params, eds));
  }, [edges, nodes, setEdges]);

  const onNodeClick = (_: any, node: Node) => {
    setSelected(node);
  };

  const handleNodesChange: OnNodesChange = useCallback(
    (changes) => {
      setHistory((h) => [...h.slice(-9), { nodes, edges }]);
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
      setHistory((h) => [...h.slice(-9), { nodes, edges }]);
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

  const search = () => {
    const query = prompt('Find node ID or title');
    if (!query) return;
    const lower = query.toLowerCase();
    const node = nodes.find(
      (n) =>
        n.id === query ||
        ((n.data as any).title || '').toLowerCase().includes(lower)
    );
    if (node) {
      reactFlow.setCenter(node.position.x, node.position.y, { zoom: 1.2 });
      setSelected(node);
    }
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        save(nodes, edges);
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault();
        search();
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        undo();
      } else if ((e.metaKey || e.ctrlKey) && (e.shiftKey && e.key === 'z')) {
        e.preventDefault();
        redo();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [nodes, edges, save, undo, redo]);

  const edgeTargets = new Set(edges.map((e) => e.target));
  const nodeIds = new Set(nodes.map((n) => n.id));
  const renderNodes = nodes.map((n) => ({
    ...n,
    style: edgeTargets.has(n.id)
      ? n.style
      : { ...(n.style || {}), borderColor: 'red', borderWidth: 2 },
  }));
  const renderEdges = edges.map((e) => ({
    ...e,
    style: nodeIds.has(e.target)
      ? e.style
      : { ...(e.style || {}), stroke: 'red' },
  }));

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
            nodes={renderNodes}
            edges={renderEdges}
            nodeTypes={nodeTypes}
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
            <NodeEditor
              node={selected}
              nodes={nodes}
              setNodes={setNodes}
              edges={edges}
              setEdges={setEdges}
              setSelected={setSelected}
            />
          )}
          <ExportPanel nodes={nodes} edges={edges} />
        </div>
      </div>
  );
}
