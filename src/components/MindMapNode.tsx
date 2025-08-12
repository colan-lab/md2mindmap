import React from 'react';
import { Handle, Position } from '@xyflow/react';

const MindMapNode: React.FC<any> = ({ id, data }) => {
  const { label, isCollapsed, onToggleCollapse, hasChildren, styles } = data;

  return (
    <>
      <div
        className={`px-4 py-2 shadow-md rounded-md border-2 flex items-center ${styles.container}`}
      >
        <div className={`flex-grow font-medium ${styles.text}`}>{label}</div>
        {hasChildren && onToggleCollapse && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCollapse(id);
            }}
            className={`nodrag ml-2 p-1 rounded-full ${styles.buttonHover}`}
            style={{ cursor: 'pointer' }}
          >
            {isCollapsed ? '+' : '-'}
          </button>
        )}
      </div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </>
  );
};

export default React.memo(MindMapNode);