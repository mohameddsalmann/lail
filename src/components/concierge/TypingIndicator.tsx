'use client';

import { motion } from 'framer-motion';

export default function TypingIndicator() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-3 px-1"
        >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2C1810] text-white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
                </svg>
            </div>
            <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-white px-5 py-4 shadow-sm">
                {[0, 1, 2].map((i) => (
                    <motion.span
                        key={i}
                        className="block h-2 w-2 rounded-full bg-[#C4A265]"
                        animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: i * 0.2,
                            ease: 'easeInOut',
                        }}
                    />
                ))}
            </div>
        </motion.div>
    );
}
