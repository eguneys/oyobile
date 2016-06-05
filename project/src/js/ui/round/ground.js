import okeyground from 'okeyground-mobile';

function makeConfig(data, fen) {
  return {
    fen: fen,
    movable: {
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
