## md2mindmap — Convert Markdown to Interactive Mind Maps

md2mindmap is a lightweight web app that turns your Markdown documents into interactive, auto‑laid‑out mind maps. Drop in a `.md` file or paste Markdown text, and explore the structure visually with pan and zoom.

For the Chinese version, see `README_ZH.md`.

### Features
- Headings and lists become a hierarchical mind map
- Automatic layout with clean spacing using Dagre
- Interactive canvas with pan/zoom powered by React Flow
- Instant rendering after upload or paste
- Built‑in example Markdown files under `public/demo/`

### Tech Stack
- React 19 + Vite 7 (fast dev, HMR)
- TypeScript 5 with `@` alias to `./src`
- Tailwind CSS v4 and `shadcn/ui` for UI
- Graph: `@xyflow/react` (React Flow) + `dagre` for layout
- Markdown: `unified` + `remark-parse` + `unist-util-visit`
- Tooling: ESLint 9 (typescript-eslint, react-hooks, react-refresh)

### How It Works
1. Markdown is parsed into an AST via `remark-parse`.
2. The AST is transformed into a tree data structure.
3. The tree is converted to React Flow nodes and edges and laid out by Dagre.
4. The canvas renders an interactive mind map.

Key modules:
- `src/components/MarkdownUploader.tsx`: file/text input and example loader
- `src/components/MindMap.tsx` and `src/components/MindMapNode.tsx`: visual graph
- `src/lib/MarkdownParser.ts`: Markdown → AST → tree
- `src/lib/tree-converter.ts`: tree → nodes/edges for React Flow

### Getting Started
Prerequisites:
- Node.js 18+ (recommended 20+)
- pnpm 8+

Install dependencies:
```bash
pnpm install
```

Start the dev server:
```bash
pnpm dev
```

Build for production:
```bash
pnpm build
```

Preview the production build:
```bash
pnpm preview
```

Lint the project:
```bash
pnpm lint
```

### Usage
1. Run the dev server and open `http://localhost:5173/`.
2. Upload a `.md` file from `public/demo/` or paste Markdown text.
3. Pan and zoom to explore the generated mind map.

Minimal Markdown example:
```markdown
# Project Plan

## Milestones
- M1: Research
- M2: Prototype

## Tasks
1. Gather requirements
2. Build MVP
```

### Project Structure
- `src/components/ui/*`: prebuilt `shadcn/ui` components
- `src/lib/utils.ts`: small utilities
- `src/index.css`: Tailwind v4 entry and base styles
- `vite.config.ts`: Vite config with `@` → `./src`

### Notes
- The current parser focuses on headings and lists for hierarchy. Other Markdown constructs are preserved where possible in node labels but may not affect structure.

### License
MIT — see `LICENSE`.

### Acknowledgements
- React and Vite
- React Flow (`@xyflow/react`) and Dagre
- unified/remark ecosystem
- Tailwind CSS and shadcn/ui