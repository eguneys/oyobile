import okeyground from 'okeyground-mobile';
import gameApi from '../../oyunkeyf/game';

function makeConfig(data, fen) {
  return {
    fen: fen,
    turnSide: data.game.player,
    povSide: data.player.side,
    movable: {
      free: false,
      board: gameApi.isPlayerPlaying(data),
      dests: gameApi.isPlayerPlaying(data) ? data.possibleMoves : []
    }
  };
}

function make(data, fen, userMove, onMove) {
  var config = makeConfig(data, fen);
  config.movable.events = {
    after: userMove
  };
  config.events = {
    move: onMove
  };
  return new okeyground.controller(config);
}

function end(ground) {
  ground.stop();
}

export default {
  make,
  end
};
