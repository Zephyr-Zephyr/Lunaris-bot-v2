const { EmbedBuilder } = require('discord.js'); 
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Der Bot wiederholt deine Nachricht')
    .addStringOption(option =>
      option
        .setName('message')
        .setDescription('Die Nachricht, die der Bot wiederholen soll')
        .setRequired(true)
    ),

  async execute(interaction) {
    const text = interaction.options.getString('message');

    await interaction.reply(text);
  }
};