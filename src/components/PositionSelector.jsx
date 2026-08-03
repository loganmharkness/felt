const POSITION_LABELS = {
  UTG: 'UTG', MP: 'MP', CO: 'CO', BTN: 'BTN', SB: 'SB', BB: 'BB',
};

export default function PositionSelector({ positions, value, onChange, label = 'Position' }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-ink-dim uppercase tracking-wider w-16" id={`lbl-${label}`}>
        {label}
      </span>
      <div role="radiogroup" aria-labelledby={`lbl-${label}`} className="flex gap-2 flex-1 flex-wrap">
        {positions.map(pos => (
          <button
            key={pos}
            role="radio"
            aria-checked={value === pos}
            onClick={() => onChange(pos)}
            className={[
              'flex-1 min-w-0 h-12 rounded-xl text-sm font-bold touch-manipulation transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-base',
              value === pos
                ? 'bg-accent text-ink'
                : 'bg-surface-raised text-ink-muted hover:bg-surface-hover active:bg-surface-hover',
            ].join(' ')}
          >
            {POSITION_LABELS[pos]}
          </button>
        ))}
      </div>
    </div>
  );
}
