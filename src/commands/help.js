import messageEmbed from '../util/messageEmbed.js';

export const name = 'help';
export const aliases = [];
export const cooldown = 0;
export const permissions = [];
export const description = 'this is help command';
export function execute(message, args, cmd, client, discord, profileData) {
  const extra = {
    setTitle: 'Hướng dẫn sử dụng',
    setDescription: `Prefix: \`d.\``,
    addFields: [
      { name: 'work', value: 'Làm việc kiếm tiền' },
      { name: 'with', value: 'Rút tiền từ ngần hàng' },
      { name: 'dep', value: 'Cất tiền vào ngân hàng' },
      { name: 'cf', value: `Đá gà. \`cf <tiền cược>\`` },
      { name: 'give', value: `Chuyển tiền. \`give <người nhận> <số tiền>\`` },
      { name: 'de', value: `Chơi đề. \`de <tiền cược> <số cược>\`` },
      { name: 'money', value: 'Kiểm tra số tiền của mình' },
      { name: 'add-money', value: 'Cộng tiền cho người chơi' },
      { name: '3caybot', value: `Chơi 3 cây. \`3caybot <tiền cược>\`` },
      {
        name: 'Tạo bàn chơi 3 cây',
        value: `\`3cay new\` \`3cay join @user\` \`3cay ready\` \`3cay bet <tiền cược>\` \`3cay start\` \`3cay info\``,
      },
    ],
  };

  const newEmbed = messageEmbed(message, discord, extra);
  return message.channel.send({ embeds: [newEmbed] });
}
