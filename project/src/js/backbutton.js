import isFunction from 'lodash/isFunction';
import { backHistory } from './utils';
import m from 'mithril';

const stack = [];

export default function backbutton() {
  var b = stack.pop();
  if (isFunction(b)) {
    b('backbutton');
    m.redraw();
  } else if (!/^\/$/.test(m.route())) {
    backHistory();
  }else {
    window.navigator.app.exitApp();
  }
  
};

backbutton.stack = stack;
