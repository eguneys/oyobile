import helper from './ui/helper';
import home from './ui/home';
import game from './ui/game';
import masaDetail from './ui/masa/detail';
import masa from './ui/masa';

import m from 'mithril';

const fadingPage = helper.fadingPage;

export default {
  init() {
    m.route(document.body, '/', {
      '/': fadingPage(home),
      '/game/:id': game,
      '/masa': fadingPage(masa),
      '/masa/:id': fadingPage(masaDetail),
      '/masa/:masaId/game/:id': fadingPage(game)
    });
  }
};
