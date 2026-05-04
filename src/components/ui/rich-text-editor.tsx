"use client";

import React, { useRef, useEffect } from 'react';
import { Bold, Italic, List, ListOrdered, Type } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  // Initialize content
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, []);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    handleInput();
  };

  const handleFontSize = (size: string) => {
    // execCommand('fontSize', size) uses 1-7. 
    // For more control, we can use formatBlock or custom spans but execCommand is simpler.
    execCommand('fontSize', size);
  };

  return (
    <div className={cn("border border-slate-200 rounded-md overflow-hidden bg-white", className)}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-slate-100 bg-slate-50/50">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => execCommand('bold')}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => execCommand('italic')}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-4 bg-slate-200 mx-1" />

        <div className="flex items-center gap-1 px-2">
          <Type className="h-3.5 w-3.5 text-slate-400 mr-1" />
          <select 
            className="text-xs bg-transparent border-none outline-none focus:ring-0 cursor-pointer font-medium"
            onChange={(e) => handleFontSize(e.target.value)}
            defaultValue="3"
          >
            <option value="1">Small</option>
            <option value="3">Normal</option>
            <option value="5">Large</option>
            <option value="7">Extra Large</option>
          </select>
        </div>

        <div className="w-px h-4 bg-slate-200 mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => execCommand('insertUnorderedList')}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => execCommand('insertOrderedList')}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="p-4 min-h-[250px] outline-none focus:ring-0 text-sm editor-content max-w-none"
        data-placeholder={placeholder}
        style={{ 
          wordBreak: 'break-word',
          overflowY: 'auto'
        }}
      />
      
      <style jsx>{`
        [contentEditable]:empty:before {
          content: attr(data-placeholder);
          color: #94a3b8;
          cursor: text;
        }
        .editor-content b, .editor-content strong { font-weight: bold; }
        .editor-content i, .editor-content em { font-style: italic; }
        .editor-content ul { list-style-type: disc; padding-left: 1.5rem; }
        .editor-content ol { list-style-type: decimal; padding-left: 1.5rem; }
      `}</style>
    </div>
  );
}
