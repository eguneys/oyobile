import helper from './ui/helper';
import home from './ui/home';
import game from './ui/game';
import user from './ui/user';
import players from './ui/players';
import masaDetail from './ui/masa/detail';
import masa from './ui/masa';
import settingsUi from './ui/settings';
import settingsLang from './ui/settings/lang';

import m from 'mithril';

const slidingPage = helper.slidingPage;
const fadingPage = helper.fadingPage;

export default {
  init() {
    m.route(document.body, '/', {
      '/': fadingPage(home),
      '/@/:id': slidingPage(user),
      '/players': fadingPage(players),
      '/game/:id': game,
      '/masa': fadingPage(masa),
      '/masa/:id': fadingPage(masaDetail),
      '/masa/:masaId/game/:id': fadingPage(game),
      '/settings': slidingPage(settingsUi),
      '/settings/lang': slidingPage(settingsLang),
    });
  }
};
