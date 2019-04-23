import h from 'mithril/hyperscript';

export default {
  oninit() {
  },
  view({ attrs, children }) {
    const { header } = attrs;

    return h('main#page', {}, [
      // h('header.main_header.board', header),
      h('div.content_round', children)
    ]);

  }

};
