import rfiData from '../data/rfi-ranges.json';
import { notationToSet } from './ranges';

const buckets = rfiData.buckets;

function nearestBucket(stack) {
  return buckets.reduce((best, b) =>
    Math.abs(b - stack) < Math.abs(best - stack) ? b : best
  );
}

export function getRFISet(stack, position) {
  const bucket = nearestBucket(stack);
  const notation = rfiData.data[bucket]?.[position];
  return notation ? notationToSet(notation) : new Set();
}

export function getRFIBucket(stack) {
  return nearestBucket(stack);
}

export const RFI_POSITIONS = ['UTG', 'MP', 'CO', 'BTN', 'SB'];
