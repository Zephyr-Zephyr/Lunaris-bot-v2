const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('verify')
    .setDescription('Create a verification panel')
    .addChannelOption(option => option.setName('channel').setDescription('Channel for the panel').setRequired(true))
    .addRoleOption(option => option.setName('role').setDescription('Role to assign after verification').setRequired(true)),

  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    const role = interaction.options.getRole('role');

    const embed = new EmbedBuilder()
      .setColor('#23a559')
      .setTitle('✅ Verification')
      .setDescription(`Click the button below to verify and receive the ${role} role.`);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`verify_member:${role.id}`)
        .setLabel('Verify me')
        .setStyle(ButtonStyle.Success)
    );

    await channel.send({ embeds: [embed], components: [row] });
    await interaction.reply({ content: `✅ Verification panel created in ${channel}.`, ephemeral: true });
  },
};
