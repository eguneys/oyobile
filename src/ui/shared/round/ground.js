import Okeyground from 'okeyground-mobile';

function makeConfig(data, fen) {
  return {
    fen,
    turnSide: data.game.player
  };
}

function make(data, fen) {
  const config = makeConfig(data, fen);
  
  return new Okeyground(config);
}

export default {
 make 
};
