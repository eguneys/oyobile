import isFunction from 'lodash/isFunction';
import m from 'mithril';

const stack = [];

export default function backbutton() {
  var b = stack.pop();
  if (isFunction(b)) {
    b('backbutton');
    m.redraw();
  } else {
    window.navigator.app.exitApp();
  }
  
};

backbutton.stack = stack;
