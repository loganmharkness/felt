export function calculatePool({
  buyIn, players,
  rebuysEnabled, rebuyAmount, rebuyCount,
  addonEnabled, addonAmount, addonCount,
  feeEnabled, feeMode, feeValue,
}) {
  const n   = v => Math.max(0, Number(v) || 0);
  const gross =
    n(buyIn) * n(players) +
    (rebuysEnabled ? n(rebuyAmount) * n(rebuyCount) : 0) +
    (addonEnabled  ? n(addonAmount) * n(addonCount)  : 0);

  let fee = 0;
  if (feeEnabled && n(feeValue) > 0) {
    fee = feeMode === 'pct'
      ? gross * (n(feeValue) / 100)
      : n(feeValue);
    fee = Math.min(fee, gross); // can't take more than exists
  }

  return { gross, fee, pool: gross - fee };
}

// Returns floored per-place payouts + the unallocated remainder.
// Callers should display the remainder transparently rather than
// silently adding it to 1st place.
export function calculatePayouts(pool, splits) {
  const percentTotal = splits.reduce((s, p) => s + (Number(p) || 0), 0);

  if (pool <= 0 || !splits.length) {
    return { payouts: splits.map(() => 0), remainder: 0, percentTotal };
  }

  const payouts     = splits.map(p => Math.floor(pool * ((Number(p) || 0) / 100)));
  const payoutTotal = payouts.reduce((s, v) => s + v, 0);
  const remainder   = pool - payoutTotal;

  return { payouts, remainder, percentTotal };
}
