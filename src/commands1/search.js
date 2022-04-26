import { findOneAndUpdate } from '../models/profileSchema.js';

export const name = "search";
export const aliases = [];
export const permissions = [];
export const description = "Search for some coin!";
export async function execute(message, args, cmd, client, discord, profileData) {
  const locations = [
    "car",
    "bathroom",
    "park",
    "truck",
    "pocket",
    "computer",
  ];

  const chosenLocations = locations
    .sort(() => Math.random() - Math.random())
    .slice(0, 3);

  const filter = ({ author, content }) => message.author == author &&
    chosenLocations.some(
      (location) => location.toLowerCase() == content.toLowerCase()
    );

  const collector = message.channel.createMessageCollector(filter, {
    max: 1,
    time: 25000,
  });

  const earnings = Math.floor(Math.random() * (1000 - 100 + 1)) + 100;

  collector.on("collect", async (m) => {
    message.channel.send(`You found ${earnings} coins!`);

    await findOneAndUpdate(
      {
        userID: message.author.id,
      },
      {
        $inc: {
          cash: earnings,
        },
      }
    );
  });

  collector.on("end", (collected, reason) => {
    if (reason == "time") {
      message.channel.send("You ran out of time!");
    }
  });

  message.channel.send(
    `<@${message.author.id}> Which location would you like to search?\n Type the location in this channel\n \`${chosenLocations.join(
      "` `"
    )}\``
  );
}
