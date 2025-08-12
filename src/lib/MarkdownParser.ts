import { unified } from 'unified';
import remarkParse from 'remark-parse';
import { visit } from 'unist-util-visit';
import type { Root, Heading } from 'mdast';

export interface MindMapNode {
  id: string;
  content: string;
  children: MindMapNode[];
}

export function parseMarkdownToTree(markdown: string, rootName: string): MindMapNode | null {
  const ast = unified().use(remarkParse).parse(markdown) as Root;
  const root: MindMapNode = { id: 'root', content: rootName, children: [] };
  const stack: MindMapNode[] = [root];
  let currentId = 0;

  visit(ast, 'heading', (node: Heading) => {
    const level = node.depth;
    const content = node.children.map((child: any) => child.value).join('');
    const newNode: MindMapNode = {
      id: `node-${++currentId}`,
      content,
      children: [],
    };

    while (stack.length > level) {
      stack.pop();
    }

    const parent = stack[stack.length - 1];
    parent.children.push(newNode);
    stack.push(newNode);
  });

  return root.children.length > 0 ? root : null;
}