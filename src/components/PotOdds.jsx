import { useEffect, useRef, useState } from 'react';
import HamburgerButton from './HamburgerButton';
import { FOCUS_RING } from '../styles';

const DRAWS = [
  { name: 'Gutshot straight',       outs: 4  },
  { name: 'Two overcards',          outs: 6  },
  { name: 'Open-ended straight',    outs: 8  },
  { name: 'Flush draw',             outs: 9  },
  { name: 'Straight + gutshot',     outs: 12 },
  { name: 'Straight + flush draw',  outs: 15 },
];

const STREETS = [
  { label: 'Flop', sub: '2 cards to come', multiplier: 4 },
  { label: 'Turn', sub: '1 card to come',  multiplier: 2 },
];

export default function PotOdds({ onClose }) {
  const [pot, setPot]       = useState('');
  const [call, setCall]     = useState('');
  const [street, setStreet] = useState(0); // 0=flop, 1=turn
  const containerRef = useRef(null);
  const closeRef     = useRef(null);
  const potRef       = useRef(null);

  useEffect(() => { potRef.current?.focus(); }, []);

  function handleKeyDown(e) {
    if (e.key === 'Escape') { onClose(); return; }
    if (e.key !== 'Tab') return;
    const els = containerRef.current?.querySelectorAll(
      'button, input, [tabindex]:not([tabindex="-1"])'
    );
    if (!els?.length) return;
    const first = els[0], last = els[els.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  const potNum  = parseFloat(pot)  || 0;
  const callNum = parseFloat(call) || 0;
  const total   = potNum + callNum;
  const equity  = total > 0 && callNum > 0 ? (callNum / total) * 100 : null;
  const ratio   = callNum > 0 && potNum > 0 ? potNum / callNum : null;
  const mult    = STREETS[street].multiplier;

  const INPUT = 'w-full h-14 px-3 rounded-xl bg-surface-raised border border-border text-2xl font-bold text-ink text-center focus:outline-none focus:border-accent transition-colors';

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-50 flex flex-col bg-base"
      role="dialog"
      aria-modal="true"
      aria-labelledby="potodds-title"
      onKeyDown={handleKeyDown}
      onClick={onClose}
    >
      <div className="flex-1 overflow-y-auto" onClick={e => e.stopPropagation()}>

        <div className="flex items-center gap-3 px-4 pt-4 pb-3 border-b border-border">
          <HamburgerButton onClick={onClose} triggerRef={closeRef} />
          <h2 id="potodds-title" className="text-lg font-bold text-ink">Pot Odds</h2>
        </div>

        <div className="px-4 py-5 flex flex-col gap-5">

          {/* Inputs */}
          <div className="flex gap-3">
            <div className="flex-1 flex flex-col gap-1.5">
              <label className="text-xs text-ink-dim uppercase tracking-wider" htmlFor="po-pot">
                Pot (total in middle)
              </label>
              <input
                ref={potRef}
                id="po-pot"
                type="number"
                inputMode="decimal"
                min="0"
                placeholder="0"
                value={pot}
                onChange={e => setPot(e.target.value)}
                className={INPUT}
              />
            </div>
            <div className="flex-1 flex flex-col gap-1.5">
              <label className="text-xs text-ink-dim uppercase tracking-wider" htmlFor="po-call">
                To call
              </label>
              <input
                id="po-call"
                type="number"
                inputMode="decimal"
                min="0"
                placeholder="0"
                value={call}
                onChange={e => setCall(e.target.value)}
                className={INPUT}
              />
            </div>
          </div>

          {/* Result */}
          <div className="rounded-xl bg-surface p-5 text-center">
            {equity !== null ? (
              <>
                <div className="text-5xl font-bold text-accent-lit tabular-nums leading-none">
                  {equity.toFixed(1)}%
                </div>
                <div className="text-sm text-ink-muted mt-2">equity needed to break even</div>
                <div className="text-xs text-ink-dim mt-1">
                  Pot odds {ratio.toFixed(1)}:1 — risk {callNum} to win {potNum}
                </div>
              </>
            ) : (
              <div className="text-sm text-ink-dim py-3">Enter pot size and call amount above</div>
            )}
          </div>

          {/* Street toggle */}
          <div className="flex flex-col gap-2">
            <span className="text-xs text-ink-dim uppercase tracking-wider">Cards to come</span>
            <div role="radiogroup" aria-label="Street" className="flex gap-2">
              {STREETS.map(({ label, sub }, i) => (
                <button
                  key={i}
                  role="radio"
                  aria-checked={street === i}
                  onClick={() => setStreet(i)}
                  className={[
                    'flex-1 h-14 rounded-xl text-sm font-bold touch-manipulation transition-colors flex flex-col items-center justify-center gap-0.5',
                    street === i
                      ? 'bg-accent text-ink'
                      : `bg-surface-raised text-ink-muted hover:bg-surface-hover ${FOCUS_RING}`,
                  ].join(' ')}
                >
                  <span>{label}</span>
                  <span className="text-[10px] font-normal opacity-75">{sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Common draws */}
          <div className="flex flex-col gap-2">
            <span className="text-xs text-ink-dim uppercase tracking-wider">Common draws (outs × {mult})</span>
            <div className="rounded-xl bg-surface overflow-hidden">
              {DRAWS.map(({ name, outs }, i) => {
                const drawPct = Math.min(outs * mult, 100);
                const profitable = equity !== null && drawPct >= equity;
                const known = equity !== null;
                return (
                  <div
                    key={name}
                    className={`flex items-center justify-between px-3 py-2.5 ${i > 0 ? 'border-t border-border' : ''}`}
                  >
                    <div>
                      <span className="text-sm text-ink">{name}</span>
                      <span className="text-xs text-ink-dim ml-1.5">{outs} outs</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-sm font-bold text-ink-muted tabular-nums">{drawPct}%</span>
                      {known && (
                        <span className={`text-sm font-bold w-4 text-right ${profitable ? 'text-accent-lit' : 'text-ink-dim'}`}>
                          {profitable ? '✓' : '✗'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-ink-dim">
              Approximate only — rule of {mult === 4 ? '4' : '2'}. Adjust for fold equity and implied odds.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
