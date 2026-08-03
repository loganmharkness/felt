import { useState, useEffect, useRef } from 'react';
import HamburgerButton from './HamburgerButton';
import { FOCUS_RING } from '../styles';

const DEFAULT_LEVELS = [
  { sb: 25,   bb: 50   },
  { sb: 50,   bb: 100  },
  { sb: 75,   bb: 150  },
  { sb: 100,  bb: 200  },
  { sb: 150,  bb: 300  },
  { sb: 200,  bb: 400  },
  { sb: 300,  bb: 600  },
  { sb: 400,  bb: 800  },
  { sb: 500,  bb: 1000 },
  { sb: 1000, bb: 2000 },
];

const DURATIONS = [5, 10, 15, 20];

function fmt(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function BlindTimer({ open, onClose }) {
  const [levels,        setLevels]        = useState(DEFAULT_LEVELS);
  const [levelIdx,      setLevelIdx]      = useState(0);
  const [levelDuration, setLevelDuration] = useState(15);
  const [timeLeft,      setTimeLeft]      = useState(15 * 60);
  const [running,       setRunning]       = useState(false);
  const [screen,        setScreen]        = useState('timer'); // 'timer' | 'settings'
  const containerRef = useRef(null);
  const closeRef     = useRef(null);
  const cogRef       = useRef(null);
  const audioCtxRef  = useRef(null);

  function getAudioCtx() {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    const ctx = audioCtxRef.current ?? (audioCtxRef.current = new Ctx());
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function playChime() {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    [0, 0.15, 0.3].forEach(offset => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.0001, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.3, now + offset + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.12);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + offset);
      osc.stop(now + offset + 0.13);
    });
  }

  // countdown tick
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setTimeLeft(t => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [running]);

  // level advance
  useEffect(() => {
    if (timeLeft !== 0 || !running) return;
    navigator.vibrate?.([200, 100, 200]);
    playChime();
    if (levelIdx < levels.length - 1) {
      setLevelIdx(i => i + 1);
      setTimeLeft(levelDuration * 60);
    } else {
      setRunning(false);
    }
  }, [timeLeft, running, levelIdx, levels.length, levelDuration]);

  useEffect(() => { if (open) closeRef.current?.focus(); }, [open]);

  function goToLevel(idx) {
    const clamped = Math.max(0, Math.min(idx, levels.length - 1));
    setLevelIdx(clamped);
    setTimeLeft(levelDuration * 60);
    setRunning(false);
  }

  function openSettings() {
    setRunning(false);
    setScreen('settings');
    setTimeout(() => cogRef.current?.focus(), 50);
  }

  function closeSettings() {
    const clamped = Math.min(levelIdx, levels.length - 1);
    if (clamped !== levelIdx) { setLevelIdx(clamped); setTimeLeft(levelDuration * 60); }
    setScreen('timer');
    setTimeout(() => closeRef.current?.focus(), 50);
  }

  function changeDuration(mins) {
    setLevelDuration(mins);
    setTimeLeft(mins * 60);
    setRunning(false);
  }

  function resetToLevel1() {
    setLevelIdx(0);
    setTimeLeft(levelDuration * 60);
    setRunning(false);
  }

  function updateLevel(idx, field, raw) {
    const val = parseInt(raw, 10);
    setLevels(ls => ls.map((l, i) => i === idx ? { ...l, [field]: isNaN(val) ? 0 : val } : l));
  }

  function addLevel() {
    const last = levels[levels.length - 1];
    setLevels(ls => [...ls, { sb: last.sb * 2, bb: last.bb * 2 }]);
  }

  function removeLevel(idx) {
    if (levels.length <= 1) return;
    setLevels(ls => ls.filter((_, i) => i !== idx));
  }

  function handleKeyDown(e) {
    if (!open) return;
    if (e.key === 'Escape') {
      if (screen === 'settings') { closeSettings(); return; }
      onClose();
      return;
    }
    if (e.key === ' ' && screen === 'timer') { e.preventDefault(); setRunning(r => !r); return; }
    if (e.key !== 'Tab') return;
    const els = containerRef.current?.querySelectorAll(
      'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (!els?.length) return;
    const first = els[0], last = els[els.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  const level    = levels[Math.min(levelIdx, levels.length - 1)];
  const nextLvl  = levels[levelIdx + 1];
  const isLast   = levelIdx >= levels.length - 1;
  const warning  = timeLeft <= 60 && timeLeft > 0;
  const done     = isLast && timeLeft === 0 && !running;
  const elapsed  = levelDuration * 60 - timeLeft;
  const progress = Math.min(elapsed / (levelDuration * 60), 1);

  const NAV_BTN  = `w-16 h-16 rounded-2xl flex items-center justify-center text-2xl touch-manipulation transition-colors disabled:opacity-30 ${FOCUS_RING}`;

  return (
    <div
      ref={containerRef}
      className={[
        'absolute inset-0 z-40 bg-base overflow-hidden',
        'transition-[opacity,transform] duration-300 ease-out',
        open
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-3 pointer-events-none',
      ].join(' ')}
      role="dialog"
      aria-modal="true"
      aria-label="Blind timer"
      onKeyDown={handleKeyDown}
    >
      {/* ── TIMER SCREEN ── */}
      <div
        className={[
          'absolute inset-0 flex flex-col transition-[opacity,transform] duration-250 ease-out',
          screen === 'timer'
            ? 'opacity-100 translate-x-0'
            : 'opacity-0 -translate-x-6 pointer-events-none',
        ].join(' ')}
      >
        {/* progress bar */}
        <div className="shrink-0 h-1 bg-surface-raised">
          <div
            className="h-full bg-accent transition-all duration-1000 ease-linear"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        {/* top buttons */}
        <div className="shrink-0 flex items-center justify-between px-4 pt-3 pb-1">
          <HamburgerButton onClick={onClose} triggerRef={closeRef} />
          <button
            onClick={openSettings}
            className={`h-11 px-3 flex items-center gap-1.5 rounded-xl bg-surface-raised text-ink-muted text-sm font-bold touch-manipulation hover:bg-surface-hover transition-colors ${FOCUS_RING}`}
            aria-label="Edit blind levels"
          >
            ⚙ Levels
          </button>
        </div>

        {/* main display */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 gap-3">
          <div className="text-xs font-bold text-ink-dim uppercase tracking-widest">
            Level {levelIdx + 1} of {levels.length}
          </div>

          <div className="text-3xl font-bold text-ink tabular-nums">
            {level.sb.toLocaleString()} / {level.bb.toLocaleString()}
          </div>

          <div
            className={[
              'text-[6rem] font-bold tabular-nums leading-none transition-colors duration-300',
              done    ? 'text-accent-lit'  :
              warning ? 'text-warn-strong' :
                        'text-ink',
            ].join(' ')}
          >
            {done ? 'Done' : fmt(timeLeft)}
          </div>

          <div className="text-sm text-ink-dim min-h-5">
            {nextLvl
              ? `Next: ${nextLvl.sb.toLocaleString()} / ${nextLvl.bb.toLocaleString()}`
              : isLast ? 'Final level' : ''}
          </div>
        </div>

        {/* controls */}
        <div className="shrink-0 flex items-center justify-center gap-5 px-6 pb-10">
          <button
            onClick={() => goToLevel(levelIdx - 1)}
            disabled={levelIdx === 0}
            className={`${NAV_BTN} bg-surface-raised text-ink hover:bg-surface-hover`}
            aria-label="Previous level"
          >
            ‹
          </button>

          <button
            onClick={() => { getAudioCtx(); setRunning(r => !r); }}
            disabled={done}
            className={`w-24 h-24 rounded-3xl flex items-center justify-center text-3xl touch-manipulation transition-colors disabled:opacity-40 bg-accent text-ink hover:bg-accent-lit ${FOCUS_RING}`}
            aria-label={running ? 'Pause' : 'Start'}
          >
            {running ? '⏸' : '▶'}
          </button>

          <button
            onClick={() => goToLevel(levelIdx + 1)}
            disabled={isLast}
            className={`${NAV_BTN} bg-surface-raised text-ink hover:bg-surface-hover`}
            aria-label="Next level"
          >
            ›
          </button>
        </div>
      </div>

      {/* ── SETTINGS SCREEN ── */}
      <div
        className={[
          'absolute inset-0 flex flex-col transition-[opacity,transform] duration-250 ease-out',
          screen === 'settings'
            ? 'opacity-100 translate-x-0'
            : 'opacity-0 translate-x-6 pointer-events-none',
        ].join(' ')}
      >
        {/* settings header */}
        <div className="shrink-0 flex items-center justify-between px-4 pt-4 pb-3 border-b border-border">
          <button
            ref={cogRef}
            onClick={closeSettings}
            className={`h-11 px-3 flex items-center gap-1.5 rounded-xl bg-surface-raised text-ink-muted text-sm font-bold touch-manipulation hover:bg-surface-hover transition-colors ${FOCUS_RING}`}
            aria-label="Back to timer"
          >
            ‹ Back
          </button>
          <h2 className="text-lg font-bold text-ink">Settings</h2>
          <div className="w-11" /> {/* spacer */}
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-6">

          {/* Duration */}
          <div className="flex flex-col gap-2">
            <span className="text-xs text-ink-dim uppercase tracking-wider">Minutes per level</span>
            <div role="radiogroup" aria-label="Level duration" className="flex gap-2">
              {DURATIONS.map(d => (
                <button
                  key={d}
                  role="radio"
                  aria-checked={levelDuration === d}
                  onClick={() => changeDuration(d)}
                  className={[
                    'flex-1 h-11 rounded-xl text-sm font-bold touch-manipulation transition-colors',
                    levelDuration === d
                      ? `bg-accent text-ink`
                      : `bg-surface-raised text-ink-muted hover:bg-surface-hover ${FOCUS_RING}`,
                  ].join(' ')}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Blind levels */}
          <div className="flex flex-col gap-2">
            <span className="text-xs text-ink-dim uppercase tracking-wider">Blind levels</span>
            <div className="flex flex-col gap-2">
              {levels.map((lv, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-raised">
                  <span className="text-xs text-ink-dim w-10 shrink-0">Lv {i + 1}</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    min="1"
                    value={lv.sb || ''}
                    onChange={e => updateLevel(i, 'sb', e.target.value)}
                    className="w-0 flex-1 h-9 rounded-lg bg-surface text-ink text-sm font-bold text-center focus:outline-none focus:ring-2 focus:ring-accent border border-border"
                    aria-label={`Level ${i + 1} small blind`}
                  />
                  <span className="text-ink-dim text-sm shrink-0">/</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    min="1"
                    value={lv.bb || ''}
                    onChange={e => updateLevel(i, 'bb', e.target.value)}
                    className="w-0 flex-1 h-9 rounded-lg bg-surface text-ink text-sm font-bold text-center focus:outline-none focus:ring-2 focus:ring-accent border border-border"
                    aria-label={`Level ${i + 1} big blind`}
                  />
                  <button
                    onClick={() => removeLevel(i)}
                    disabled={levels.length <= 1}
                    className={`w-8 h-8 shrink-0 rounded-lg text-ink-dim text-lg leading-none flex items-center justify-center hover:bg-surface-hover disabled:opacity-20 transition-colors ${FOCUS_RING}`}
                    aria-label={`Remove level ${i + 1}`}
                  >
                    <span className="relative -top-px">×</span>
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={addLevel}
              className={`w-full h-11 rounded-xl text-sm font-bold text-ink-muted bg-surface-raised hover:bg-surface-hover touch-manipulation transition-colors ${FOCUS_RING}`}
            >
              + Add level
            </button>
          </div>

          {/* Resets */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => { setLevels(DEFAULT_LEVELS); resetToLevel1(); }}
              className={`w-full h-11 rounded-xl text-sm font-bold text-ink-muted bg-surface-raised hover:bg-surface-hover touch-manipulation transition-colors ${FOCUS_RING}`}
            >
              Reset blind levels to defaults
            </button>
            <button
              onClick={() => { resetToLevel1(); closeSettings(); }}
              className={`w-full h-11 rounded-xl text-sm font-bold text-ink bg-accent hover:bg-accent-lit touch-manipulation transition-colors ${FOCUS_RING}`}
            >
              Reset to Level 1
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
