import i18n from '../i18n';
import status from './status';

function playable(data) {
  return data.game.status.id < status.ids.aborted;
}

function isPlayerPlaying(data) {
  return playable(data) && !data.player.spectator;
}

function isPlayerTurn(data) {
  return isPlayerPlaying(data) && data.game.player === data.player.side;
}

function getPlayer(data, side) {
  return ['player', 'opponentLeft', 'opponentRight', 'opponentUp']
    .map(k => data[k])
    .filter(player => player.side === side)[0];
}

const sides = ["east", "north", "west", "south"];

function sideByPly(ply) {
  return sides[ply % 4];
}

function setOnGame(data, side, onGame) {
  var player = getPlayer(data, side);
  player.onGame = onGame;
}

function title(data) {
  var text;
  if (isPlayerTurn(data)) {
    text = i18n('yourTurn');
  } else {
    text = i18n('waitingForOpponent');
  }
  // const variant = getVariant(data.game.variant.key);
  // const name = variant ? (variant.shortName || variant.name) : '';
  return text;
}

module.exports = {
  isPlayerPlaying: isPlayerPlaying,
  isPlayerTurn: isPlayerTurn,
  getPlayer: getPlayer,
  sideByPly: sideByPly,
  playable: playable,
  setOnGame: setOnGame,
  title: title
};