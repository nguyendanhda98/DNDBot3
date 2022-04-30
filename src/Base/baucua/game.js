import _ from 'lodash';
import { updateMoney } from '../../repo/database.js';
import { bcEmojis } from '../../util/constant.js';
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
  findPlayer(userID).bet = true;
};
const check = (hostID) => {
  getPlayer(hostID).forEach((player) => {
    console.log(player.bets);
  });

  // console.log(findGame(hostID).members.bets);
};
const start = async (hostID) => {
  let x1 = Math.ceil(Math.random() * 6);
  let x2 = Math.ceil(Math.random() * 6);
  let x3 = Math.ceil(Math.random() * 6);

  // let x1 = 2;
  // let x2 = 2;
  // let x3 = 2;

  let arrNumber = [x1, x2, x3];

  arrNumber.forEach((num, index) => {
    switch (num) {
      case 1:
        arrNumber[index] = 'bau';
        break;
      case 2:
        arrNumber[index] = 'cua';
        break;
      case 3:
        arrNumber[index] = 'tom';
        break;
      case 4:
        arrNumber[index] = 'ca';
        break;
      case 5:
        arrNumber[index] = 'nai';
        break;
      case 6:
        arrNumber[index] = 'ga';
        break;
    }
  });
  let hostWinAmount = 0;
  getPlayer(hostID).forEach(async (mem) => {
    mem.bets.forEach((bet) => {
      let flag = false;
      if (bet.name == arrNumber[0]) {
        mem.winAmount += bet.amount;
        flag = true;
      }
      if (bet.name == arrNumber[1]) {
        mem.winAmount += bet.amount;
        flag = true;
      }
      if (bet.name == arrNumber[2]) {
        mem.winAmount += bet.amount;
        flag = true;
      }
      if (!flag) {
        mem.winAmount -= bet.amount;
      }
    });
    hostWinAmount -= mem.winAmount;
    await updateMoney(mem.id, { cash: mem.winAmount });
  });
  await updateMoney(hostID, { cash: hostWinAmount });

  arrNumber.forEach((num, index) => {
    switch (num) {
      case 'bau':
        arrNumber[index] = bcEmojis.bau;
        break;
      case 'cua':
        arrNumber[index] = bcEmojis.cua;
        break;
      case 'tom':
        arrNumber[index] = bcEmojis.tom;
        break;
      case 'ca':
        arrNumber[index] = bcEmojis.ca;
        break;
      case 'nai':
        arrNumber[index] = bcEmojis.nai;
        break;
      case 'ga':
        arrNumber[index] = bcEmojis.ga;
        break;
    }
  });

  return arrNumber;
};

const getPlayer = (hostID) => {
  return findGame(hostID).members;
};

const leave = (userID) => {
  if (findGame(userID)) {
    _.remove(gameTotal, { hostID: userID });
    _.remove(playerTotal, { playing: userID });
    return true;
  }
  if (findPlayer(userID)) {
    let hostID = findPlayer(userID).playing;
    _.remove(playerTotal, { id: userID });
    _.remove(getPlayer(hostID), { id: userID });
    return true;
  }
  return false;
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
    player.winAmount = 0;
    player.bet = false;
  });
};

const checkBet = (hostID) => {
  let waiting = [];
  getPlayer(hostID).forEach((player) => {
    if (!player.bet) {
      waiting.push(player);
    }
  });
  return waiting;
};

const countPlayer = (userID) => {
  if (findPlayer(userID)) {
    let hostID = findPlayer(userID).playing;
    return getPlayer(hostID);
  } else if (findGame(userID)) {
    return getPlayer(userID);
  } else return false;
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
  checkBet,
  countPlayer,
};
