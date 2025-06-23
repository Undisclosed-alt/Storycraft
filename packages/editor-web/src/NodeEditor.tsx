import { useEffect, useState } from 'react';
import { Node } from 'reactflow';

interface Props {
  node: Node | null;
  onChange: (data: Partial<any>) => void;
}

export default function NodeEditor({ node, onChange }: Props) {
  const [text, setText] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    setText((node?.data as any)?.label ?? '');
    setImage((node?.data as any)?.image ?? '');
  }, [node]);

  if (!node) {
    return <div className="w-64 p-4 border-l">Select a node</div>;
  }

  return (
    <div className="w-64 p-4 border-l space-y-2 bg-gray-50">
      <textarea
        className="w-full border p-1 text-sm"
        rows={6}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          onChange({ label: e.target.value });
        }}
        placeholder="Description (Markdown)"
      />
      <input
        className="w-full border p-1 text-sm"
        value={image}
        onChange={(e) => {
          setImage(e.target.value);
          onChange({ image: e.target.value });
        }}
        placeholder="Image URL"
      />
    </div>
  );
}
