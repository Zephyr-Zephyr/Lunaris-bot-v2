const { ChannelType, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    // Slash Commands
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);

      if (!command) return;

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        const replyOpts = { content: '❌ Es gab einen Fehler beim Ausführen des Befehls!', flags: 64 };
        if (interaction.replied || interaction.deferred) await interaction.followUp(replyOpts);
        else await interaction.reply(replyOpts);
      }
    }

    // Button Interactions
    if (interaction.isButton()) {
      if (interaction.customId === 'create_ticket') {
        const replyOpts = { content: 'This ticket menu is legacy; please use the category menu.', flags: 64 };
        if (interaction.replied || interaction.deferred) await interaction.followUp(replyOpts);
        else await interaction.reply(replyOpts);
      }

      if (interaction.customId === 'confirm_close') {
        await interaction.channel.delete().catch(err => {
          console.error('Fehler beim Löschen des Channels:', err);
        });
      }

      if (interaction.customId === 'enter_giveaway') {
        const embed = new EmbedBuilder()
          .setColor('#FFD700')
          .setTitle('✨ Giveaway!')
          .setDescription('You have entered the giveaway! Good luck! 🍀')
          .setTimestamp();

        const replyOpts = { embeds: [embed], flags: 64 };
        if (interaction.replied || interaction.deferred) await interaction.followUp(replyOpts);
        else await interaction.reply(replyOpts);

        // React to track participation
        await interaction.message.react('✨');
      }

      if (interaction.customId.startsWith('verify_member')) {
        try {
          const roleId = interaction.customId.split(':')[1] || null;
          const guild = interaction.guild;
          let member;
          try {
            member = await guild.members.fetch(interaction.user.id);
          } catch (fetchErr) {
            console.error('Could not fetch member for verification:', fetchErr);
            const replyOpts = { content: '❌ Could not fetch your member data. Try again or contact an admin.', flags: 64 };
            if (interaction.replied || interaction.deferred) await interaction.followUp(replyOpts);
            else await interaction.reply(replyOpts);
            return;
          }

          const botMember = guild.members.me;
          if (!botMember.permissions.has(PermissionFlagsBits.ManageRoles)) {
            const replyOpts = { content: '❌ I need the Manage Roles permission to assign verification roles. Please grant it.', flags: 64 };
            if (interaction.replied || interaction.deferred) await interaction.followUp(replyOpts);
            else await interaction.reply(replyOpts);
            return;
          }

          if (!roleId) {
            const replyOpts = { content: '⚠️ No verification role was configured.', flags: 64 };
            if (interaction.replied || interaction.deferred) await interaction.followUp(replyOpts);
            else await interaction.reply(replyOpts);
            return;
          }

          const role = guild.roles.cache.get(roleId);
          if (!role) {
            const replyOpts = { content: '⚠️ The configured verification role does not exist.', flags: 64 };
            if (interaction.replied || interaction.deferred) await interaction.followUp(replyOpts);
            else await interaction.reply(replyOpts);
            return;
          }

          if (role.position >= botMember.roles.highest.position) {
            const replyOpts = { content: '❌ I cannot assign that role because it is higher or equal to my highest role. Move my role above it.', flags: 64 };
            if (interaction.replied || interaction.deferred) await interaction.followUp(replyOpts);
            else await interaction.reply(replyOpts);
            return;
          }

          try {
            await member.roles.add(roleId);
            const replyOpts = { content: '✅ You have been verified and given access!', flags: 64 };
            if (interaction.replied || interaction.deferred) await interaction.followUp(replyOpts);
            else await interaction.reply(replyOpts);
          } catch (assignErr) {
            console.error('Error assigning verification role:', assignErr);
            const replyOpts = { content: '❌ Failed to assign the verification role. Contact an admin.', flags: 64 };
            if (interaction.replied || interaction.deferred) await interaction.followUp(replyOpts);
            else await interaction.reply(replyOpts);
          }
        } catch (err) {
          console.error('Error during verification:', err);
          const replyOpts = { content: '❌ Error during verification. Contact an admin.', flags: 64 };
          if (interaction.replied || interaction.deferred) await interaction.followUp(replyOpts);
          else await interaction.reply(replyOpts);
        }
      }

      if (interaction.customId === 'open_ticket') {
        const ticketChannel = await interaction.guild.channels.create({
          name: `ticket-${interaction.user.username}`,
          type: ChannelType.GuildText,
          permissionOverwrites: [
            { id: interaction.guild.id, deny: ['ViewChannel'] },
            { id: interaction.user.id, allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'] },
          ],
        });

        const embed = new EmbedBuilder()
          .setColor('#5865f2')
          .setTitle('🎫 New support ticket')
          .setDescription(`Hi ${interaction.user}, your ticket is ready. Describe your issue and a staff member will assist shortly.`);

        await ticketChannel.send({ content: `${interaction.user}`, embeds: [embed] });
        const replyOpts = { content: `✅ Your ticket channel was created: ${ticketChannel}`, flags: 64 };
        if (interaction.replied || interaction.deferred) await interaction.followUp(replyOpts);
        else await interaction.reply(replyOpts);
      }
    }

    // Select Menu Interactions (ticket category)
    if (interaction.isStringSelectMenu()) {
      if (interaction.customId === 'ticket_category_select') {
        const choice = interaction.values[0];
        const categoryMap = {
          support: 'Support',
          vip: 'VIP',
          bug: 'Bug-Report',
          suggestion: 'Suggestion',
          pack: 'Pack-Request',
        };

        const ticketChannel = await interaction.guild.channels.create({
          name: `ticket-${interaction.user.username}`,
          type: ChannelType.GuildText,
          permissionOverwrites: [
            {
              id: interaction.guild.id,
              deny: ['ViewChannel'],
            },
            {
              id: interaction.user.id,
              allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'],
            },
          ],
        });

        const embed = new EmbedBuilder()
          .setColor('#00ff00')
          .setTitle(`🎫 ${categoryMap[choice]} Ticket`)
          .setDescription(`Hello ${interaction.user}, your ${categoryMap[choice]} ticket has been created. Our team will be with you shortly.`)
          .setTimestamp();

        await ticketChannel.send({ content: `${interaction.user}`, embeds: [embed] });

        const replyOpts = { content: `✅ Your ${categoryMap[choice]} ticket was created: ${ticketChannel}`, flags: 64 };
        if (interaction.replied || interaction.deferred) await interaction.followUp(replyOpts);
        else await interaction.reply(replyOpts);
      }
    }
  },
};
