const {
  SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('add')
    .setDescription('Ajouter un membre au ticket')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('Le membre à ajouter au ticket')
        .setRequired(true)),
  async execute(interaction, client) {
    const chan = client.channels.cache.get(interaction.channelId);
    const user = interaction.options.getUser('target');
    if (!interaction.member.roles.cache.find(r => r.id === client.config.roleSupport)) return interaction.reply({ content: "You need to have the <@&" + client.config.roleSupport + "> role.", ephemeral: true })
    if (chan.name.includes('ticket')) {
      chan.edit({
        permissionOverwrites: [{
          id: user,
          allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
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
          content: `<@${user.id}> has been added to the ticket!`
        });
      });
    } else {
      interaction.reply({
        content: 'Vous ne vous trouvez pas dans le channel du ticket!',
        ephemeral: true
      });
    };
  },
};
