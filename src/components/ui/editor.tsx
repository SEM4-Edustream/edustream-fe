"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2, 
  Quote, 
  Undo, 
  Redo 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const Toolbar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  const buttons = [
    {
      icon: Bold,
      onClick: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive('bold'),
      label: 'Bold',
    },
    {
      icon: Italic,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive('italic'),
      label: 'Italic',
    },
    {
      icon: UnderlineIcon,
      onClick: () => editor.chain().focus().toggleUnderline().run(),
      isActive: editor.isActive('underline'),
      label: 'Underline',
    },
    { type: 'separator' },
    {
      icon: Heading1,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editor.isActive('heading', { level: 1 }),
      label: 'Heading 1',
    },
    {
      icon: Heading2,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive('heading', { level: 2 }),
      label: 'Heading 2',
    },
    { type: 'separator' },
    {
      icon: List,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive('bulletList'),
      label: 'Bullet List',
    },
    {
      icon: ListOrdered,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive('orderedList'),
      label: 'Ordered List',
    },
    {
      icon: Quote,
      onClick: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: editor.isActive('blockquote'),
      label: 'Blockquote',
    },
    { type: 'separator' },
    {
      icon: Undo,
      onClick: () => editor.chain().focus().undo().run(),
      isActive: false,
      label: 'Undo',
      disabled: !editor.can().undo(),
    },
    {
      icon: Redo,
      onClick: () => editor.chain().focus().redo().run(),
      isActive: false,
      label: 'Redo',
      disabled: !editor.can().redo(),
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1 p-1.5 border-b border-slate-200 bg-slate-50/50 sticky top-0 z-10">
      {buttons.map((btn, i) => {
        if (btn.type === 'separator') {
          return <div key={i} className="w-px h-6 bg-slate-200 mx-1" />;
        }
        
        const Icon = btn.icon!;
        return (
          <button
            key={i}
            type="button"
            onClick={btn.onClick}
            disabled={btn.disabled}
            title={btn.label}
            className={cn(
              "p-2 rounded-md transition-all hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent",
              btn.isActive ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200" : "text-slate-600"
            )}
          >
            <Icon className="w-4 h-4" />
          </button>
        );
      })}
    </div>
  );
};

export default function Editor({ value, onChange, placeholder, disabled }: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({
        placeholder: placeholder || 'Start writing...',
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editable: !disabled,
  });

  // Keep content in sync if value changes externally (though onUpdate handles most cases)
  // We use a useEffect but only update if the content is truly different to avoid cursor jumps
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  return (
    <div className={cn(
      "w-full border border-slate-300 bg-white min-h-[250px] transition-all focus-within:ring-2 focus-within:ring-slate-900/10 focus-within:border-slate-400",
      disabled && "opacity-50 cursor-not-allowed bg-slate-50"
    )}>
      <Toolbar editor={editor} />
      <EditorContent 
        editor={editor} 
        className="prose prose-sm max-w-none p-4 min-h-[200px] outline-none"
      />
      <style jsx global>{`
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror {
           outline: none;
        }
        .prose ul {
          list-style-type: disc;
          padding-left: 1.5rem;
        }
        .prose ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
        }
      `}</style>
    </div>
  );
}
