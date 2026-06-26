module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`✅ Bot ist online als ${client.user.tag}`);
    console.log(`📊 Bot ist auf ${client.guilds.cache.size} Servern aktiv`);

    // Slash Commands registrieren
    const rawCommands = client.commands && typeof client.commands.values === 'function'
      ? Array.from(client.commands.values())
      : client.commands
        ? Object.values(client.commands)
        : [];
    const commands = rawCommands.map(cmd => cmd.data?.toJSON()).filter(Boolean);

    client.application.commands.set(commands).catch(error => {
      console.error('Fehler beim Registrieren der Commands:', error);
    });

    // Bot Status
    client.user.setActivity('Lunaris Ticket Bot', { type: 'WATCHING' });
  },
};
