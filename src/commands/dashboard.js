const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dashboard')
    .setDescription('Shows the link to the moderation dashboard'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor('#5865f2')
      .setTitle('🧠 Pulse Dashboard')
      .setDescription('Use the dashboard to manage warns, bans and the moderation log.')
      .addFields({ name: 'Open', value: 'Open the dashboard in your browser and use it with this bot.' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
