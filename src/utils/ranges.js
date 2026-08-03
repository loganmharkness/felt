import data from '../data/ranges.json';

export const RANKS = ['A','K','Q','J','T','9','8','7','6','5','4','3','2'];
const ri = (r) => RANKS.indexOf(r);

export function cellHand(row, col) {
  if (row === col) return RANKS[row] + RANKS[row];
  if (row < col) return RANKS[row] + RANKS[col] + 's';
  return RANKS[col] + RANKS[row] + 'o';
}

function expandNotation(n) {
  if (n === '100%') {
    const all = [];
    for (let i = 0; i < 13; i++)
      for (let j = 0; j < 13; j++)
        all.push(cellHand(i, j));
    return all;
  }

  if (n.length === 3 && n[2] === '+' && n[0] === n[1]) {
    const max = ri(n[0]);
    return RANKS.slice(0, max + 1).map(r => r + r);
  }

  if (n.length === 2 && n[0] === n[1]) return [n];

  if (n.length === 4 && n.endsWith('s+')) {
    const hi = ri(n[0]), lo = ri(n[1]);
    const hands = [];
    for (let i = hi + 1; i <= lo; i++) hands.push(n[0] + RANKS[i] + 's');
    return hands;
  }

  if (n.length === 4 && n.endsWith('o+')) {
    const hi = ri(n[0]), lo = ri(n[1]);
    const hands = [];
    for (let i = hi + 1; i <= lo; i++) hands.push(n[0] + RANKS[i] + 'o');
    return hands;
  }

  if (n.length === 3) return [n];

  return [];
}

function nearestBucket(stack) {
  return data.buckets.reduce((best, b) =>
    Math.abs(b - stack) < Math.abs(best - stack) ? b : best
  );
}

function effectiveStack(stack, players) {
  if (players <= 2) return stack - 4;
  if (players <= 3) return stack - 3;
  if (players <= 4) return stack - 2;
  if (players <= 5) return stack - 1;
  return stack;
}

export function notationToSet(notation) {
  const hands = new Set();
  for (const n of notation) {
    for (const h of expandNotation(n)) hands.add(h);
  }
  return hands;
}

export function getPushSet(stack, position, players = 6) {
  const adjusted = Math.max(2, effectiveStack(stack, players));
  const bucket = nearestBucket(adjusted);
  const notation = data.data[bucket]?.[position];
  if (!notation) return new Set();
  return notationToSet(notation);
}

export function getActiveBucket(stack, players = 6) {
  const adjusted = Math.max(2, effectiveStack(stack, players));
  return nearestBucket(adjusted);
}

export const POSITIONS_BY_COUNT = {
  2: ['SB', 'BB'],
  3: ['BTN', 'SB', 'BB'],
  4: ['CO', 'BTN', 'SB', 'BB'],
  5: ['MP', 'CO', 'BTN', 'SB', 'BB'],
  6: ['UTG', 'MP', 'CO', 'BTN', 'SB', 'BB'],
};

export const BB_POSITIONS = new Set(['BB']);
