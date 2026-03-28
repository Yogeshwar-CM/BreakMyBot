import { cn } from "@/lib/utils";

type CodePanelProps = {
  code: string;
  label?: string;
  className?: string;
};

export function CodePanel({ code, label, className }: CodePanelProps) {
  return (
    <div className={cn("surface overflow-hidden", className)}>
      {label ? (
        <div className="border-b border-white/10 px-4 py-3 text-xs uppercase tracking-[0.22em] text-white/42">
          {label}
        </div>
      ) : null}
      <pre className="overflow-x-auto px-4 py-4 text-sm leading-7 text-white/84 sm:px-5">
        <code>{code}</code>
      </pre>
    </div>
  );
}
