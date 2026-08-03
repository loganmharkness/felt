const MIN = 2;

export default function StackInput({ value, onChange, max = 25 }) {
  const dec = () => onChange(Math.max(MIN, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-ink-dim uppercase tracking-wider w-16" id="lbl-stack">
        Stack
      </span>
      <div className="flex items-center gap-2 flex-1">
        <button
          onClick={dec}
          disabled={value <= MIN}
          className="w-12 h-12 rounded-xl bg-surface-raised text-ink text-xl font-bold touch-manipulation disabled:opacity-30 disabled:cursor-not-allowed hover:bg-surface-hover active:bg-surface-hover disabled:hover:bg-surface-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-base"
          aria-label="Decrease stack"
        >
          -
        </button>
        <div
          role="spinbutton"
          aria-labelledby="lbl-stack"
          aria-valuenow={value}
          aria-valuemin={MIN}
          aria-valuemax={max}
          aria-valuetext={`${value} big blinds`}
          className="flex-1 text-center"
        >
          <span className="text-3xl font-bold text-ink tabular-nums">{value}</span>
          <span className="text-sm text-ink-dim ml-1">BB</span>
        </div>
        <button
          onClick={inc}
          disabled={value >= max}
          className="w-12 h-12 rounded-xl bg-surface-raised text-ink text-xl font-bold touch-manipulation disabled:opacity-30 disabled:cursor-not-allowed hover:bg-surface-hover active:bg-surface-hover disabled:hover:bg-surface-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-base"
          aria-label="Increase stack"
        >
          +
        </button>
      </div>
    </div>
  );
}
