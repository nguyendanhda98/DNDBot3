import _ from 'lodash';
import { updateUser } from '../../repo/database.js';
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
  _.find(findPlayer(userID).bets, { name: betObj.name }).amount = betObj.amount;
};
const check = (hostID) => {
  getPlayer(hostID).forEach((player) => {
    console.log(player.bets);
  });

  // console.log(findGame(hostID).members.bets);
};
const start = async (hostID) => {
  const x1 = Math.ceil(Math.random() * 6);
  const x2 = Math.ceil(Math.random() * 6);
  const x3 = Math.ceil(Math.random() * 6);

  getPlayer(hostID).forEach((mem) => {
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
    await updateUser(message.author, { cash: mem.winAmount });
  });

  return [x1, x2, x3];
};

const getPlayer = (hostID) => {
  return findGame(hostID).members;
};

const leave = (userID) => {
  if (findGame(userID)) {
    _.remove(gameTotal, { hostID: userID });
    _.remove(playerTotal, { playing: userID });
    return true;
  } else if (findPlayer(userID)) {
    _.remove(playerTotal, { id: userID });
    return true;
  } else return false;
};

const resetBet = (hostID) => {
  getPlayer(hostID).forEach((player) => {
    player.bets = [
      { name: 'bau', amount: 0 },
      { name: 'cua', amount: 0 },
      { name: 'tom', amount: 0 },
      { name: 'ca', amount: 0 },
      { name: 'nai', amount: 0 },
      { name: 'ga', amount: 0 },
    ];
  });
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
  leave,
  resetBet,
};
