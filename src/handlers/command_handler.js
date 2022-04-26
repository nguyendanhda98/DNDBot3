import { readdirSync } from 'fs';

export default function (client, Discord) {
  const command_files = readdirSync('./src/commands/').filter((file) =>
    file.endsWith('.js')
  );

  for (const file of command_files) {
    import(`../commands/${file}`).then((command) => {
      if (command.name) {
        client.commands.set(command.name, command);
      }
    });
  }
}
