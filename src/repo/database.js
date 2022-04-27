import { join, dirname } from 'path';
import { Low, JSONFile } from 'lowdb';
import { fileURLToPath } from 'url';
import lodash from 'lodash';

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, 'db.json');
const adapter = new JSONFile(file);
const db = new Low(adapter);

await db.read();
db.data ||= { users: [] };

db.users = lodash.chain(db.data.users);

const getData = () => {
  return db.data;
};

const create = async (obj) => {
  const { users } = db.data;
  users.push(obj);
  await db.write();
};

const findOne = (obj) => {
  return db.users.find(obj).value();
};

const updateUser = async (message, obj) => {
  if (!obj.cash) {
    obj.cash = 0;
  }
  if (!obj.bank) {
    obj.bank = 0;
  }

  findOne({ userID: message.author.id }).tag = message.author.tag;
  findOne({ userID: message.author.id }).userName = message.author.username;
  findOne({ userID: message.author.id }).userID = message.author.id;
  findOne({ userID: message.author.id }).serverID = message.guild.id;
  findOne({ userID: message.author.id }).cash += obj.cash;
  findOne({ userID: message.author.id }).bank += obj.bank;

  await db.write();
};

export { getData, create, findOne, updateUser };
