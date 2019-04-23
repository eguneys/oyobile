import store from './storage';
import range from 'lodash/range';

function tupleOf(x) {
  return [x.toString(), x.toString()];
}

export default {
  general: {
    lang: store.prop('settings.lang', null),
    theme: {
      background: store.prop('settings.bgTheme', 'dark')
    }
  },
  game: {
    supportedVariants: ['standard', 'yuzbir', 'duzokey']
  },
  gameSetup: {
    availableRounds: [1, 5, 10, 15, 20, 25, 30].map(tupleOf),
    isRoundValid: function(gameSettings) {
      return gameSettings.rounds() !== '0';
    },
    human: {
      availableVariants: [
        ['101 Okey', '1'],
        ['Düz Okey', '3']
      ],
      variant: store.prop('settings.game.human.variant', '1'),
      rounds: store.prop('settings.game.human.rounds', '1'),
      mode: store.prop('settings.game.human.mode', '0'),
      membersOnly: store.prop('settings.game.human.membersOnly', false)
    }
  }
};
