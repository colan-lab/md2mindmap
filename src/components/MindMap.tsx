import { useEffect, useCallback, useState, useMemo } from 'react';
import { ReactFlow, Controls, Background, ReactFlowProvider, useReactFlow, useNodesState, useEdgesState, Panel, BackgroundVariant } from '@xyflow/react';
import type { Node, Edge } from '@xyflow/react';
import dagre from 'dagre';
import '@xyflow/react/dist/style.css';
import MindMapNode from './MindMapNode';

// Use a fresh dagre graph per layout to avoid stale nodes/edges affecting results

const nodeWidth = 172;
const nodeHeight = 36;

const getLayoutedElements = (nodes: Node[], edges: Edge[], collapsedNodeIds: Set<string>) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: 'LR', nodesep: 80, ranksep: 150 });

  // Build a parent lookup from edges: child -> parent
  const childToParent = new Map<string, string>();
  edges.forEach((edge) => {
    childToParent.set(edge.target, edge.source);
  });

  const hasCollapsedAncestor = (nodeId: string): boolean => {
    let currentParentId = childToParent.get(nodeId);
    while (currentParentId) {
      if (collapsedNodeIds.has(currentParentId)) return true;
      currentParentId = childToParent.get(currentParentId);
    }
    return false;
  };

  const visibleNodes = nodes.filter((node) => !hasCollapsedAncestor(node.id));
  const visibleNodeIds = new Set(visibleNodes.map((n) => n.id));
  const visibleEdges = edges.filter(
    (e) => visibleNodeIds.has(e.source) && visibleNodeIds.has(e.target)
  );

  visibleNodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  visibleEdges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    if (!visibleNodeIds.has(node.id)) {
      node.hidden = true;
    } else {
      const nodeWithPosition = dagreGraph.node(node.id);
      node.position = {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      };
      node.hidden = false;
    }
    return node;
  });

  return { nodes, edges: visibleEdges };
};

type ThemeName = 'light' | 'dark' | 'ocean' | 'forest' | 'grape';

const THEME_CONFIG: Record<ThemeName, {
  canvasClass: string;
  backgroundDotsColor: string;
  panelClass: string;
  node: {
    container: string;
    text: string;
    buttonHover: string;
  }
}> = {
  light: {
    canvasClass: 'bg-white',
    backgroundDotsColor: '#e5e7eb',
    panelClass: 'bg-white text-gray-700 border-gray-200',
    node: {
      container: 'border-stone-300 bg-white text-zinc-900',
      text: 'text-zinc-900',
      buttonHover: 'hover:bg-gray-200',
    },
  },
  dark: {
    canvasClass: 'bg-zinc-900',
    backgroundDotsColor: '#374151',
    panelClass: 'bg-zinc-800 text-zinc-100 border-zinc-600',
    node: {
      container: 'border-zinc-600 bg-zinc-800 text-zinc-100',
      text: 'text-zinc-100',
      buttonHover: 'hover:bg-zinc-700',
    },
  },
  ocean: {
    canvasClass: 'bg-sky-50',
    backgroundDotsColor: '#bae6fd',
    panelClass: 'bg-white text-sky-900 border-sky-300',
    node: {
      container: 'border-sky-300 bg-sky-100 text-sky-900',
      text: 'text-sky-900',
      buttonHover: 'hover:bg-sky-200',
    },
  },
  forest: {
    canvasClass: 'bg-emerald-50',
    backgroundDotsColor: '#a7f3d0',
    panelClass: 'bg-white text-emerald-900 border-emerald-300',
    node: {
      container: 'border-emerald-300 bg-emerald-100 text-emerald-900',
      text: 'text-emerald-900',
      buttonHover: 'hover:bg-emerald-200',
    },
  },
  grape: {
    canvasClass: 'bg-purple-50',
    backgroundDotsColor: '#e9d5ff',
    panelClass: 'bg-white text-purple-900 border-purple-300',
    node: {
      container: 'border-purple-300 bg-purple-100 text-purple-900',
      text: 'text-purple-900',
      buttonHover: 'hover:bg-purple-200',
    },
  },
};

interface MindMapProps {
  nodes: Node[];
  edges: Edge[];
}

const nodeTypes = {
  mindmap: MindMapNode,
};

function LayoutFlow({ nodes: initialNodes, edges: initialEdges }: MindMapProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [collapsedNodeIds, setCollapsedNodeIds] = useState<Set<string>>(new Set());
  const [allCollapsed, setAllCollapsed] = useState(false);
  const [theme, setTheme] = useState<ThemeName>('light');
  const { fitView } = useReactFlow();

  const onToggleCollapse = useCallback((nodeId: string) => {
    setCollapsedNodeIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  }, []);

  const toggleAllNodes = useCallback(() => {
    setAllCollapsed(prev => {
      const shouldCollapse = !prev;
      if (shouldCollapse) {
        const allParentNodes = new Set(initialEdges.map(e => e.source));
        setCollapsedNodeIds(allParentNodes);
      } else {
        setCollapsedNodeIds(new Set());
      }
      return shouldCollapse;
    });
  }, [initialEdges]);

  const nodesWithData = useMemo(() => {
    const styles = THEME_CONFIG[theme].node;
    return initialNodes.map(node => ({
      ...node,
      type: 'mindmap',
      data: {
        ...node.data,
        label: node.data.label,
        isCollapsed: collapsedNodeIds.has(node.id),
        onToggleCollapse,
        hasChildren: initialEdges.some(edge => edge.source === node.id),
        styles,
      },
    }));
  }, [initialNodes, initialEdges, collapsedNodeIds, onToggleCollapse, theme]);

  useEffect(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodesWithData,
      initialEdges,
      collapsedNodeIds
    );

    setNodes(layoutedNodes);
    setEdges(layoutedEdges);

    window.requestAnimationFrame(() => {
      fitView();
    });
  }, [nodesWithData, initialEdges, setNodes, setEdges, fitView, collapsedNodeIds]);

  return (
    <>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        className={THEME_CONFIG[theme].canvasClass}
      >
        <Panel position="top-left">
          <div className={`rounded border px-2 py-1 shadow flex items-center gap-2 ${THEME_CONFIG[theme].panelClass}`}>
            <label className="text-sm text-gray-700">Theme</label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as ThemeName)}
              className="nodrag border rounded px-2 py-1 text-sm bg-transparent"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="ocean">Ocean</option>
              <option value="forest">Forest</option>
              <option value="grape">Grape</option>
            </select>
          </div>
        </Panel>
        <Panel position="top-right">
          <button onClick={toggleAllNodes} className={`rounded border px-2 py-1 shadow ${THEME_CONFIG[theme].panelClass}`}>
            {allCollapsed ? 'Expand All' : 'Collapse All'}
          </button>
        </Panel>
        <Controls />
        <Background
          variant={BackgroundVariant.Dots}
          color={THEME_CONFIG[theme].backgroundDotsColor}
          gap={24}
          size={1}
        />
      </ReactFlow>
    </>
  );
}

export function MindMap(props: MindMapProps) {
  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      <ReactFlowProvider>
        <LayoutFlow {...props} />
      </ReactFlowProvider>
    </div>
  );
}