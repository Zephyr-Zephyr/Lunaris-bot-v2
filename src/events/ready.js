const { registerCommands } = require('../utils/commandRegistrar');
const fs = require('fs');
const path = require('path');

async function scheduleAnnouncements(client) {
  const configPath = path.join(__dirname, '../../config.json');
  let config = {};

  if (fs.existsSync(configPath)) {
    config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  }

  if (!config.announcementChannel || !config.announcementMessage) {
    return;
  }

  const intervalMs = Number(config.announcementIntervalMs || (Number(config.announcementIntervalSeconds) * 1000)) || 120000;
  if (intervalMs < 10000) {
    console.warn('⚠️ announcementIntervalMs is too small; using 120000ms instead.');
  }

  const delay = intervalMs >= 10000 ? intervalMs : 120000;

  const sendAnnouncement = async () => {
    try {
      const channel = await client.channels.fetch(config.announcementChannel).catch(() => null);
      if (!channel || !channel.isTextBased?.()) return;

      await channel.send({ content: config.announcementMessage });
      console.log(`📣 Gesendet: ${config.announcementMessage}`);
    } catch (error) {
      console.error('Fehler beim Senden der Ankündigung:', error);
    }
  };

  setInterval(sendAnnouncement, delay);
}

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    console.log(`✅ Bot ist online als ${client.user.tag}`);
    console.log(`📊 Bot ist auf ${client.guilds.cache.size} Servern aktiv`);

    try {
      const rawCommands = client.commands && typeof client.commands.values === 'function'
        ? Array.from(client.commands.values())
        : client.commands
          ? Object.values(client.commands)
          : [];

      const result = await registerCommands(client, rawCommands);
      console.log(`🧩 Slash-Commands registriert (${result.scope}, ${result.registered} Befehle)`);
    } catch (error) {
      console.error('Fehler beim Registrieren der Commands:', error);
    }

    client.user.setActivity('Lunaris Ticket Bot', { type: 'WATCHING' });
    await scheduleAnnouncements(client);
  },
};
