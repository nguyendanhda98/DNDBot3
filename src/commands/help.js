import { bcEmojis } from '../util/constant.js';
import messageEmbed from '../util/messageEmbed.js';

export const name = 'help';
export const aliases = [];
export const cooldown = 0;
export const permissions = [];
export const description = 'this is help command';
export function execute(message, args, cmd, client, discord, profileData) {
  let extra = {};
  const { author, mentions } = message;
  // message.channel.send('pong!');

  switch (args[0]) {
    case 'bc':
      extra = {
        setTitle: 'Hướng dẫn chơi Bầu Cua',
        setDescription: `Tạo phòng: \`d.bc new\`
Vào bàn: \`d.bc join <nhà cái>\`
Đặt cược: \`d.bc bet <con vật> <tiền cược>\`
Bắt đầu: \`d.bc start\`
Con vật: ${bcEmojis.bau}\`bau\`, ${bcEmojis.cua}\`cua\`, ${bcEmojis.tom}\`tom\`, ${bcEmojis.ca}\`ca\`, ${bcEmojis.nai}\`nai\`, ${bcEmojis.ga}\`ga\`
Thông tin bàn: \`d.bc info\`
Rời bàn: \`d.bc leave\`
Đá người chơi: \`d.bc kick @user\`
\u200B`,
      };
      break;
    default:
      extra = {
        setTitle: 'Hướng dẫn sử dụng',
        setDescription: `Prefix: \`d.\``,
        addFields: [
          { name: 'work', value: 'Làm việc kiếm tiền' },
          { name: 'with', value: 'Rút tiền từ ngần hàng' },
          { name: 'dep', value: 'Cất tiền vào ngân hàng' },
          { name: 'cf', value: `Tung đồng xu. \`cf <head/tail> <tiền cược>\`` },
          {
            name: 'give',
            value: `Chuyển tiền. \`give <người nhận> <số tiền>\``,
          },
          { name: 'de', value: `Chơi đề. \`de <tiền cược> <số cược>\`` },
          { name: 'money', value: 'Kiểm tra số tiền của mình' },
          { name: 'add-money', value: 'Cộng tiền cho người chơi' },
          { name: '3caybot', value: `Chơi 3 cây. \`3caybot <tiền cược>\`` },
          {
            name: 'Tạo bàn chơi 3 cây',
            value: `\`3cay new\` \`3cay join @user\` \`3cay ready\` \`3cay bet <tiền cược>\` \`3cay start\` \`3cay info\``,
          },
          { name: 'bc', value: `Chơi Bầu Cua. \`d.bc new\`` },
        ],
      };
      break;
  }

  const newEmbed = messageEmbed(message, discord, extra);
  return message.channel.send({ embeds: [newEmbed] });
}
