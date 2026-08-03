const COUNTS = [2, 3, 4, 5, 6];

export default function PlayerCount({ value, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-ink-dim uppercase tracking-wider w-16" id="lbl-players">
        Players
      </span>
      <div role="radiogroup" aria-labelledby="lbl-players" className="flex gap-2 flex-1">
        {COUNTS.map(n => (
          <button
            key={n}
            role="radio"
            aria-checked={value === n}
            onClick={() => onChange(n)}
            className={[
              'flex-1 h-12 rounded-xl text-sm font-bold touch-manipulation transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-base',
              value === n
                ? 'bg-accent text-ink'
                : 'bg-surface-raised text-ink-muted hover:bg-surface-hover active:bg-surface-hover',
            ].join(' ')}
          >
            {n === 6 ? '6+' : n}
          </button>
        ))}
      </div>
    </div>
  );
}
