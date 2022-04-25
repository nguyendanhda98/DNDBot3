const player = require('./Base/baucua/player');
const game = require('./Base/baucua/game');
const gameInfoGlobal = require('./Base/baucua/gameInfoGlobal');

// const x1 = 1;
// const x2 = 1;
// const x3 = 1;

gameGlobal = new gameInfoGlobal();

let player1 = new player(1);
let player2 = new player(2);
let player3 = new player(3);

player1.newGame();
let newGame = new game(player1.getID());

gameGlobal.push(player1.getID());

player2.joinGame(player1.getID());
newGame.join(player2);
player2.bet([
  { name: 1, amount: 1 },
  { name: 2, amount: 1 },
  { name: 3, amount: 1 },
]);

player3.joinGame(player1.getID());
newGame.join(player3);
player3.bet([
  { name: 4, amount: 1 },
  { name: 5, amount: 1 },
  { name: 6, amount: 1 },
]);

newGame.start();

//leave: if host player leave is true, gameGlobal delete id ban
