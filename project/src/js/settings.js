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
    theme: {
      background: localstorageprop('settings.bgTheme', 'dark')
    }
  },
  gameSetup: {
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
