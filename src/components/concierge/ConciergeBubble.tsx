'use client';

import { motion } from 'framer-motion';
import { type ReactNode } from 'react';

interface ConciergeBubbleProps {
    children: ReactNode;
    from: 'ai' | 'user';
    delay?: number;
}

const spring = { type: 'spring' as const, stiffness: 300, damping: 26 };

export default function ConciergeBubble({ children, from, delay = 0 }: ConciergeBubbleProps) {
    const isAi = from === 'ai';

    return (
        <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ ...spring, delay }}
            className={`flex items-end gap-3 ${isAi ? '' : 'flex-row-reverse'}`}
        >
            {isAi && (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2C1810] text-white">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
                    </svg>
                </div>
            )}
            <div
                className={`
                    max-w-[85%] px-5 py-4 text-[15px] leading-relaxed sm:max-w-[75%]
                    ${isAi
                        ? 'rounded-2xl rounded-bl-md bg-white text-[#2C1810] shadow-sm'
                        : 'rounded-2xl rounded-br-md bg-[#2C1810] text-[#FBF8F3]'
                    }
                `}
            >
                {children}
            </div>
        </motion.div>
    );
}
