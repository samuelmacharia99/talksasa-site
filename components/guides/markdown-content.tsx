"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

const proseClasses = cn(
  "prose prose-invert max-w-none",
  "prose-headings:scroll-mt-24 prose-headings:font-semibold prose-headings:tracking-tight",
  "prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl",
  "prose-p:text-muted-foreground prose-p:leading-relaxed",
  "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
  "prose-strong:text-foreground",
  "prose-li:text-muted-foreground",
  "prose-code:text-primary prose-code:bg-muted/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none",
  "prose-pre:bg-muted/40 prose-pre:border prose-pre:border-border",
  "prose-blockquote:border-primary/40 prose-blockquote:text-muted-foreground",
  "prose-hr:border-border",
  "prose-img:rounded-xl prose-img:border prose-img:border-border"
);

export function MarkdownContent({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  return (
    <div className={cn(proseClasses, className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
