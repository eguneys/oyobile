import m from 'mithril';
import home from './ui/home';

const fadingPage = x => x;

export default {
  init() {
    m.route(document.body, '/', {
      '/': fadingPage(home)
    });
  }
}
