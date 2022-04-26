export default (message, discord, extra) => {
  const {
    setColor,
    setTitle,
    setURL,
    setFooter,
    setImage,
    addField,
    addFields,
    setThumbnail,
    setDescription,
  } = extra;

  const messageEmbed = new discord.MessageEmbed()
    .setAuthor({
      name: message.author.tag,
      iconURL: message.author.displayAvatarURL(),
    })
    .setTimestamp();

  if (setDescription) {
    messageEmbed.setDescription(setDescription);
  }

  if (setThumbnail) {
    messageEmbed.setThumbnail(setThumbnail);
  }

  if (addField) {
    messageEmbed.addField(...addField);
  }

  if (setImage) {
    messageEmbed.setImage(setImage);
  }

  if (setFooter) {
    messageEmbed.setFooter(setFooter);
  }

  if (setURL) {
    messageEmbed.setURL(setURL);
  }

  if (setTitle) {
    messageEmbed.setTitle(setTitle);
  }

  if (setColor) {
    messageEmbed.setColor(setColor);
  }

  if (addFields) {
    messageEmbed.addFields(...addFields);
  }

  return messageEmbed;
};
