function withStorage(f) {
  // can throw an exception if storage is full
  try {
    return !!window.localStorage ? f(window.localStorage) : null;
  } catch (e) {}
}

function get(k) {
  return withStorage(function(s) {
    return JSON.parse(s.getItem(k));
  });
}
function remove(k) {
  return withStorage(function(s) {
    s.removeItem(k);
  });
}
function set(k, v) {
  return withStorage(function(s) {
    s.removeItem(k);
    s.setItem(k, JSON.stringify(v));
  });
}

function prop(key, initialValue) {
  return function() {
    if (arguments.length) set(key, arguments[0]);
    const ret = get(key);
    return (ret !== null && ret !== undefined) ? ret : initialValue;
  };
}

export default {
  get,
  set,
  remove,
  prop
};
