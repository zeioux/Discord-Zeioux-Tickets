const {
    SlashCommandBuilder
  } = require('@discordjs/builders');
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName('remove')
      .setDescription('Retirer un membre du ticket')
      .addUserOption(option =>
        option.setName('target')
        .setDescription('Membre à retirer du ticket')
        .setRequired(true)),
    async execute(interaction, client) {
      const chan = client.channels.cache.get(interaction.channelId);
      const user = interaction.options.getUser('target');
      if (!interaction.member.roles.cache.find(r => r.id === client.config.roleSupport)) return interaction.reply({content: "Vous devez avoir le<@&" + client.config.roleSupport + "> role.", ephemeral: true})
      if (chan.name.includes('ticket')) {
        chan.edit({
          permissionOverwrites: [{
            id: user,
            deny: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
          },
          {
            id: interaction.guild.roles.everyone,
            deny: ['VIEW_CHANNEL'],
          },
          {
            id: client.config.roleSupport,
            allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
          },
        ],
        }).then(async () => {
          interaction.reply({
            content: `<@${user.id}> a bien été retiré du ticket!`
          });
        });
      } else {
        interaction.reply({
          content: 'Vous ne vous trouvez pas dans le channel ticket!',
          ephemeral: true
        });
      };
    },
  };
  