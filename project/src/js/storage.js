function withStorage(f) {
  // can throw an exception if storage is full
  try {
    return !!window.localStorage ? f(window.localStorage) : null;
  } catch (e) {}
}

export default {

  get: function(k) {
    return withStorage(function(s) {
      return JSON.parse(s.getItem(k));
    });
  },
  remove: function(k) {
    return withStorage(function(s) {
      s.removeItem(k);
    });
  },
  set: function(k, v) {
    return withStorage(function(s) {
      s.removeItem(k);
      s.setItem(k, JSON.stringify(v));
    });
  }
};
