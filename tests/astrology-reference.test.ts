import assert from 'node:assert/strict';
import test from 'node:test';

import { diagnoseUser } from '../src/utils/astrology.js';

const roundBalance = (balance: Record<string, number>) =>
  Object.fromEntries(
    Object.entries(balance).map(([element, value]) => [element, Number(value.toFixed(2))])
  );

test('matches the suimei.com element balance reference for 2003-03-26 12:00 female', () => {
  const result = diagnoseUser(new Date(2003, 2, 26, 12, 0, 0), 12, 'female');

  assert.deepEqual(result.elementBalanceRaw, {
    '木': 60,
    '火': 60,
    '土': 160,
    '金': 0,
    '水': 20,
  });
  assert.deepEqual(roundBalance(result.elementBalance), {
    '木': 50,
    '火': 50,
    '土': 66.67,
    '金': 40,
    '水': 43.33,
  });
  assert.equal(Number(result.elementBalanceDifferenceTotal.toFixed(2)), 33.33);
});
