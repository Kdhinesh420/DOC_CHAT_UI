import { motion } from 'framer-motion';
import { FileText, ExternalLink } from 'lucide-react';

export default function CitationCard({ citation }) {
  if (!citation) return null;
  const { source, text, page, score } = citation;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-start gap-2 px-3 py-2 bg-primary/5 border border-primary/20 rounded-xl cursor-pointer hover:border-primary/40 hover:bg-primary/10 transition-all group max-w-xs"
      title={text || source}
    >
      <div className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
        <FileText className="w-3 h-3 text-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-xs font-semibold text-primary truncate">{source || 'Document'}</div>
        {page && <div className="text-xs text-text-muted">Page {page}</div>}
        {text && (
          <div className="text-xs text-text-muted mt-1 line-clamp-2 leading-relaxed">
            "{text}"
          </div>
        )}
      </div>
      <ExternalLink className="w-3 h-3 text-primary/50 group-hover:text-primary shrink-0 mt-0.5 transition-colors" />
    </motion.div>
  );
}
