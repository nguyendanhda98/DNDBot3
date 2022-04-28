import _ from 'lodash';
let gameTotal = [];
let playerTotal = [];

class game {
  constructor(hostID, maxPlayer = false, status = 'pending') {
    this.hostID = hostID;
    this.maxPlayer = maxPlayer;
    this.members = [];
    this.status = status;
  }
}

const pushGame = (newGame) => {
  gameTotal.push(newGame);
};

const joinGame = (member) => {
  findGame(member.playing).members.push(member);
  playerTotal.push(member);
};
const ready = (hostID) => {
  findGame(hostID).status = 'ready';
};

const findGame = (hostID) => {
  return _.find(gameTotal, { hostID: hostID });
};

const findPlayer = (userID) => {
  return _.find(playerTotal, { id: userID });
};

const bet = (userID, betObj) => {
  // _.set(
  //   _.find(findPlayer(userID).bets, { name: betObj.name }),
  //   [betObj.amount],
  //   betObj.amount
  // );
  _.find(findPlayer(userID).bets, { name: betObj.name }).amount = betObj.amount;

  console.log(findPlayer(userID).bets);

  // console.log(findPlayer(userID).bets);
  // findPlayer(userID).bets[betObj.name].amount = betObj.amount;
};
const check = (hostID) => {
  console.log(findGame(hostID).members.bets);
};
const start = (hostID) => {
  const x1 = Math.ceil(Math.random() * 6);
  const x2 = Math.ceil(Math.random() * 6);
  const x3 = Math.ceil(Math.random() * 6);

  findGame(hostID).members.forEach((mem) => {
    mem.bets.forEach((bet) => {
      let flag = false;
      if (bet.name == x1) {
        mem.winAmount += bet.amount;
        flag = true;
      }
      if (bet.name == x2) {
        mem.winAmount += bet.amount;
        flag = true;
      }
      if (bet.name == x3) {
        mem.winAmount += bet.amount;
        flag = true;
      }
      if (!flag) {
        mem.winAmount -= bet.amount;
      }
    });
  });

  return [x1, x2, x3];
};

const getPlayer = (hostID) => {
  console.log(_.find(gameTotal, { hostID: hostID }).members);
};

export {
  game,
  pushGame,
  joinGame,
  ready,
  bet,
  check,
  start,
  getPlayer,
  findGame,
  findPlayer,
};
