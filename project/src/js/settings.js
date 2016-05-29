import store from './storage';

function localstorageprop(key, initialValue) {
  return function() {
    if (arguments.length) store.set(key, arguments[0]);
    var ret = store.get(key);
    return (ret !== null) ? ret : initialValue;
  };
}

export default {
  general: {
    theme: {
      background: localstorageprop('settings.bgTheme', 'dark')
    }
  }
};
