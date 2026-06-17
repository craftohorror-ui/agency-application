import React from 'react';
import { Components } from 'react-markdown';

import { contractDesignTokens } from '@/lib/contractDesignTokens';

export const PremiumMarkdownComponents: Components = {
  h1: ({ node, ...props }) => (
    <h1 className={`${contractDesignTokens.typography.documentTitle} border-current`} {...props} />
  ),
  h2: ({ node, ...props }) => (
    <h2 className={`${contractDesignTokens.typography.sectionTitle} border-current opacity-80`} {...props} />
  ),
  h3: ({ node, ...props }) => (
    <h3 className={`${contractDesignTokens.typography.subsectionTitle} opacity-70`} {...props} />
  ),
  p: ({ node, ...props }) => (
    <p className={`${contractDesignTokens.typography.body} opacity-90`} {...props} />
  ),
  ul: ({ node, ...props }) => (
    <ul className="space-y-4 my-8" {...props} />
  ),
  li: ({ node, ...props }) => (
    <li className="flex gap-5 items-start leading-relaxed text-lg opacity-90" {...props}>
      <span className="opacity-50 mt-1.5 font-bold">•</span>
      <div className="flex-1">{props.children}</div>
    </li>
  ),
  table: ({ node, ...props }) => (
    <div className={`w-full overflow-hidden ${contractDesignTokens.radius.xl} bg-white/5 border border-current/20 ${contractDesignTokens.shadows.minimal} ${contractDesignTokens.spacing.cardMargin} [&_strong]:text-2xl [&_strong]:font-black [&_strong]:tracking-tight`}>
      <table className="w-full text-left border-collapse" {...props} />
    </div>
  ),
  thead: ({ node, ...props }) => (
    <thead className="bg-black/5 border-b border-current/20" {...props} />
  ),
  th: ({ node, ...props }) => (
    <th className="p-6 font-bold uppercase text-[11px] tracking-widest opacity-70 border-r border-current/10 last:border-r-0" {...props} />
  ),
  tbody: ({ node, ...props }) => (
    <tbody className="divide-y divide-current/10" {...props} />
  ),
  td: ({ node, ...props }) => (
    <td className="p-8 align-top text-lg leading-relaxed border-r border-current/10 last:border-r-0" {...props} />
  ),
  hr: ({ node, ...props }) => (
    <hr className="my-20 border-t border-current/20" {...props} />
  ),
  strong: ({ node, ...props }) => (
    <strong className="font-bold opacity-100" {...props} />
  )
};
