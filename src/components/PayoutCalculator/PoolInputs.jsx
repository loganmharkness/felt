import { FOCUS_RING } from '../../styles';

const INPUT = 'w-full h-12 px-3 rounded-xl bg-surface border border-border text-xl font-bold text-ink text-center focus:outline-none focus:ring-2 focus:ring-accent transition-colors';
const LABEL = 'text-xs text-ink-dim uppercase tracking-wider block mb-1.5';

function Toggle({ checked, onChange, label }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={[
        'relative w-12 h-7 rounded-full transition-colors duration-200 shrink-0',
        checked ? 'bg-accent' : 'bg-border',
        FOCUS_RING,
      ].join(' ')}
      aria-label={label}
    >
      <span
        className="absolute top-1 left-0 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200"
        style={{ transform: checked ? 'translateX(18px)' : 'translateX(2px)' }}
      />
    </button>
  );
}

function Counter({ value, onChange, min = 0 }) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className={`w-11 h-11 rounded-xl bg-surface text-ink text-xl font-bold touch-manipulation disabled:opacity-30 hover:bg-surface-hover transition-colors ${FOCUS_RING}`}
      >−</button>
      <span className="w-12 text-center text-xl font-bold text-ink tabular-nums">{value}</span>
      <button
        onClick={() => onChange(value + 1)}
        className={`w-11 h-11 rounded-xl bg-surface text-ink text-xl font-bold touch-manipulation hover:bg-surface-hover transition-colors ${FOCUS_RING}`}
      >+</button>
    </div>
  );
}

function Section({ label, enabled, onToggle, children }) {
  return (
    <div className="rounded-2xl bg-surface-raised overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3.5">
        <span className="font-bold text-ink">{label}</span>
        <Toggle checked={enabled} onChange={onToggle} label={`Toggle ${label}`} />
      </div>
      {enabled && (
        <div className="px-4 pb-4 pt-1 border-t border-border flex flex-col gap-3">
          {children}
        </div>
      )}
    </div>
  );
}

function AmountInput({ id, value, onChange, currency }) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl font-bold text-ink-dim pointer-events-none select-none">{currency}</span>
      <input
        id={id}
        type="number"
        inputMode="decimal"
        min="0"
        value={value || ''}
        onChange={e => onChange(Number(e.target.value) || 0)}
        className="w-full h-12 pl-8 pr-3 rounded-xl bg-surface border border-border text-xl font-bold text-ink text-right focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
      />
    </div>
  );
}

function AmountField({ id, label, value, onChange, currency }) {
  return (
    <div>
      <label className={LABEL} htmlFor={id}>{label}</label>
      {currency
        ? <AmountInput id={id} value={value} onChange={onChange} currency={currency} />
        : <input id={id} type="number" inputMode="decimal" min="0" value={value || ''} onChange={e => onChange(Number(e.target.value) || 0)} className={INPUT} />
      }
    </div>
  );
}

export default function PoolInputs({
  currency,
  buyIn, setBuyIn, players, setPlayers,
  rebuysEnabled, setRebuysEnabled, rebuyAmount, setRebuyAmount, rebuyCount, setRebuyCount,
  addonEnabled, setAddonEnabled, addonAmount, setAddonAmount, addonCount, setAddonCount,
  feeEnabled, setFeeEnabled, feeMode, setFeeMode, feeValue, setFeeValue,
}) {
  return (
    <div className="flex flex-col gap-3">

      {/* Buy-in + players */}
      <div className="rounded-2xl bg-surface-raised px-4 py-4 flex gap-3">
        <div className="flex-1 min-w-0">
          <label className={LABEL} htmlFor="pc-buyin">Buy-in</label>
          <AmountInput id="pc-buyin" value={buyIn} onChange={setBuyIn} currency={currency} />
        </div>
        <div className="w-28 shrink-0">
          <label className={LABEL} htmlFor="pc-players">Players</label>
          <input
            id="pc-players"
            type="number"
            inputMode="numeric"
            min="1"
            value={players || ''}
            onChange={e => setPlayers(Number(e.target.value) || 0)}
            className={INPUT}
          />
        </div>
      </div>

      {/* Rebuys */}
      <Section label="Rebuys" enabled={rebuysEnabled} onToggle={setRebuysEnabled}>
        <AmountField id="pc-rebuy-amt" label="Rebuy amount" value={rebuyAmount} onChange={setRebuyAmount} currency={currency} />
        <div>
          <span className={LABEL}>Total rebuys taken</span>
          <Counter value={rebuyCount} onChange={setRebuyCount} />
        </div>
      </Section>

      {/* Add-on */}
      <Section label="Add-on" enabled={addonEnabled} onToggle={setAddonEnabled}>
        <AmountField id="pc-addon-amt" label="Add-on amount" value={addonAmount} onChange={setAddonAmount} currency={currency} />
        <div>
          <span className={LABEL}>Players who took add-on</span>
          <Counter value={addonCount} onChange={setAddonCount} />
        </div>
      </Section>

      {/* House fee */}
      <Section label="House fee" enabled={feeEnabled} onToggle={setFeeEnabled}>
        <div>
          <span className={LABEL}>Fee type</span>
          <div role="radiogroup" aria-label="Fee type" className="flex gap-2">
            {['flat', 'pct'].map(m => (
              <button
                key={m}
                role="radio"
                aria-checked={feeMode === m}
                onClick={() => setFeeMode(m)}
                className={[
                  'flex-1 h-11 rounded-xl text-sm font-bold touch-manipulation transition-colors',
                  feeMode === m
                    ? 'bg-accent text-ink'
                    : `bg-surface text-ink-muted hover:bg-surface-hover ${FOCUS_RING}`,
                ].join(' ')}
              >
                {m === 'flat' ? 'Flat amount' : 'Percentage'}
              </button>
            ))}
          </div>
        </div>
        <AmountField
          id="pc-fee-val"
          label={feeMode === 'pct' ? 'Percentage (%)' : 'Amount'}
          value={feeValue}
          onChange={setFeeValue}
          currency={feeMode === 'flat' ? currency : undefined}
        />
      </Section>

    </div>
  );
}
