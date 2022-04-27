import _ from 'lodash';
let gameTotal = [];

const pushGame = (game) => {
  gameTotal.push(game);
};

const joinGame = (hostID, member) => {
  _.find(gameTotal, { host: hostID });
};

export { pushGame, joinGame };
