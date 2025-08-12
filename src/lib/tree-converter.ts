import type { Edge, Node } from '@xyflow/react';
import type { MindMapNode } from './MarkdownParser';

export function convertTreeToFlow(tree: MindMapNode): { nodes: Node[], edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  function traverse(node: MindMapNode, parentId?: string) {
    const newNode: Node = {
      id: node.id,
      position: { x: 0, y: 0 }, // Position will be set by layout
      data: { label: node.content },
    };
    nodes.push(newNode);

    if (parentId) {
      edges.push({
        id: `e-${parentId}-${node.id}`,
        source: parentId,
        target: node.id,
      });
    }

    node.children.forEach(child => traverse(child, node.id));
  }

  traverse(tree);

  return { nodes, edges };
}