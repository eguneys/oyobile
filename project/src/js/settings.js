import store from './storage';
import range from 'lodash/range';

function localstorageprop(key, initialValue) {
  return function() {
    if (arguments.length) store.set(key, arguments[0]);
    var ret = store.get(key);
    return (ret !== null) ? ret : initialValue;
  };
}

function tupleOf(x) {
  return [x.toString(), x.toString()];
}

export default {
  general: {
    lang: localstorageprop('settings.lang'),
    theme: {
      background: localstorageprop('settings.bgTheme', 'dark')
    }
  },
  gameSetup: {
    availableRounds: [1, 5, 10, 15, 20, 25, 30].map(tupleOf),
    isRoundValid: function(gameSettings) {
      return gameSettings.rounds() !== '0';
    },
    human: {
      availableVariants: [
        ['101 Okey', '1'],
        ['Duz Okey', '2']
      ],
      variant: localstorageprop('settings.game.human.variant', '1'),
      rounds: localstorageprop('settings.game.human.rounds', '1'),
      mode: localstorageprop('settings.game.human.mode', '0'),
      membersOnly: localstorageprop('settings.game.human.membersOnly', false)
    }
  }
};
