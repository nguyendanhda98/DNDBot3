const GameTable = require('./Base/bc/GameTable')

const host = { id: 'host', username: 'host' }
const user1 = { id: 1, username: 'Da1' }
const user2 = { id: 2, username: 'Da2' }
const user3 = { id: 3, username: 'Da3' }
const user4 = { id: 4, username: 'Da4' }
const user5 = { id: 5, username: 'Da5' }
const game = new GameTable(host, 6)
console.log(game.join(user1))
console.log(game.join(user2))
console.log(game.join(user3))
console.log(game.join(user4))

console.log(game.start(host))
console.log(game.join(user5))
console.log(game.bet(user1, 11))
console.log(game.bet(user2, 2))
console.log(game.bet(user3, 3))
console.log(game.bet(user4, 4))
console.log(game.bet(user5, 5))

console.log(game.distributeCards(host))
console.log(game.checkWinner(host))
// setTimeout(() => {
//     console.log(game.players)
// }, 100)
