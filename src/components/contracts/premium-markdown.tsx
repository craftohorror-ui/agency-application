/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Components } from 'react-markdown';

import { contractDesignTokens } from '@/lib/contractDesignTokens';

const wrapNumericValues = (text: string) => {
  const regex = /(\$\d+(?:,\d{3})*(?:\.\d+)?|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2}, \d{4}\b|\b\d{4}-\d{2}-\d{2}\b|\b[A-Z]+-[A-Z0-9-]+\b|\b(?:[A-Z]+[0-9]+[A-Z0-9]*|[0-9]+[A-Z]+[A-Z0-9]*)\b|\b\d+\s+(?:Days|Months|Weeks|Years)\b|\b\d+(?:,\d{3})*(?:\.\d+)?\b)/;
  const parts = text.split(regex);
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      return <span key={i} className={`${contractDesignTokens.typography.numeric} ${contractDesignTokens.typography.tableIdentifier}`}>{part}</span>;
    }
    return part;
  });
};

const formatChildren = (children: React.ReactNode): React.ReactNode => {
  return React.Children.map(children, (child) => {
    if (typeof child === 'string') {
      return wrapNumericValues(child);
    }
    if (React.isValidElement(child)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const props = child.props as any;
      return React.cloneElement(child, {
        ...props,
        children: formatChildren(props.children)
      });
    }
    return child;
  });
};

export const PremiumMarkdownComponents: Components = {
  h1: ({ _node, ...props }: any) => (
    <h1 className={`${contractDesignTokens.typography.documentTitle} border-current print:break-after-avoid`} {...props} />
  ),
  h2: ({ _node, ...props }: any) => (
    <h2 className={`${contractDesignTokens.typography.sectionTitle} border-current opacity-80 print:break-after-avoid`} {...props} />
  ),
  h3: ({ _node, ...props }: any) => (
    <h3 className={`${contractDesignTokens.typography.subsectionTitle} opacity-70 print:break-after-avoid`} {...props} />
  ),
  p: ({ _node, ...props }: any) => (
    <p className={`${contractDesignTokens.typography.body} opacity-90`} {...props}>
      {formatChildren(props.children)}
    </p>
  ),
  ul: ({ _node, ...props }: any) => (
    <ul className="space-y-4 print:space-y-2 my-8 print:my-4" {...props} />
  ),
  li: ({ _node, ...props }: any) => (
    <li className="flex gap-5 items-start leading-relaxed text-lg opacity-90" {...props}>
      <span className="opacity-50 mt-1.5 font-bold">•</span>
      <div className="flex-1">{formatChildren(props.children)}</div>
    </li>
  ),
  table: ({ _node, ...props }: any) => (
    <div className={`w-full overflow-hidden ${contractDesignTokens.radius.xl} bg-white/5 border border-current/20 ${contractDesignTokens.shadows.minimal} ${contractDesignTokens.spacing.cardMargin} print:break-inside-avoid`}>
      <table className="w-full text-left border-collapse table-fixed" {...props} />
    </div>
  ),
  thead: ({ _node, ...props }: any) => (
    <thead className="bg-black/5 border-b border-current/20" {...props} />
  ),
  th: ({ _node, ...props }: any) => {
    const getText = (children: any): string => {
      if (typeof children === 'string') return children;
      if (Array.isArray(children)) return children.map(getText).join('');
      if (React.isValidElement(children)) return getText((children.props as any).children);
      return '';
    };
    
    const textContent = getText(props.children).toLowerCase();
    let widthClass = "";
    
    if (textContent.includes("service") || textContent.includes("item") || textContent.includes("description") || textContent.includes("deliverable")) {
      widthClass = "w-[55%]";
    } else if (textContent.includes("qty") || textContent.includes("quantity")) {
      widthClass = "w-[15%]";
    } else if (textContent.includes("rate") || textContent.includes("price")) {
      widthClass = "w-[15%]";
    } else if (textContent.includes("amount") || textContent.includes("total")) {
      widthClass = "w-[15%]";
    }

    return (
      <th className={`p-6 print:p-3 font-bold uppercase text-[11px] tracking-widest opacity-70 border-r border-current/10 last:border-r-0 ${widthClass}`} {...props} />
    );
  },
  tbody: ({ _node, ...props }: any) => (
    <tbody className="divide-y divide-current/10" {...props} />
  ),
  td: ({ _node, ...props }: any) => (
    <td className={`p-6 print:p-3 align-top text-[15px] font-medium leading-relaxed border-r border-current/10 last:border-r-0 text-current/80 ${contractDesignTokens.typography.tableHumanContent}`} {...props}>
      {formatChildren(props.children)}
    </td>
  ),
  hr: ({ _node, ...props }: any) => (
    <hr className="my-20 print:my-10 border-t border-current/20" {...props} />
  ),
  strong: ({ _node, ...props }: any) => (
    <strong className="font-semibold text-base sm:text-[17px] text-current/90 opacity-100" {...props}>
      {formatChildren(props.children)}
    </strong>
  )
};
