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

const updateUser = async (userID, obj) => {
  Object.keys(obj).forEach((currentItem) => {
    switch (currentItem) {
      case 'cash':
        db.users.find({ userID: userID }).value().cash += obj.cash;
        break;
      case 'bank':
        db.users.find({ userID: userID }).value().bank += obj.bank;
        break;
      default:
        break;
    }
  });

  await db.write();
};

export { getData, create, findOne, updateUser };
