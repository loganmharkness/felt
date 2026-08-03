import { FOCUS_RING } from '../styles';

export default function HamburgerButton({ onClick, expanded, triggerRef }) {
  return (
    <button
      ref={triggerRef}
      onClick={onClick}
      className={`w-11 h-11 flex items-center justify-center rounded-xl bg-surface-raised text-ink-dim touch-manipulation hover:bg-surface-hover transition-colors shrink-0 ${FOCUS_RING}`}
      aria-label="Open menu"
      aria-expanded={expanded}
    >
      <span className="flex flex-col gap-[5px]">
        <span className="w-5 h-0.5 bg-current rounded-full block" />
        <span className="w-5 h-0.5 bg-current rounded-full block" />
        <span className="w-5 h-0.5 bg-current rounded-full block" />
      </span>
    </button>
  );
}
