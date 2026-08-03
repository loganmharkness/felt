import { useEffect, useRef } from 'react';
import { FOCUS_RING } from '../styles';

const CARD = [
  'w-full flex items-center justify-between px-5 py-4 rounded-2xl text-left',
  'bg-surface-raised text-ink touch-manipulation',
  'hover:bg-surface-hover active:bg-surface-hover transition-colors',
  FOCUS_RING,
].join(' ');

const SECTION_LABEL = 'text-xs font-bold text-ink-dim uppercase tracking-widest mb-2';

function MenuItem({ label, sub, onClick, delay, open, triggerRef }) {
  return (
    <button
      ref={triggerRef}
      className={CARD}
      style={{
        opacity:         open ? 1 : 0,
        transform:       open ? 'translateY(0)' : 'translateY(10px)',
        transition:      'opacity 280ms ease-out, transform 280ms ease-out',
        transitionDelay: open ? `${delay}ms` : '0ms',
      }}
      onClick={onClick}
    >
      <div>
        <div className="font-bold text-ink">{label}</div>
        <div className="text-xs text-ink-dim mt-0.5">{sub}</div>
      </div>
      <span className="text-ink-dim text-xl leading-none ml-4">›</span>
    </button>
  );
}

export default function HamburgerMenu({ open, onClose, dark, onDarkToggle, onShowRanges, onShowRankings, onShowPotOdds, onShowBlindTimer, onShowPayoutCalc }) {
  const containerRef = useRef(null);
  const firstItemRef = useRef(null);

  useEffect(() => {
    if (open) firstItemRef.current?.focus();
  }, [open]);

  function handleKeyDown(e) {
    if (!open) return;
    if (e.key === 'Escape') { onClose(); return; }
    if (e.key !== 'Tab') return;
    const els = containerRef.current?.querySelectorAll(
      'button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (!els?.length) return;
    const first = els[0], last = els[els.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  function handleAction(cb) {
    onClose();
    setTimeout(cb, 80);
  }

  return (
    <div
      ref={containerRef}
      className={[
        'absolute inset-0 z-40 flex flex-col bg-base',
        'transition-[opacity,transform] duration-300 ease-out',
        open
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-3 pointer-events-none',
      ].join(' ')}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      onKeyDown={handleKeyDown}
    >
      <div className="flex-1 flex flex-col px-5 pt-8 pb-6 gap-6 overflow-y-auto">

        <h1
          className="text-xl font-bold text-ink tracking-tight text-center"
          style={{
            opacity:    open ? 1 : 0,
            transform:  open ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 280ms ease-out, transform 280ms ease-out',
          }}
        >
          FELT
        </h1>

        {/* For players */}
        <div className="flex flex-col gap-2">
          <p className={SECTION_LABEL}>For players</p>
          <MenuItem label="Preflop Ranges"      sub="Push/Fold, RFI, and Vs Raise"   onClick={() => handleAction(onShowRanges)}   delay={20}  open={open} triggerRef={firstItemRef} />
          <MenuItem label="Hand Rankings"       sub="Royal flush through high card"  onClick={() => handleAction(onShowRankings)} delay={60}  open={open} />
          <MenuItem label="Pot Odds Calculator" sub="Equity needed to break even"    onClick={() => handleAction(onShowPotOdds)}  delay={110} open={open} />
        </div>

        {/* For hosts */}
        <div className="flex flex-col gap-2">
          <p className={SECTION_LABEL}>For hosts</p>
          <MenuItem label="Blind Timer"         sub="Countdown with auto level advance" onClick={() => handleAction(onShowBlindTimer)}  delay={170} open={open} />
          <MenuItem label="Payout Calculator"   sub="Prize pool and per-place splits"   onClick={() => handleAction(onShowPayoutCalc)} delay={220} open={open} />
        </div>

        {/* Dark mode */}
        <div
          className="flex items-center justify-between px-5 py-4 rounded-2xl bg-surface-raised"
          style={{
            opacity:         open ? 1 : 0,
            transform:       open ? 'translateY(0)' : 'translateY(10px)',
            transition:      'opacity 280ms ease-out, transform 280ms ease-out',
            transitionDelay: open ? '270ms' : '0ms',
          }}
        >
          <div>
            <div className="font-bold text-ink">Dark mode</div>
            <div className="text-xs text-ink-dim mt-0.5">{dark ? 'On' : 'Off'}</div>
          </div>
          <button
            role="switch"
            aria-checked={dark}
            onClick={onDarkToggle}
            className={[
              'relative w-12 h-7 rounded-full transition-colors duration-200 shrink-0',
              dark ? 'bg-accent' : 'bg-border',
              FOCUS_RING,
            ].join(' ')}
            aria-label="Toggle dark mode"
          >
            <span
              className="absolute top-1 left-0 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200"
              style={{ transform: dark ? 'translateX(18px)' : 'translateX(2px)' }}
            />
          </button>
        </div>

        <div className="flex-1" />

        {/* Close */}
        <div
          className="flex justify-center pt-2"
          style={{
            opacity:         open ? 1 : 0,
            transition:      'opacity 280ms ease-out',
            transitionDelay: open ? '300ms' : '0ms',
          }}
        >
          <button
            onClick={onClose}
            className={[
              'w-14 h-14 rounded-full bg-surface-raised text-ink-muted',
              'text-3xl font-light flex items-center justify-center',
              'touch-manipulation hover:bg-surface-hover transition-colors',
              FOCUS_RING,
            ].join(' ')}
            aria-label="Close menu"
          >
            <span className="relative -top-px">×</span>
          </button>
        </div>

      </div>
    </div>
  );
}
