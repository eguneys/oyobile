import helper from './ui/helper';
import home from './ui/home';
import masaDetail from './ui/masa/detail';

import m from 'mithril';

const fadingPage = helper.fadingPage;

export default {
  init() {
    m.route(document.body, '/', {
      '/': fadingPage(home),
      '/masa/:id': fadingPage(masaDetail)
    });
  }
}
