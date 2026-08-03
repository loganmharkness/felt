import { useEffect, useRef } from 'react';
import HamburgerButton from './HamburgerButton';

const RANKINGS = [
  { rank: 1,  name: 'Royal Flush',      example: 'A♠ K♠ Q♠ J♠ T♠',  note: 'A-K-Q-J-T, same suit' },
  { rank: 2,  name: 'Straight Flush',   example: '9♥ 8♥ 7♥ 6♥ 5♥',  note: '5 in a row, same suit' },
  { rank: 3,  name: 'Four of a Kind',   example: 'Q♠ Q♥ Q♦ Q♣',      note: 'All 4 of one rank' },
  { rank: 4,  name: 'Full House',       example: 'J♠ J♥ J♦ 7♥ 7♣',  note: 'Three of a kind + pair' },
  { rank: 5,  name: 'Flush',            example: 'A♣ T♣ 7♣ 4♣ 2♣',  note: 'Any 5, same suit' },
  { rank: 6,  name: 'Straight',         example: '8♠ 7♥ 6♦ 5♣ 4♠',  note: '5 in a row, any suits' },
  { rank: 7,  name: 'Three of a Kind',  example: '5♠ 5♥ 5♦',          note: '3 of the same rank' },
  { rank: 8,  name: 'Two Pair',         example: 'K♠ K♥ 9♦ 9♣',      note: '2 different pairs' },
  { rank: 9,  name: 'One Pair',         example: 'A♠ A♦',             note: '2 of the same rank' },
  { rank: 10, name: 'High Card',        example: 'A♠ J♥ 9♣ 6♦ 2♠',  note: 'None of the above' },
];

function Card({ rank, suit }) {
  const red = suit === '♥' || suit === '♦';
  return (
    <div className="w-7 h-10 bg-white rounded-[3px] border border-gray-200 shadow-sm flex flex-col items-center justify-center gap-px shrink-0">
      <span className={`text-[11px] font-bold leading-none ${red ? 'text-red-600' : 'text-gray-900'}`}>{rank}</span>
      <span className={`text-[13px] leading-none ${red ? 'text-red-600' : 'text-gray-900'}`}>{suit}</span>
    </div>
  );
}

function Cards({ str }) {
  return (
    <div className="flex gap-1 shrink-0">
      {str.split(' ').map((card, i) => (
        <Card key={i} rank={card.slice(0, -1)} suit={card.at(-1)} />
      ))}
    </div>
  );
}

export default function HandRankings({ onClose }) {
  const closeRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  function handleKeyDown(e) {
    if (e.key === 'Escape') { onClose(); return; }
    if (e.key !== 'Tab') return;

    const focusable = containerRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable?.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-50 flex flex-col bg-base"
      role="dialog"
      aria-modal="true"
      aria-labelledby="rankings-title"
      onKeyDown={handleKeyDown}
      onClick={onClose}
    >
      <div className="flex-1 overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-4 pt-4 pb-3 border-b border-border">
          <HamburgerButton onClick={onClose} triggerRef={closeRef} />
          <h2 id="rankings-title" className="text-lg font-bold text-ink">Hand Rankings</h2>
        </div>
        <div className="px-4 pb-6">
          <div className="flex items-center gap-3 pb-1">
            <span className="w-5 shrink-0" />
            <div className="flex-1" />
            <span className="text-xs text-ink-dim uppercase tracking-wider shrink-0">Example</span>
          </div>
          {RANKINGS.map(({ rank, name, example, note }) => (
            <div key={rank} className="flex items-center gap-3 py-3 border-b border-border last:border-0">
              <span className="w-5 shrink-0 text-right text-xs font-bold text-ink-dim">{rank}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-ink leading-tight">{name}</div>
                <div className="text-xs text-ink-dim mt-0.5">{note}</div>
              </div>
              <Cards str={example} />
            </div>
          ))}
          <p className="mt-4 text-xs text-ink-dim text-center">
            Ace plays high or low in a straight (A-2-3-4-5 or T-J-Q-K-A)
          </p>
        </div>
      </div>
    </div>
  );
}
