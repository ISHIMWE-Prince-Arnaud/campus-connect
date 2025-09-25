import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Toast({ toasts, onRemove }) {
  useEffect(() => {
    if (!toasts.length) return;
    const timers = toasts.map(t =>
      setTimeout(() => onRemove(t.id), t.duration || 3500)
    );
    return () => timers.forEach(clearTimeout);
  }, [toasts, onRemove]);

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3" aria-live="polite">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: .25 }}
            className={`alert alert-${t.type || 'info'} card-elevated glass shadow-soft px-4 py-2 font-sans`}
            role="alert"
          >
            <span>{t.message}</span>
            <button
              className="btn btn-xs btn-ghost ml-2"
              onClick={() => onRemove(t.id)}
              aria-label="Dismiss notification"
            >✕</button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
