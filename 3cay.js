const GameTable = require('./Base/bc/GameTable')
const GameTableManagement = require('./Base/bc/GameTableManagement')
const gameTableManagement = GameTableManagement.getInstance()

const host = { id: 'host', username: 'host' }
const user1 = { id: 1, username: 'Da1' }
const user2 = { id: 2, username: 'Da2' }
const user3 = { id: 3, username: 'Da3' }
const user4 = { id: 4, username: 'Da4' }
const user5 = { id: 5, username: 'Da5' }

gameTableManagement.addGameTable(host, new GameTable(host, 6))
gameTableManagement.addPlayerInTable(host, host)

console.log(gameTableManagement.getTableGame(host).join(user1))
gameTableManagement.addPlayerInTable(user1, host)
///////////////////////////////////////

console.log(gameTableManagement.getTableGame(host).start(host))

console.log(gameTableManagement.getTableJoined(user1).bet(user1, 11))

console.log(gameTableManagement.getTableGame(host).distributeCards(host))
console.log(gameTableManagement.getTableGame(host).checkWinners(host))
// console.log(gameTableManagement.getTableGame(host).players)

cardEmojis = {
    '1c': '823473924',
}
