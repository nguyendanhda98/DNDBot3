import messageEmbed from '../util/messageEmbed.js';
export const name = "money";
export const aliases = [];
export const permissions = [];
export const description = "Check the user balance";
export function execute(message, args, cmd, client, discord, profileData) {
  const extra = {
    setDescription: `${message.author.username}, Bạn có ${profileData.cash} DND trong ví và ${profileData.bank} DND trong ngân hàng`,
  };

  const newEmbed = messageEmbed(message, discord, extra);

  return message.channel.send({ embeds: [newEmbed] });
}
