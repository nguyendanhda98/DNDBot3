module.exports = {
  name: "ping",
  aliases: ["ping1", "ping2", "ping3"],
  cooldown: 10,
  // permissions: ["ADMINISTRATOR", "MANAGE_MESSAGES", "CONNECT"],
  permissions: [],
  description: "this is a ping command!",
  execute(message, args, cmd, client, Discord) {
    message.channel.send("pong!");
  },
};
