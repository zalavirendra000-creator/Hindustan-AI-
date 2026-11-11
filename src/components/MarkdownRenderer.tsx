import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer = React.memo<MarkdownRendererProps>(
  ({ content }) => {
    // Parse blocks: code blocks vs standard text blocks
    const blocks = React.useMemo(() => parseMarkdownBlocks(content), [content]);

    return (
      <div className="space-y-2.5 leading-relaxed break-words text-[15px] select-text">
        {blocks.map((block, index) => {
          if (block.type === 'code') {
            return <CodeBlock key={index} code={block.content} language={block.language} />;
          }

          return <TextBlock key={index} text={block.content} />;
        })}
      </div>
    );
  },
  (prev, next) => prev.content === next.content
);

interface Block {
  type: 'text' | 'code';
  content: string;
  language?: string;
}

function parseMarkdownBlocks(rawText: string): Block[] {
  const blocks: Block[] = [];
  const lines = rawText.split('\n');
  let inCode = false;
  let currentLanguage = '';
  let currentCodeLines: string[] = [];
  let currentTextLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.trim().startsWith('```')) {
      if (inCode) {
        // End of code block
        blocks.push({
          type: 'code',
          content: currentCodeLines.join('\n'),
          language: currentLanguage || 'text',
        });
        currentCodeLines = [];
        currentLanguage = '';
        inCode = false;
      } else {
        // Start of code block
        if (currentTextLines.length > 0) {
          blocks.push({
            type: 'text',
            content: currentTextLines.join('\n'),
          });
          currentTextLines = [];
        }
        currentLanguage = line.trim().replace(/^```/, '').trim();
        inCode = true;
      }
    } else {
      if (inCode) {
        currentCodeLines.push(line);
      } else {
        currentTextLines.push(line);
      }
    }
  }

  // Flush remaining
  if (inCode && currentCodeLines.length > 0) {
    blocks.push({
      type: 'code',
      content: currentCodeLines.join('\n'),
      language: currentLanguage || 'text',
    });
  } else if (currentTextLines.length > 0) {
    blocks.push({
      type: 'text',
      content: currentTextLines.join('\n'),
    });
  }

  return blocks;
}

const CodeBlock: React.FC<{ code: string; language?: string }> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-2 rounded-xl overflow-hidden border border-slate-700/60 bg-[#0c1422] shadow-inner">
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#142034] text-xs font-mono text-slate-300 border-b border-slate-700/50">
        <span className="uppercase text-[11px] font-semibold tracking-wider text-sky-400">
          {language || 'code'}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-colors text-[11px]"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="p-3.5 overflow-x-auto text-xs font-mono text-emerald-300/90 leading-5 whitespace-pre">
        <code>{code}</code>
      </div>
    </div>
  );
};

const TextBlock: React.FC<{ text: string }> = ({ text }) => {
  const paragraphs = text.split('\n\n');

  return (
    <>
      {paragraphs.map((para, idx) => {
        const trimmed = para.trim();
        if (!trimmed) return null;

        const lines = para.split('\n');

        // Check if paragraph is a list
        const isList = lines.every((line) => {
          const l = line.trim();
          return l.startsWith('* ') || l.startsWith('- ') || /^\d+\.\s/.test(l) || l === '';
        });

        if (isList && lines.length > 0) {
          const isNumbered = /^\d+\.\s/.test(lines[0].trim());
          const ListTag = isNumbered ? 'ol' : 'ul';

          return (
            <ListTag
              key={idx}
              className={`space-y-1.5 my-2 pl-5 ${
                isNumbered ? 'list-decimal' : 'list-disc marker:text-sky-400'
              }`}
            >
              {lines.map((item, i) => {
                const cleanItem = item.replace(/^(\*|-|\d+\.)\s*/, '').trim();
                if (!cleanItem) return null;
                return (
                  <li key={i} className="pl-1">
                    {renderInlineFormatted(cleanItem)}
                  </li>
                );
              })}
            </ListTag>
          );
        }

        // Check header 3
        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={idx} className="text-base font-bold text-sky-300 mt-3 mb-1">
              {renderInlineFormatted(trimmed.replace(/^###\s+/, ''))}
            </h3>
          );
        }

        // Check header 2
        if (trimmed.startsWith('## ')) {
          return (
            <h2 key={idx} className="text-lg font-bold text-sky-200 mt-3 mb-1.5">
              {renderInlineFormatted(trimmed.replace(/^##\s+/, ''))}
            </h2>
          );
        }

        // Check header 1
        if (trimmed.startsWith('# ')) {
          return (
            <h1 key={idx} className="text-xl font-bold text-white mt-4 mb-2">
              {renderInlineFormatted(trimmed.replace(/^#\s+/, ''))}
            </h1>
          );
        }

        // Check blockquote
        if (trimmed.startsWith('> ')) {
          return (
            <blockquote
              key={idx}
              className="border-l-3 border-sky-400 pl-3.5 py-1 text-slate-300 italic bg-sky-950/20 rounded-r my-2"
            >
              {renderInlineFormatted(trimmed.replace(/^>\s+/, ''))}
            </blockquote>
          );
        }

        return (
          <p key={idx} className="whitespace-pre-wrap leading-relaxed">
            {lines.map((line, lIdx) => (
              <React.Fragment key={lIdx}>
                {renderInlineFormatted(line)}
                {lIdx < lines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </>
  );
};

// Helper for inline styles: **bold**, *italic*, `inline code`
function renderInlineFormatted(text: string): React.ReactNode {
  // Regex to match **bold**, `code`, and *italic*
  const parts = text.split(/(\*\*.*?\*\*|`.*?`|\*.*?\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return (
        <strong key={index} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code
          key={index}
          className="px-1.5 py-0.5 mx-0.5 rounded bg-[#0b1320] text-sky-300 text-[13px] font-mono border border-sky-900/50"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      return (
        <em key={index} className="italic text-slate-200">
          {part.slice(1, -1)}
        </em>
      );
    }
    return part;
  });
}
