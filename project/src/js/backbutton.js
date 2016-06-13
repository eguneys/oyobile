import isFunction from 'lodash/isFunction';
import i18n from './i18n';
import { backHistory } from './utils';
import m from 'mithril';

const stack = [];

export default function backbutton() {
  var b = stack.pop();
  if (isFunction(b)) {
    b('backbutton');
    m.redraw();
  } else if (!/^\/$/.test(m.route())) {
    // if playing a game as anon ask for confirmation
    if (/^\/game\/[a-zA-Z0-9]{12}/.test(m.route())) {
      navigator.notification.confirm(
        i18n('thereIsAGameInProgress'),
        i => { if (i===1) backHistory(); }
      );
    } else {
      backHistory();
    }
  }else {
    window.navigator.app.exitApp();
  }
};

backbutton.stack = stack;
