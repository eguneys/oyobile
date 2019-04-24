import h from 'mithril/hyperscript';
import * as menu from './menu';
import MenuView from './menu/menuView';
import MainBoard from './shared/layout/MainBoard';
import gamesMenu from './gamesMenu';
import newGameForm from './newGameForm';
import loginModal from './loginModal';
import signupModal from './signupModal';
import helper from './helper';
import settings from '../settings';

var background;

export default {

  board: function(header, content, overlay) {
    background = background;

    return h('div.view-container', { className: bgClass(background) }, [
      h(MainBoard, { header }, content),
      // h(MenuView),
      overlay
    ]);
  },


  free: function(header, content, footer, overlay) {
    background = background || settings.general.theme.background();
    
    return (
      h('div.view-container', { className: bgClass(background) }, [
        h('main#page', { oncreate: handleMenuOpen }, [
          h('header.main_header', header),
          h('div#free_content.content.native_scroller', content),
          footer ? h('footer.main_footer', footer) : null,
          h('div#menu-close-overlay.menu-backdrop', { oncreate: menu.backdropCloseHandler })
        ]),
        h(MenuView),
        loginModal.view(),
        signupModal.view(),
        newGameForm.view(),
        overlay
      ])
    );
  }
}

function handleMenuOpen() {
}

function bgClass(bgTheme) {
  return bgTheme === 'dark' || bgTheme === 'light' ? bgTheme : 'transp ' + bgTheme;
}
