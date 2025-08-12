import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ChangeEvent } from "react";

interface MarkdownUploaderProps {
  onFileUpload: (content: string, filename: string) => void;
}

export function MarkdownUploader({ onFileUpload }: MarkdownUploaderProps) {
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onFileUpload(content, file.name);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="markdown-file">Upload Markdown</Label>
      <Input id="markdown-file" type="file" accept=".md" onChange={handleFileChange} />
    </div>
  );
}