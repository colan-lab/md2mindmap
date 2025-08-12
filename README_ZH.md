## md2mindmap — 将 Markdown 转换为交互式思维导图

md2mindmap 是一个将 Markdown 文档转化为交互式思维导图的轻量 Web 应用。你可以拖拽上传 `.md` 文件或直接粘贴文本，应用会自动布局并渲染为可缩放、可平移的导图。

English version: see `README.md`.

### 功能特点
- 将标题与列表结构映射为层级化思维导图
- 使用 Dagre 自动布局、边距与间距合理
- 画布支持平移缩放（React Flow 提供）
- 上传/粘贴后即时渲染
- 自带示例 Markdown（见 `public/demo/`）

### 技术栈
- React 19 + Vite 7（开发快、HMR）
- TypeScript 5，配置 `@` 别名到 `./src`
- Tailwind CSS v4 与 `shadcn/ui` 负责 UI
- 图可视化：`@xyflow/react`（React Flow）+ `dagre` 自动布局
- Markdown：`unified` + `remark-parse` + `unist-util-visit`
- 工具链：ESLint 9（typescript-eslint、react-hooks、react-refresh）

### 实现原理
1. 使用 `remark-parse` 将 Markdown 解析为 AST。
2. 将 AST 转换为树形数据结构。
3. 将树转换为 React Flow 的节点与边，并用 Dagre 进行布局。
4. 在画布上渲染交互式思维导图。

关键模块：
- `src/components/MarkdownUploader.tsx`：文件/文本输入、示例加载
- `src/components/MindMap.tsx` 与 `src/components/MindMapNode.tsx`：图形渲染
- `src/lib/MarkdownParser.ts`：Markdown → AST → 树
- `src/lib/tree-converter.ts`：树 → React Flow 的节点/边

### 快速开始
环境要求：
- Node.js 18+（推荐 20+）
- pnpm 8+

安装依赖：
```bash
pnpm install
```

启动开发服务：
```bash
pnpm dev
```

打包生产构建：
```bash
pnpm build
```

预览生产构建：
```bash
pnpm preview
```

代码检查：
```bash
pnpm lint
```

### 使用方法
1. 运行开发服务，打开 `http://localhost:5173/`。
2. 上传 `public/demo/` 下的 `.md` 示例，或直接粘贴 Markdown 文本。
3. 在画布中平移缩放查看生成的思维导图。

最小示例 Markdown：
```markdown
# 项目计划

## 里程碑
- M1：调研
- M2：原型

## 任务
1. 需求收集
2. 构建 MVP
```

### 项目结构
- `src/components/ui/*`：预置的 `shadcn/ui` 组件
- `src/lib/utils.ts`：小型工具函数
- `src/index.css`：Tailwind v4 入口与基础样式
- `vite.config.ts`：Vite 配置（`@` → `./src`）

### 备注
- 当前解析器主要使用标题与列表构建层级结构。其他 Markdown 语法在节点文本中尽可能保留，但通常不影响结构。

### 许可证
MIT — 详见 `LICENSE`。

### 鸣谢
- React 与 Vite
- React Flow（`@xyflow/react`）与 Dagre
- unified/remark 生态
- Tailwind CSS 与 shadcn/ui

