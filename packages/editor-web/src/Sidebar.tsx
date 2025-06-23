import React from 'react';

export default function Sidebar() {
  const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-40 p-2 border-r">
      <div
        className="p-2 bg-gray-200 rounded cursor-grab"
        onDragStart={(event) => onDragStart(event, 'default')}
        draggable
      >
        Node
      </div>
    </aside>
  );
}
