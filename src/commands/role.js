module.exports = {
  name: "role",
  description: "this is a role command!",
  execute(client, message, args) {
    if (message.member.roles.cache.has("752620719279439954")) {
      message.channel.send("You have the permission");
    } else {
      message.channel.send("You DON'T have the permission!");
      message.member.roles.add("922881434811760711");
    }
  },
};
