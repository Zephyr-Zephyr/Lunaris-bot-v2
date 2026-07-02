const test = require('node:test');
const assert = require('node:assert/strict');
const { parseDurationToMs } = require('../src/utils/time');

test('parses duration strings correctly', () => {
  assert.equal(parseDurationToMs('10m'), 10 * 60 * 1000);
  assert.equal(parseDurationToMs('2h'), 2 * 60 * 60 * 1000);
  assert.equal(parseDurationToMs('1d'), 24 * 60 * 60 * 1000);
  assert.equal(parseDurationToMs('invalid'), null);
});
