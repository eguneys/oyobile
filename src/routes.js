import home from './ui/home';
import game from './ui/game';
import user from './ui/user';
import players from './ui/players';
import masaDetail from './ui/masa/detail';
import masa from './ui/masa';
import settingsUi from './ui/settings';
import settingsLang from './ui/settings/lang';
import { defineRoutes } from './router';

export default {
  init() {
    defineRoutes(document.body, {
      '': home,
      '/@/:id': user,
      '/players': players,
      '/game/:id': game,
      '/masa': masa,
      '/masa/:id': masaDetail,
      '/masa/:masaId/game/:id': game,
      '/settings': settingsUi,
      '/settings/lang': settingsLang,
    });
  }
};
