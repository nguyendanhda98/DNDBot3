import { join, dirname } from 'path';
import { Low, JSONFile } from 'lowdb';
import { fileURLToPath } from 'url';
import lodash from 'lodash';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Use JSON file for storage
const file = join(__dirname, 'db.json');
const adapter = new JSONFile(file);
const db = new Low(adapter);

// Read data from JSON file, this will set db.data content
await db.read();

// If file.json doesn't exist, db.data will be null
// Set default data
// db.data = db.data || { posts: [] } // Node < v15.x
db.data ||= { posts: [] }; // Node >= 15.x

// Create and query items using plain JS
db.data.posts.push('hello world');
const firstPost = db.data.posts[0];

// Alternatively, you can also use this syntax if you prefer
const { posts } = db.data;
posts.push('hello world');

db.chain = lodash.chain(db.data);

// Finally write db.data content to file
// await db.write();

const post = db.chain.get('posts').filter({ name: 'hello4 world' }).value();

//console.log('Day la post ', post);
// console.log();
const users = [
  {
    name: 'Nguyễn Văn Thịnh',
  },
  {
    name: 'Nguyễn Danh Đa',
  },
  {
    name: 'Hoàng Ngọc Thắng',
  },
];

const indexes = [];

users.forEach((user, index) => {
  if (user.name.indexOf('Nguyễn') >= 0) {
    indexes.push(index);
  }
});
console.log(indexes);
console.log(users[0].name.indexOf('Văn'));
