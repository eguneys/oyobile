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

menu.close = function(fromBB) {
  if (fromBB !== 'backbutton' && menu.isOpen) backbutton.stack.pop();
  m.redraw.strategy('none');
  return Zanimo(
    document.getElementById('side_menu'),
    'transform',
    'translate3d(-100%,0,0', 250, 'ease-out'
  ).then(() => {
    menu.headerOpen(false);
    menu.isOpen = false;
    m.redraw();
  })
    .catch(console.error.bind(console));
};

export default menu;
