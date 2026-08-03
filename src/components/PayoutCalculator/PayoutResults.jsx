function ordinal(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export default function PayoutResults({ payouts, remainder, percentTotal, splits, currency }) {
  const ok = Math.abs(percentTotal - 100) < 0.01;

  if (!ok && splits.length > 0) {
    return (
      <div className="rounded-2xl bg-warn-surface border border-warn-edge px-4 py-3">
        <p className="text-sm font-bold text-warn-strong text-center">
          Percentages must total 100%
        </p>
        <p className="text-xs text-warn-ink text-center mt-0.5">
          {Math.abs(percentTotal - 100).toFixed(1)}% {percentTotal > 100 ? 'over' : 'remaining'}
        </p>
      </div>
    );
  }

  if (!ok || splits.length === 0) return null;

  return (
    <div className="rounded-2xl bg-surface-raised overflow-hidden">
      {payouts.map((amount, i) => (
        <div
          key={i}
          className={`flex items-center justify-between px-5 py-3.5 ${i > 0 ? 'border-t border-border' : ''}`}
        >
          <span className="text-sm font-bold text-ink-muted">{ordinal(i + 1)} place</span>
          <span className="text-2xl font-bold text-ink tabular-nums">{currency}{amount.toLocaleString()}</span>
        </div>
      ))}
      {remainder > 0 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-surface">
          <span className="text-xs text-ink-dim">Rounding remainder</span>
          <span className="text-sm font-bold text-ink-dim tabular-nums">+{currency}{remainder.toLocaleString()}</span>
        </div>
      )}
    </div>
  );
}
