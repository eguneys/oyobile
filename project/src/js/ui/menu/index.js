import Zanimo from 'zanimo';
import backbutton from '../../backbutton';
import m from 'mithril';

const menu = {};

/* properties */
menu.isOpen = false;
menu.headerOpen = m.prop(false);

menu.route = function(route) {
  return function() {
    return menu.close().then(m.route.bind(null, route));
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

  if (menu.willClose || !sideMenu) return null;

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

export default menu;
