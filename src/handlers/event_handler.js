import { readdirSync } from 'fs';

export default function (client, Discord) {
  const load_dir = (dirs) => {
    const event_files = readdirSync(`./src/events/${dirs}`).filter((file) =>
      file.endsWith('.js')
    );

    for (const file of event_files) {
      import(`../events/${dirs}/${file}`).then((event) => {
        const event_name = file.split('.')[0];
        client.on(event_name, event.default.bind(null, Discord, client));
      });
    }
  };

  ['client', 'guild'].forEach((e) => load_dir(e));
}
