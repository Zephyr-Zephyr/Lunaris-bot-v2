const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const modulePath = '../src/utils/moderationStore';

test('creates warns and bans and toggles them', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pulse-store-'));
  const tempFile = path.join(tempDir, 'moderation.json');
  process.env.PULSE_DATA_PATH = tempFile;

  delete require.cache[require.resolve(modulePath)];
  const store = require(modulePath);

  const warn = store.createWarn({
    guildId: 'guild-1',
    targetId: 'u1',
    targetName: 'Alice',
    modId: 'm1',
    modName: 'Mod',
    reason: 'Spam',
  });

  const ban = store.createBan({
    guildId: 'guild-1',
    targetId: 'u2',
    targetName: 'Bob',
    modId: 'm1',
    modName: 'Mod',
    reason: 'Raid',
    duration: '7 Tage',
  });

  const summary = store.getSummary('guild-1');
  assert.equal(summary.warns.total, 1);
  assert.equal(summary.bans.total, 1);
  assert.equal(summary.warns.active, 1);

  const toggledWarn = store.toggleWarn(warn.id, 'guild-1');
  assert.equal(toggledWarn.active, false);

  const toggledBan = store.toggleBan(ban.id, 'guild-1');
  assert.equal(toggledBan.active, false);

  const entries = store.getEntries('guild-1');
  assert.equal(entries.length, 2);
});
