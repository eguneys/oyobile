import h from 'mithril/hyperscript';

export default {
  view({ attrs }) {

    const title = 'gameApi.title(data)';

    return h('div.main_header_title', {
    }, [
      h('h1.header-gameTitle', [
        h('span', title)
      ])
    ]);
  }
};
