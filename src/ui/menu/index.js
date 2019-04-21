import stream from 'mithril/stream';
import Zanimo from 'zanimo';
import backbutton from '../../backbutton';
import m from 'mithril';
import SideMenuCtrl from '../shared/sideMenu/SideMenuCtrl';
import { ontap } from '../helper';


export const profileMenuOpen = stream(false);

function onMenuOpen() {
}

function onMenuClose() {
}


export const mainMenuCtrl = new SideMenuCtrl(
  'left',
  'side_menu',
  'menu-close-overlay',
  onMenuOpen,
  onMenuClose
);


export function route(route) {
  return function() {
    return mainMenuCtrl.close().then(() => router.set(route));
  }
}

export const backdropCloseHandler = ontap(() => {
  mainMenuCtrl.close();
});

const menu = {};

/* properties */
menu.isOpen = false;
// menu.headerOpen = m.prop(false);

menu.route = function(route) {
  return function() {
    return menu.close().then(m.route.bind(null, route));
  };
};

menu.popup = function(action) {
  return function() {
    return menu.close().then(() => {
      action();
      m.redraw();
    });
  };
};

menu.toggle = function() {
  if (menu.isOpen) menu.close();
  else menu.open();
};

menu.open = function() {
  backbutton.stack.push(menu.close);
  menu.isOpen = true;
};

menu.willClose = false;
menu.close = function(fromBB) {
  const sideMenu = document.getElementById('side_menu');

  if (menu.willClose || !sideMenu) return Promise.resolve(null);

  menu.willClose = true;
  if (fromBB !== 'backbutton' && menu.isOpen) backbutton.stack.pop();
  m.redraw.strategy('none');
  return Zanimo(
    sideMenu,
    'transform',
    'translate3d(-100%,0,0', 250, 'ease-out'
  ).then(() => {
    menu.headerOpen(false);
    menu.isOpen = false;
    menu.willClose = false;
    m.redraw();
  })
    .catch((err) => {
      console.error(err);
      menu.headerOpen(false);
      menu.isOpen = false;
      menu.willClose = false;
      m.redraw();
    });
};

menu.toggleHeader = function() {
  return menu.headerOpen() ? menu.headerOpen(false) : menu.headerOpen(true);
};

export default menu;
