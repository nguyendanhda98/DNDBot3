const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('src/database.json')
const db = low(adapter)

db.defaults({ users: [] }).write() // đoạn này để set default trong file json ta có một mạng posts rỗng

module.exports = db
