import { motion } from 'framer-motion';
import { User, MessageSquare, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { cn } from '../utils/cn';

export default function ChatBubble({ message, isAi, isStreaming }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex gap-4 w-full px-4 py-6",
        isAi ? "bg-white/[0.02]" : ""
      )}
    >
      <div className={cn(
        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-1",
        isAi ? "bg-gradient-to-br from-primary to-secondary text-white" : "bg-app-card border border-app-line text-text-main"
      )}>
        {isAi ? <MessageSquare className="w-4 h-4" /> : <User className="w-4 h-4" />}
      </div>
      
      <div className="flex-1 min-w-0 space-y-4">
        <div className="font-medium text-sm text-text-main/50">
          {isAi ? 'DocChat AI' : 'You'}
        </div>
        
        <div className="prose prose-invert max-w-none text-text-main/90 prose-pre:bg-app-bg prose-pre:border prose-pre:border-app-line prose-p:leading-relaxed">
          <ReactMarkdown>
            {message}
          </ReactMarkdown>
          {isStreaming && (
            <span className="inline-block w-2 h-4 ml-1 bg-primary animate-pulse align-middle" />
          )}
        </div>
      </div>

      {isAi && !isStreaming && (
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-start">
          <button
            onClick={handleCopy}
            className="p-1.5 text-text-muted hover:text-text-main rounded-md hover:bg-app-line transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      )}
    </motion.div>
  );
}
