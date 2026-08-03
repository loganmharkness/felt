import { Fragment } from 'react';
import { RANKS, cellHand } from '../utils/ranges';

const HEADER = 'flex items-center justify-center text-[10px] font-bold text-ink-dim select-none';
const CELL_BASE = 'flex items-center justify-center text-[10px] font-medium leading-none select-none rounded-[2px] overflow-hidden';

const STATE_CLASS = {
  primary:   'bg-accent text-ink',
  secondary: 'bg-bet text-ink',
  fold:      'bg-surface text-ink-dim',
};

export default function HandGrid({ getState }) {
  return (
    <div
      className="w-full h-full"
      role="img"
      aria-label="Preflop hand range grid. Diagonal = pairs, upper-right = suited, lower-left = offsuit. Green = primary action, blue = 3-bet, dark = fold."
    >
      <div
        className="grid w-full h-full gap-[2px]"
        style={{ gridTemplateColumns: '1.4em repeat(13, 1fr)', gridTemplateRows: '1.4em repeat(13, 1fr)' }}
        aria-hidden="true"
      >
        <div />
        {RANKS.map(r => <div key={r} className={HEADER}>{r}</div>)}

        {RANKS.map((rowRank, row) => (
          <Fragment key={rowRank}>
            <div className={HEADER}>{rowRank}</div>
            {RANKS.map((_, col) => {
              const hand = cellHand(row, col);
              const state = getState(hand);
              const isPair = row === col;
              return (
                <div
                  key={`${row}-${col}`}
                  title={hand}
                  className={[
                    CELL_BASE,
                    STATE_CLASS[state] ?? STATE_CLASS.fold,
                    isPair ? 'ring-1 ring-inset ring-border' : '',
                  ].join(' ')}
                >
                  <span className="truncate px-[1px]">
                    {row === col
                      ? RANKS[row] + RANKS[col]
                      : row < col
                        ? RANKS[row] + RANKS[col] + 's'
                        : RANKS[col] + RANKS[row] + 'o'}
                  </span>
                </div>
              );
            })}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
