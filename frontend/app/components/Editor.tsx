"use client";

import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useEffect, useMemo } from "react";

interface EditorProps {
  initialContent?: string;
  onChange: (json: string) => void;
  editable?: boolean;
}

export default function Editor({ initialContent, onChange, editable = true }: EditorProps) {
  // Parse initial content safely
  const initialBlocks = useMemo(() => {
    if (!initialContent) return undefined;
    try {
      return JSON.parse(initialContent);
    } catch (e) {
      // If it's plain text, convert to a single paragraph block
      return [
        {
          type: "paragraph",
          content: initialContent,
        },
      ];
    }
  }, [initialContent]);

  const editor = useCreateBlockNote({
    initialContent: initialBlocks,
  });

  // Handle changes
  const handleChange = () => {
    const json = JSON.stringify(editor.document);
    onChange(json);
  };

  return (
    <div className="blocknote-editor-wrapper bg-white/5 border border-white/10 rounded-xl overflow-hidden min-h-[150px]">
      <BlockNoteView 
        editor={editor} 
        editable={editable}
        onChange={handleChange}
        theme="dark"
      />
      <style jsx global>{`
        .blocknote-editor-wrapper .bn-container {
          background-color: transparent !important;
          padding: 12px !important;
        }
        .blocknote-editor-wrapper .bn-editor {
          padding-inline: 0 !important;
          min-height: 120px;
        }
        /* Custom scrollbar for editor */
        .blocknote-editor-wrapper .bn-editor::-webkit-scrollbar {
          width: 4px;
        }
        .blocknote-editor-wrapper .bn-editor::-webkit-scrollbar-track {
          background: transparent;
        }
        .blocknote-editor-wrapper .bn-editor::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
