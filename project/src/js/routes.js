import helper from './ui/helper';
import home from './ui/home';
import game from './ui/game';
import user from './ui/user';
import masaDetail from './ui/masa/detail';
import masa from './ui/masa';

import m from 'mithril';

const slidingPage = helper.slidingPage;
const fadingPage = helper.fadingPage;

export default {
  init() {
    m.route(document.body, '/', {
      '/': fadingPage(home),
      '/@/:id': slidingPage(user),
      '/game/:id': game,
      '/masa': fadingPage(masa),
      '/masa/:id': fadingPage(masaDetail),
      '/masa/:masaId/game/:id': fadingPage(game)
    });
  }
};
