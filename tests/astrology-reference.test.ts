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

test('keeps the 1970-05-13 rhythm aligned to the 2026 reference year', () => {
  const result = diagnoseUser(
    new Date(1970, 4, 13, 12, 0, 0),
    12,
    'male',
    new Date(2026, 6, 28, 12, 0, 0),
  );

  assert.deepEqual(
    result.rhythm.map((node) => `${node.year}:${node.stem}${node.branch}`),
    [
      '2024:甲辰',
      '2025:乙巳',
      '2026:丙午',
      '2027:丁未',
      '2028:戊申',
      '2029:己酉',
      '2030:庚戌',
      '2031:辛亥',
      '2032:壬子',
      '2033:癸丑',
      '2034:甲寅',
      '2035:乙卯',
    ],
  );
  assert.equal(result.monthlyRhythm.find((node) => node.month === 7)?.seasonPhase, '秋3年目「愚者」');
  assert.equal(result.seasonCycle.startBranch, '巳');
  assert.equal(result.seasonCycle.directionLabel, '順行（右回り）');
  assert.equal(result.seasonCycle.birth.season, '夏');
  assert.equal(result.seasonCycle.current.season, '秋');
  assert.equal(result.seasonCycle.current.instinct, '攻撃本能');
  assert.equal(result.seasonCycle.current.ageFrom, 30);
  assert.equal(result.seasonCycle.current.ageTo, 59);
});
