const test = require('node:test');
const assert = require('node:assert/strict');

const { containsDiscordInvite } = require('../src/utils/security');

test('detects Discord invite links', () => {
  assert.equal(containsDiscordInvite('Check this invite: https://discord.gg/abc123'), true);
  assert.equal(containsDiscordInvite('Join our server at https://discord.com/invite/xyz'), true);
  assert.equal(containsDiscordInvite('This is a normal message without links'), false);
});
