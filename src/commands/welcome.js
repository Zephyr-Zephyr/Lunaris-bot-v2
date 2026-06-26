const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('welcome')
    .setDescription('Verwalte das Welcome-System')
    .addSubcommand(subcommand =>
      subcommand
        .setName('set')
        .setDescription('Configure the welcome message and verification role')
        .addChannelOption(option =>
          option
            .setName('channel')
            .setDescription('Channel for welcome messages')
            .setRequired(true)
        )
        .addStringOption(option =>
          option
            .setName('message')
            .setDescription('Welcome message (use {user} for mention)')
            .setRequired(true)
        )
        .addRoleOption(option =>
          option
            .setName('role')
            .setDescription('Role to assign on verification (optional)')
            .setRequired(false)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('test')
        .setDescription('Teste die Welcome-Nachricht')
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'set') {
      const channel = interaction.options.getChannel('channel');
      const message = interaction.options.getString('message');
      const role = interaction.options.getRole('role');

      // Save to config file
      const fs = require('fs');
      const path = require('path');
      const configPath = path.join(__dirname, '../../config.json');

      let config = {};
      if (fs.existsSync(configPath)) {
        config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      }

      config.welcomeChannel = channel.id;
      config.welcomeMessage = message;
      if (role) config.welcomeVerifyRole = role.id;

      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

      const replyOpts = { content: `✅ Welcome system configured in ${channel}`, flags: 64 };
      if (interaction.replied || interaction.deferred) await interaction.followUp(replyOpts);
      else await interaction.reply(replyOpts);
    }

    if (subcommand === 'test') {
      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('👋 Welcome!')
        .setDescription(`Welcome to our server, ${interaction.user}!`)
        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
        .setTimestamp();

      const replyOpts = { embeds: [embed], flags: 64 };
      if (interaction.replied || interaction.deferred) await interaction.followUp(replyOpts);
      else await interaction.reply(replyOpts);
    }
  },
};
