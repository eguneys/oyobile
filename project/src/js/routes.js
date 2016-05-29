import helper from './ui/helper';
import home from './ui/home';
import otb from './ui/otb';
import m from 'mithril';

const fadingPage = helper.fadingPage;

export default {
  init() {
    m.route(document.body, '/', {
      '/': fadingPage(home),
      '/otb': otb
    });
  }
}
