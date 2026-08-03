import presets from '../../data/payout-presets.json';
import { FOCUS_RING } from '../../styles';

function ordinal(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function presetLabel(p) {
  return p.splits.length ? p.splits.join('/') : 'Custom';
}

export default function PayoutStructure({
  splits, onSplitChange, onAddPlace, onRemovePlace,
  presetId, onPresetChange, payouts, percentTotal, currency,
}) {
  const ok      = Math.abs(percentTotal - 100) < 0.01;
  const overHun = percentTotal > 100;

  return (
    <div className="flex flex-col gap-3">

      {/* Preset buttons */}
      <div>
        <span className="text-xs text-ink-dim uppercase tracking-wider block mb-2">Preset</span>
        <div className="flex flex-wrap gap-2">
          {presets.map(p => (
            <button
              key={p.id}
              onClick={() => onPresetChange(p.id)}
              className={[
                'h-10 px-3 rounded-xl text-sm font-bold touch-manipulation transition-colors',
                presetId === p.id
                  ? 'bg-accent text-ink'
                  : `bg-surface-raised text-ink-muted hover:bg-surface-hover ${FOCUS_RING}`,
              ].join(' ')}
            >
              {presetLabel(p)}
            </button>
          ))}
        </div>
      </div>

      {/* Splits editor */}
      <div className="rounded-2xl bg-surface-raised overflow-hidden">
        {/* Column headers */}
        <div className="flex items-center px-4 pt-3 pb-1 gap-3">
          <span className="w-10 shrink-0 text-xs text-ink-dim uppercase tracking-wider">Place</span>
          <span className="flex-1 text-xs text-ink-dim uppercase tracking-wider text-center">%</span>
          <span className="w-20 shrink-0 text-xs text-ink-dim uppercase tracking-wider text-right">Payout</span>
        </div>

        {splits.map((pct, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-2 border-t border-border">
            <span className="w-10 shrink-0 text-sm font-bold text-ink-muted">{ordinal(i + 1)}</span>
            <input
              type="number"
              inputMode="decimal"
              min="0"
              max="100"
              value={pct === 0 ? '' : pct}
              onChange={e => onSplitChange(i, e.target.value)}
              className="flex-1 h-10 rounded-lg bg-surface border border-border text-ink text-sm font-bold text-center focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
              aria-label={`${ordinal(i + 1)} place percentage`}
            />
            <span className="w-20 shrink-0 text-right text-sm font-bold text-ink-muted tabular-nums">
              {payouts[i] != null ? `${currency}${payouts[i].toLocaleString()}` : '—'}
            </span>
          </div>
        ))}

        {/* Running total */}
        <div className={[
          'flex items-center justify-between px-4 py-3 border-t',
          ok        ? 'border-accent/30 bg-accent/10'    :
          overHun   ? 'border-warn-edge bg-warn-surface'  :
                      'border-border bg-surface',
        ].join(' ')}>
          <span className={`text-sm font-bold ${ok ? 'text-accent-lit' : overHun ? 'text-warn-strong' : 'text-ink-muted'}`}>
            Total
          </span>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-bold tabular-nums ${ok ? 'text-accent-lit' : overHun ? 'text-warn-strong' : 'text-ink'}`}>
              {percentTotal}%
            </span>
            {ok
              ? <span className="text-accent-lit text-sm">✓</span>
              : <span className={`text-xs font-bold ${overHun ? 'text-warn-strong' : 'text-ink-dim'}`}>
                  {overHun ? `over by ${(percentTotal - 100).toFixed(1)}%` : `${(100 - percentTotal).toFixed(1)}% remaining`}
                </span>
            }
          </div>
        </div>
      </div>

      {/* Add / remove place */}
      <div className="flex gap-2">
        <button
          onClick={onRemovePlace}
          disabled={splits.length <= 1}
          className={`flex-1 h-11 rounded-xl text-sm font-bold text-ink-muted bg-surface-raised hover:bg-surface-hover touch-manipulation transition-colors disabled:opacity-30 ${FOCUS_RING}`}
        >
          - Remove place
        </button>
        <button
          onClick={onAddPlace}
          className={`flex-1 h-11 rounded-xl text-sm font-bold text-ink-muted bg-surface-raised hover:bg-surface-hover touch-manipulation transition-colors ${FOCUS_RING}`}
        >
          + Add place
        </button>
      </div>

    </div>
  );
}
