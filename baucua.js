const player = require('./Base/baucua/player');
const game = require('./Base/baucua/game');
const gameInfoGlobal = require('./Base/baucua/gameInfoGlobal');

const x1 = Math.ceil(Math.random() * 6);
const x2 = Math.ceil(Math.random() * 6);
const x3 = Math.ceil(Math.random() * 6);

// const x1 = 1;
// const x2 = 1;
// const x3 = 1;

gameGlobal = new gameInfoGlobal();

let player1 = new player(1);
let player2 = new player(2);
let player3 = new player(3);

player1.newGame();
let newGame = new game(player1.getID());
console.log(newGame);

gameGlobal.push(player1.getID());
console.log(gameGlobal);

player2.joinGame(player1.getID());
newGame.join(player2.getID());
console.log(newGame);

//leave: if host player leave is true, gameGlobal delete id ban
