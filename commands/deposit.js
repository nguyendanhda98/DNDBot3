const profileModel = require("../models/profileSchema");
const messageEmbed = require("../util/messageEmbed");
module.exports = {
  name: "deposit",
  aliases: ["dep"],
  permissions: [],
  description: "Deposit coins into your bank!",
  async execute(message, args, cmd, client, discord, profileData) {
    const amount = args[0];
    if (amount % 1 != 0 || amount <= 0)
      return message.channel.send("Số DND không hợp lệ!");

    if (amount > profileData.cash)
      return message.channel.send(`Bạn không có đủ DND`);
    await profileModel.findOneAndUpdate(
      {
        userID: message.author.id,
      },
      {
        $inc: {
          cash: -amount,
          bank: amount,
        },
      }
    );

    const extra = {
      setDescription: `Bạn đã gửi **${amount} DND** vào ngân hàng của bạn`,
    };

    const newEmbed = messageEmbed(message, discord, extra);
    return message.channel.send({ embeds: [newEmbed] });
  },
};
