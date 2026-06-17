import React from 'react';
import { Components } from 'react-markdown';

export const PremiumMarkdownComponents: Components = {
  h1: ({ node, ...props }) => (
    <h1 className="text-4xl font-black text-slate-900 tracking-tight mt-8 mb-12 pb-6 border-b-2 border-slate-200" {...props} />
  ),
  h2: ({ node, ...props }) => (
    <h2 className="text-2xl font-bold text-slate-800 uppercase tracking-widest mt-16 mb-8" {...props} />
  ),
  h3: ({ node, ...props }) => (
    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-10 mb-4" {...props} />
  ),
  p: ({ node, ...props }) => (
    <p className="text-slate-600 leading-loose mb-6 text-base" {...props} />
  ),
  ul: ({ node, ...props }) => (
    <ul className="space-y-3 my-8" {...props} />
  ),
  li: ({ node, ...props }) => (
    <li className="flex gap-4 items-start text-slate-600 leading-relaxed" {...props}>
      <span className="text-blue-500 mt-1 font-bold">•</span>
      <div className="flex-1">{props.children}</div>
    </li>
  ),
  table: ({ node, ...props }) => (
    <div className="w-full overflow-hidden rounded-xl border border-slate-200 my-10 shadow-sm bg-white">
      <table className="w-full text-left border-collapse" {...props} />
    </div>
  ),
  thead: ({ node, ...props }) => (
    <thead className="bg-slate-50 border-b border-slate-200" {...props} />
  ),
  th: ({ node, ...props }) => (
    <th className="p-5 font-bold uppercase text-xs tracking-widest text-slate-500 border-r border-slate-200 last:border-r-0" {...props} />
  ),
  tbody: ({ node, ...props }) => (
    <tbody className="divide-y divide-slate-100" {...props} />
  ),
  td: ({ node, ...props }) => (
    <td className="p-6 align-top text-slate-700 leading-relaxed border-r border-slate-100 last:border-r-0" {...props} />
  ),
  hr: ({ node, ...props }) => (
    <hr className="my-16 border-t-2 border-slate-100" {...props} />
  ),
  strong: ({ node, ...props }) => (
    <strong className="font-bold text-slate-900" {...props} />
  )
};
