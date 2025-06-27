import { NodeProps, Handle, Position } from 'reactflow';
import { formatId } from './utils';

export default function StoryNode({ id, data }: NodeProps) {
  const { title, image } = data as any;
  return (
    <div className="bg-white rounded border text-xs w-32">
      {image && (
        <div
          className="h-16 bg-cover bg-center rounded-t"
          style={{ backgroundImage: `url(${image})` }}
        />
      )}
      <div className="p-1 text-center font-medium">
        {formatId(id)} &middot; {title || '(untitled)'}
      </div>
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
    </div>
  );
}
