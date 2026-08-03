import vsData from '../data/vsraise-ranges.json';
import { notationToSet } from './ranges';

const buckets = vsData.buckets;

function nearestBucket(stack) {
  return buckets.reduce((best, b) =>
    Math.abs(b - stack) < Math.abs(best - stack) ? b : best
  );
}

export const VALID_RAISERS = {
  MP:  ['UTG'],
  CO:  ['UTG', 'MP'],
  BTN: ['UTG', 'MP', 'CO'],
  SB:  ['UTG', 'MP', 'CO', 'BTN'],
  BB:  ['UTG', 'MP', 'CO', 'BTN', 'SB'],
};

export const VSRAISE_POSITIONS = ['MP', 'CO', 'BTN', 'SB', 'BB'];

// Returns Map<hand, 'threeBet' | 'call'>; fold is implicit
export function getVsraiseMap(stack, heroPos, raiserPos) {
  const bucket = nearestBucket(stack);
  const entry = vsData.data[bucket]?.[heroPos]?.[raiserPos];
  if (!entry) return new Map();
  const map = new Map();
  for (const h of notationToSet(entry.threeBet ?? [])) map.set(h, 'threeBet');
  for (const h of notationToSet(entry.call ?? [])) map.set(h, 'call');
  return map;
}

export function getVsraiseBucket(stack) {
  return nearestBucket(stack);
}
