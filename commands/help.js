const messageEmbed = require("../util/messageEmbed");

module.exports = {
  name: "help",
  aliases: [],
  cooldown: 0,
  permissions: [],
  description: "this is help command",
  execute(message, args, cmd, client, discord, profileData) {
    const extra = {
      setTitle: "Hướng dẫn sử dụng",
      setDescription: `Prefix: \`d.\``,
      addFields: [
        { name: "work", value: "Làm việc kiếm tiền" },
        { name: "with", value: "Rút tiền từ ngần hàng" },
        { name: "dep", value: "Cất tiền vào ngân hàng" },
        { name: "cf", value: `Đá gà. \`cf <tiền cược>\`` },
        { name: "give", value: `Chuyển tiền. \`give <người nhận> <số tiền>\`` },
        { name: "de", value: `Chơi đề. \`de <tiền cược> <số cược>\`` },
        { name: "money", value: "Kiểm tra số tiền của mình" },
      ],
    };

    const newEmbed = messageEmbed(message, discord, extra);
    return message.channel.send({ embeds: [newEmbed] });
  },
};
