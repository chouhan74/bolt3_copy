import React, { useRef, useEffect } from 'react';

interface MonacoEditorProps {
  language: string;
  value: string;
  onChange: (value: string) => void;
  options?: any;
}

const MonacoEditor: React.FC<MonacoEditorProps> = ({
  language,
  value,
  onChange,
  options = {}
}) => {
  const editorRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // For now, we'll use a simple textarea as Monaco Editor requires additional setup
    // In a real implementation, you would configure Monaco Editor here
    const textarea = document.createElement('textarea');
    textarea.value = value;
    textarea.className = 'w-full h-full p-4 font-mono text-sm border-none outline-none resize-none';
    textarea.style.fontFamily = 'Monaco, Menlo, "Ubuntu Mono", monospace';
    textarea.style.fontSize = '14px';
    textarea.style.lineHeight = '1.5';
    textarea.style.backgroundColor = '#f8f9fa';
    
    textarea.addEventListener('input', (e) => {
      const target = e.target as HTMLTextAreaElement;
      onChange(target.value);
    });

    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(textarea);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  // Update value when it changes externally
  useEffect(() => {
    if (containerRef.current) {
      const textarea = containerRef.current.querySelector('textarea');
      if (textarea && textarea.value !== value) {
        textarea.value = value;
      }
    }
  }, [value]);

  return <div ref={containerRef} className="w-full h-full" />;
};

export default MonacoEditor;