import { motion } from 'framer-motion';

const dot = {
  initial: { y: 0 },
  animate: { y: [-4, 0, -4] },
};

export default function TypingIndicator() {
  return (
    <div className="flex gap-4 w-full px-4 py-6 bg-white/[0.02]">
      {/* AI Avatar */}
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0 mt-1">
        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-sm font-medium text-text-main/50">DocChat AI</div>
        <div className="flex items-center gap-1.5 px-4 py-3 bg-app-card border border-app-line rounded-2xl rounded-tl-none w-fit">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-2 h-2 rounded-full bg-primary"
              variants={dot}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
