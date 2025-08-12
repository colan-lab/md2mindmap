# 项目架构图

这是一个使用 Mermaid 绘制的项目架构图，展示了项目的核心组件和它们之间的相互关系。

```mermaid
graph TD
    subgraph "构建与开发环境 (Build & Dev Environment)"
        A[Vite]
        B[TypeScript]
        C[ESLint]
    end

    subgraph "源代码 (src)"
        D["main.tsx (应用入口)"] --> E["App.tsx (主应用 / 组件画廊)"]
        E --> F["components/ui (Shadcn UI 组件)"]
        E --> G["lib (工具函数)"]
        E --> H["hooks (自定义 Hooks)"]
    end

    subgraph "UI 核心与依赖库 (UI Core & Dependencies)"
        F --> I["Radix UI (底层组件原语)"]
        F --> J["lucide-react (图标库)"]
        K["Tailwind CSS"] --> L["index.css (全局样式与 CSS 变量)"]
        M["React Hook Form & Zod (表单)"]
        N["Recharts (图表)"]
        O["Sonner (通知)"]
    end

    %% 关系连接
    A & B -- "编译与打包" --> D
    L -- "注入全局样式" --> E
    E -- "使用" --> M
    E -- "使用" --> N
    E -- "使用" --> O

    %% 样式定义
    style F fill:#f9f,stroke:#333,stroke-width:2px
    style I fill:#ccf,stroke:#333,stroke-width:2px
    style K fill:#bdf,stroke:#333,stroke-width:2px
```

**图表解读:**

1.  **构建与开发环境**: 项目的根基是 Vite、TypeScript 和 ESLint，它们共同保证了开发的效率和代码的质量。
2.  **源代码**:
    *   `main.tsx` 是整个应用的入口文件。
    *   `App.tsx` 是当前的核心组件，它作为一个“组件画廊”，集中展示和测试了项目中所有的 UI 组件。
    *   `components/ui` 目录是 `shadcn/ui` 组件的所在地，是 UI 的核心。
    *   `lib` 和 `hooks` 提供了可复用的逻辑和功能。
3.  **UI 核心与依赖库**:
    *   `shadcn/ui` 组件（F）构建在 `Radix UI`（I）之上，并使用 `lucide-react`（J）作为图标。
    *   `Tailwind CSS`（K）通过处理 `index.css`（L）为整个应用提供样式。
    *   应用（E）直接使用了如表单、图表和通知等库（M, N, O）来构建复杂功能。

架构图已绘制完成。接下来，我将分析项目的核心功能和代码结构。