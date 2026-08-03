import { useState, useMemo } from 'react';
import { calculatePool, calculatePayouts } from '../../utils/calculatePayouts';
import presets from '../../data/payout-presets.json';
import PoolInputs from './PoolInputs';
import PayoutStructure from './PayoutStructure';
import PayoutResults from './PayoutResults';
import HamburgerButton from '../HamburgerButton';

const DEFAULT_PRESET = presets.find(p => p.id === 'top3_502030');
const CURRENCY = '$';

export default function PayoutCalculator({ open, onClose }) {
  const [buyIn,          setBuyIn]          = useState(50);
  const [players,        setPlayers]        = useState(20);
  const [rebuysEnabled,  setRebuysEnabled]  = useState(false);
  const [rebuyAmount,    setRebuyAmount]    = useState(50);
  const [rebuyCount,     setRebuyCount]     = useState(0);
  const [addonEnabled,   setAddonEnabled]   = useState(false);
  const [addonAmount,    setAddonAmount]    = useState(50);
  const [addonCount,     setAddonCount]     = useState(0);
  const [feeEnabled,     setFeeEnabled]     = useState(false);
  const [feeMode,        setFeeMode]        = useState('flat');
  const [feeValue,       setFeeValue]       = useState(0);
  const [presetId,       setPresetId]       = useState(DEFAULT_PRESET.id);
  const [splits,         setSplits]         = useState([...DEFAULT_PRESET.splits]);

  const { gross, fee, pool } = useMemo(() => calculatePool({
    buyIn, players,
    rebuysEnabled, rebuyAmount, rebuyCount,
    addonEnabled, addonAmount, addonCount,
    feeEnabled, feeMode, feeValue,
  }), [buyIn, players, rebuysEnabled, rebuyAmount, rebuyCount,
       addonEnabled, addonAmount, addonCount, feeEnabled, feeMode, feeValue]);

  const { payouts, remainder, percentTotal } = useMemo(
    () => calculatePayouts(pool, splits),
    [pool, splits],
  );

  function handlePresetChange(id) {
    const p = presets.find(p => p.id === id);
    if (p?.splits.length) setSplits([...p.splits]);
    setPresetId(id);
  }

  function handleSplitChange(idx, val) {
    setSplits(s => s.map((v, i) => i === idx ? (Number(val) || 0) : v));
    setPresetId('custom');
  }

  function addPlace() {
    setSplits(s => [...s, 0]);
    setPresetId('custom');
  }

  function removePlace() {
    if (splits.length <= 1) return;
    setSplits(s => s.slice(0, -1));
    setPresetId('custom');
  }

  return (
    <div
      className={[
        'absolute inset-0 z-40 bg-base flex flex-col',
        'transition-[opacity,transform] duration-300 ease-out',
        open
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-3 pointer-events-none',
      ].join(' ')}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pc-title"
    >
      {/* Header */}
      <div className="shrink-0 flex items-center gap-3 px-4 pt-4 pb-3 border-b border-border">
        <HamburgerButton onClick={onClose} />
        <h2 id="pc-title" className="text-lg font-bold text-ink">Payout Calculator</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-6">

        {/* Pool inputs */}
        <div>
          <p className="text-xs text-ink-dim uppercase tracking-wider mb-3">Prize pool</p>
          <PoolInputs
            currency={CURRENCY}
            buyIn={buyIn}           setBuyIn={setBuyIn}
            players={players}       setPlayers={setPlayers}
            rebuysEnabled={rebuysEnabled} setRebuysEnabled={setRebuysEnabled}
            rebuyAmount={rebuyAmount}     setRebuyAmount={setRebuyAmount}
            rebuyCount={rebuyCount}       setRebuyCount={setRebuyCount}
            addonEnabled={addonEnabled}   setAddonEnabled={setAddonEnabled}
            addonAmount={addonAmount}     setAddonAmount={setAddonAmount}
            addonCount={addonCount}       setAddonCount={setAddonCount}
            feeEnabled={feeEnabled}       setFeeEnabled={setFeeEnabled}
            feeMode={feeMode}             setFeeMode={setFeeMode}
            feeValue={feeValue}           setFeeValue={setFeeValue}
          />
        </div>

        {/* Live pool total - always visible above splits */}
        <div className="rounded-2xl bg-surface-raised px-5 py-4">
          <div className="text-xs text-ink-dim uppercase tracking-wider mb-1">Total prize pool</div>
          <div className="text-5xl font-bold text-ink tabular-nums leading-none">
            {CURRENCY}{pool.toLocaleString()}
          </div>
          {fee > 0 && (
            <div className="text-xs text-ink-dim mt-2 flex gap-3">
              <span>Gross {CURRENCY}{gross.toLocaleString()}</span>
              <span>- Fee {CURRENCY}{fee.toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Payout structure */}
        <div>
          <p className="text-xs text-ink-dim uppercase tracking-wider mb-3">Payout structure</p>
          <PayoutStructure
            splits={splits}
            onSplitChange={handleSplitChange}
            onAddPlace={addPlace}
            onRemovePlace={removePlace}
            presetId={presetId}
            onPresetChange={handlePresetChange}
            payouts={payouts}
            percentTotal={percentTotal}
            currency={CURRENCY}
          />
        </div>

        {/* Per-place payouts */}
        <PayoutResults
          payouts={payouts}
          remainder={remainder}
          percentTotal={percentTotal}
          splits={splits}
          currency={CURRENCY}
        />

      </div>
    </div>
  );
}
