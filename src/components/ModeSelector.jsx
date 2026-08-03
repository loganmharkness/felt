const MODES = [
  { id: 'pushfold', label: 'Push/Fold' },
  { id: 'rfi',      label: 'RFI' },
  { id: 'vsraise',  label: 'Vs Raise' },
];

export default function ModeSelector({ value, onChange }) {
  return (
    <div role="radiogroup" aria-label="Mode" className="flex gap-2">
      {MODES.map(m => (
        <button
          key={m.id}
          role="radio"
          aria-checked={value === m.id}
          onClick={() => onChange(m.id)}
          className={[
            'flex-1 h-12 rounded-xl text-sm font-bold touch-manipulation transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-base',
            value === m.id
              ? 'bg-accent text-ink'
              : 'bg-surface-raised text-ink-muted hover:bg-surface-hover active:bg-surface-hover',
          ].join(' ')}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
