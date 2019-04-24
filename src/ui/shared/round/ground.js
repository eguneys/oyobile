import gameApi from '../../../oyunkeyf/game';
import Okeyground from 'okeyground-mobile';

function makeConfig(data) {
  const fen = data.game.fen;

  return {
    fen,
    turnSide: data.game.player,
    povSide: data.player.side,
    spectator: data.player.spectator,
    withTore: !!data.game.variant.key.match(/duzokey/),
    movable: {
      free: false,
      board: gameApi.isPlayerPlaying(data),
      dests: gameApi.isPlayerPlaying(data) ? data.possibleMoves : []
    }
  };
}

function make(data, userMove, onMove) {
  const config = makeConfig(data);
  config.movable.events = {
    after: userMove
  };
  config.events = {
    move: onMove
  };
  
  return new Okeyground(config);
}

function end(ground) {
  ground.stop();
}

export default {
  make,
  end
};
