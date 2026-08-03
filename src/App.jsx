import { useState, useMemo, useCallback, useEffect } from 'react';
import StackInput from './components/StackInput';
import PositionSelector from './components/PositionSelector';
import PlayerCount from './components/PlayerCount';
import HandGrid from './components/HandGrid';
import ModeSelector from './components/ModeSelector';
import HandRankings from './components/HandRankings';
import PotOdds from './components/PotOdds';
import HamburgerMenu from './components/HamburgerMenu';
import HamburgerButton from './components/HamburgerButton';
import BlindTimer from './components/BlindTimer';
import PayoutCalculator from './components/PayoutCalculator';
import { getPushSet, getActiveBucket, POSITIONS_BY_COUNT, BB_POSITIONS } from './utils/ranges';
import { getRFISet, getRFIBucket, RFI_POSITIONS } from './utils/rfi';
import { getVsraiseMap, getVsraiseBucket, VALID_RAISERS, VSRAISE_POSITIONS } from './utils/vsraise';

const STACK_MAX = { pushfold: 25, rfi: 100, vsraise: 100 };

function pickMiddle(arr) {
  return arr[Math.floor(arr.length / 2)];
}

export default function App() {
  const [mode, setMode] = useState('pushfold');
  const [stack, setStack] = useState(10);
  const [players, setPlayers] = useState(6);
  const [position, setPosition] = useState('BTN');
  const [raiserPos, setRaiserPos] = useState('UTG');
  const [showMenu, setShowMenu]             = useState(true);
  const [showRanges, setShowRanges]         = useState(false);
  const [showRankings, setShowRankings]     = useState(false);
  const [showPotOdds, setShowPotOdds]       = useState(false);
  const [showBlindTimer, setShowBlindTimer]     = useState(false);
  const [showPayoutCalc, setShowPayoutCalc]     = useState(false);
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = dark ? '#090e0a' : '#f5f9f5';
  }, [dark]);

  const positions =
    mode === 'pushfold' ? POSITIONS_BY_COUNT[Math.min(players, 6)] :
    mode === 'rfi'      ? RFI_POSITIONS :
                          VSRAISE_POSITIONS;

  const validRaisers = VALID_RAISERS[position] ?? [];

  function handleModeChange(newMode) {
    setMode(newMode);
    if (newMode === 'pushfold') setStack(s => Math.min(s, 25));

    const newPositions =
      newMode === 'pushfold' ? POSITIONS_BY_COUNT[Math.min(players, 6)] :
      newMode === 'rfi'      ? RFI_POSITIONS :
                               VSRAISE_POSITIONS;

    const newPos = newPositions.includes(position) ? position : pickMiddle(newPositions);
    if (newPos !== position) setPosition(newPos);

    if (newMode === 'vsraise') {
      const vr = VALID_RAISERS[newPos] ?? [];
      if (!vr.includes(raiserPos)) setRaiserPos(vr[0] ?? 'UTG');
    }
  }

  function handlePlayersChange(n) {
    setPlayers(n);
    const available = POSITIONS_BY_COUNT[Math.min(n, 6)];
    if (!available.includes(position)) setPosition(pickMiddle(available));
  }

  function handlePositionChange(pos) {
    setPosition(pos);
    if (mode === 'vsraise') {
      const vr = VALID_RAISERS[pos] ?? [];
      if (!vr.includes(raiserPos)) setRaiserPos(vr[0] ?? 'UTG');
    }
  }

  // Single memo computes data + counts in one pass — no array spreads downstream
  const { handData, primaryCount, threeBetCount } = useMemo(() => {
    let handData, primaryCount = 0, threeBetCount = 0;

    if (mode === 'pushfold') {
      handData = getPushSet(stack, position, players);
      primaryCount = handData.size;
    } else if (mode === 'rfi') {
      handData = getRFISet(stack, position);
      primaryCount = handData.size;
    } else {
      handData = getVsraiseMap(stack, position, raiserPos);
      for (const v of handData.values()) {
        if (v === 'call') primaryCount++;
        else threeBetCount++;
      }
    }

    return { handData, primaryCount, threeBetCount };
  }, [mode, stack, position, players, raiserPos]);

  const activeBucket = useMemo(() => {
    if (mode === 'pushfold') return getActiveBucket(stack, players);
    if (mode === 'rfi')      return getRFIBucket(stack);
    return getVsraiseBucket(stack);
  }, [mode, stack, players]);

  const getState = useCallback((hand) => {
    if (mode === 'vsraise') {
      const s = handData.get(hand);
      if (s === 'threeBet') return 'secondary';
      if (s === 'call')     return 'primary';
      return 'fold';
    }
    return handData.has(hand) ? 'primary' : 'fold';
  }, [mode, handData]);

  const isDefend = mode === 'pushfold' && BB_POSITIONS.has(position);
  const primaryLabel = mode === 'vsraise' ? 'Call' : mode === 'rfi' ? 'Raise' : isDefend ? 'Call' : 'Shove';

  const primaryPct  = Math.round((primaryCount  / 169) * 100);
  const threeBetPct = Math.round((threeBetCount / 169) * 100);

  const showSuggestion = mode !== 'pushfold' && stack < 15;

  return (
    <div className="h-svh bg-base flex flex-col max-w-[430px] mx-auto w-full relative">
      <HamburgerMenu
        open={showMenu}
        onClose={() => setShowMenu(false)}
        dark={dark}
        onDarkToggle={() => setDark(d => !d)}
        onShowRanges={() => setShowRanges(true)}
        onShowRankings={() => setShowRankings(true)}
        onShowPotOdds={() => setShowPotOdds(true)}
        onShowBlindTimer={() => setShowBlindTimer(true)}
        onShowPayoutCalc={() => setShowPayoutCalc(true)}
      />
      <BlindTimer
        open={showBlindTimer}
        onClose={() => { setShowBlindTimer(false); setShowMenu(true); }}
      />
      <PayoutCalculator
        open={showPayoutCalc}
        onClose={() => { setShowPayoutCalc(false); setShowMenu(true); }}
      />
      {showRankings && <HandRankings onClose={() => { setShowRankings(false); setShowMenu(true); }} />}
      {showPotOdds && <PotOdds onClose={() => { setShowPotOdds(false); setShowMenu(true); }} />}
      {showRanges && <>
      <header className="shrink-0 px-4 pt-4 pb-3 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-3">
          <HamburgerButton onClick={() => setShowMenu(true)} expanded={showMenu} />
          <h1 className="text-xl font-bold text-ink tracking-tight">FELT</h1>
        </div>
        <div className="flex items-center gap-3 text-xs text-ink-dim" role="legend" aria-label="Grid legend">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-accent inline-block" aria-hidden="true" />
            {primaryLabel}
          </span>
          {mode === 'vsraise' && (
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-sm bg-bet inline-block" aria-hidden="true" />
              3-Bet
            </span>
          )}
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-surface-raised border border-border inline-block" aria-hidden="true" />
            Fold
          </span>
        </div>
      </header>

      {showSuggestion && (
        <div className="shrink-0 mx-2 mt-1 px-3 py-1.5 rounded-lg bg-warn-surface border border-warn-edge flex items-center justify-between">
          <span className="text-xs text-warn-ink">Short stack - Push/Fold range may be better</span>
          <button
            onClick={() => handleModeChange('pushfold')}
            className="text-xs text-warn-strong font-bold ml-3 px-2 py-1.5 rounded-lg hover:bg-warn-hover active:bg-warn-hover touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warn-edge"
            aria-label="Switch to Push/Fold mode"
          >
            Switch
          </button>
        </div>
      )}

      <div className="flex-1 min-h-0 px-2 pt-2 pb-1">
        <HandGrid getState={getState} />
      </div>

      <div className="shrink-0 px-4 py-2 flex items-center justify-between border-t border-border">
        <span className="text-sm text-ink-muted">
          <span className="text-accent-lit font-bold">{position}</span>
          {mode === 'vsraise' && (
            <span className="text-ink-dim"> vs <span className="text-bet-lit font-bold">{raiserPos}</span></span>
          )}
          {' '}at{' '}
          <span className="text-ink font-bold">{stack}BB</span>
        </span>
        <span className="text-sm text-ink-muted">
          {mode === 'vsraise' ? (
            <>
              <span className="text-bet-lit font-semibold">{threeBetPct}%</span>
              {' '}/{' '}
              <span className="text-accent-lit font-semibold">{primaryPct}%</span>
            </>
          ) : (
            <>
              {primaryLabel}{' '}
              <span className="text-accent-lit font-semibold">{primaryPct}%</span>
            </>
          )}
          {activeBucket !== stack && (
            <span className="text-ink-dim text-xs ml-1">(using {activeBucket}BB)</span>
          )}
        </span>
      </div>

      <div className="shrink-0 px-4 pt-3 pb-4 flex flex-col gap-3 border-t border-border">
        <ModeSelector value={mode} onChange={handleModeChange} />
        {mode === 'pushfold' && (
          <PlayerCount value={players} onChange={handlePlayersChange} />
        )}
        <StackInput value={stack} onChange={setStack} max={STACK_MAX[mode]} />
        <PositionSelector
          positions={positions}
          value={position}
          onChange={handlePositionChange}
        />
        {mode === 'vsraise' && (
          <PositionSelector
            positions={validRaisers}
            value={raiserPos}
            onChange={setRaiserPos}
            label="Raiser"
          />
        )}
      </div>
      </>}
    </div>
  );
}
