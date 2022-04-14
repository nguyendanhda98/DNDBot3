const profileModel = require("../models/profileSchema");
const messageEmbed = require("../util/messageEmbed");
module.exports = {
  name: "withdraw",
  aliases: ["with"],
  permissions: [],
  description: "withdraw coins from your bank",
  async execute(message, args, cmd, client, discord, profileData) {
    const amount = args[0];
    if (amount % 1 != 0 || amount <= 0)
      return message.channel.send("Không thể rút vì số DND không hợp lệ!");

    if (amount > profileData.bank)
      return message.channel.send(`Bạn không có đủ DND để rút`);

    await profileModel.findOneAndUpdate(
      {
        userID: message.author.id,
      },
      {
        $inc: {
          cash: amount,
          bank: -amount,
        },
      }
    );

    const extra = {
      setDescription: `Bạn đã rút **${amount} DND** từ ngân hàng`,
    };

    const newEmbed = messageEmbed(message, discord, extra);

    return message.channel.send({ embeds: [newEmbed] });
  },
};
