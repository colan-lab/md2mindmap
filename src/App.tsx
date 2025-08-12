import { useState, useMemo, useEffect } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { MarkdownUploader } from "@/components/MarkdownUploader";
import { parseMarkdownToTree } from "@/lib/MarkdownParser";
import { MindMap } from "@/components/MindMap";
import { convertTreeToFlow } from "@/lib/tree-converter";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function App() {
  const [markdown, setMarkdown] = useState("");
  const [filename, setFilename] = useState("example.md");
  const [error, setError] = useState<string | null>(null);
  const [demo, setDemo] = useState<string>("");

  useEffect(() => {
    fetch('/example.md')
      .then(response => response.text())
      .then(text => {
        setMarkdown(text)
        setFilename('example.md')
      });
  }, []);

  useEffect(() => {
    if (!demo) return;
    const path = `/demo/${demo}`;
    fetch(path)
      .then(res => res.text())
      .then(text => {
        setMarkdown(text);
        setFilename(demo);
      });
  }, [demo]);

  const { nodes, edges } = useMemo(() => {
    if (!markdown) return { nodes: [], edges: [] };
    try {
      const tree = parseMarkdownToTree(markdown, filename);
      if (!tree) {
        setError("Could not parse Markdown. Please check the format.");
        return { nodes: [], edges: [] };
      }
      setError(null);
      return convertTreeToFlow(tree);
    } catch (e) {
      setError("An unexpected error occurred during parsing.");
      return { nodes: [], edges: [] };
    }
  }, [markdown, filename]);

  const handleMarkdownUpload = (content: string, name: string) => {
    setMarkdown(content);
    setFilename(name);
  };

  return (
    <ResizablePanelGroup direction="horizontal" className="min-h-dvh w-full">
      <ResizablePanel defaultSize={25}>
        <div className="p-4 space-y-4 h-full flex flex-col">
          <h1 className="text-2xl font-bold">Markdown to Mind Map</h1>
          <MarkdownUploader onFileUpload={handleMarkdownUpload} />
          <select
            className="border rounded px-2 py-1 text-sm"
            value={demo}
            onChange={(e) => setDemo(e.target.value)}
          >
            <option value="">Select demo…</option>
            <option value="project-plan.md">Project Plan</option>
            <option value="product-spec.md">Product Spec</option>
            <option value="meeting-notes.md">Meeting Notes</option>
            <option value="quickstart.md">Quickstart</option>
          </select>
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="flex-grow mt-4">
            <textarea
              className="w-full h-full p-2 border rounded"
              value={markdown}
              readOnly
            />
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={75}>
        <MindMap nodes={nodes} edges={edges} />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
