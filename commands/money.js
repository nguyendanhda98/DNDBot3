const messageEmbed = require("../util/messageEmbed");

module.exports = {
  name: "money",
  aliases: [],
  permissions: [],
  description: "Check the user balance",
  execute(message, args, cmd, client, discord, profileData) {
    const extra = {
      setDescription: `${message.author.username}, Bạn có ${profileData.cash} DND trong ví và ${profileData.bank} DND trong ngân hàng`,
    };

    const newEmbed = messageEmbed(message, discord, extra);

    return message.channel.send({ embeds: [newEmbed] });
  },
};
