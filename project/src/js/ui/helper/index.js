import Zanimo from 'zanimo';
import * as utils from '../../utils';
import ButtonHandler from './button';
import animator from './animator';
import m from 'mithril';

//store temporarily last route to disable animations on same route
// TODO find a better way cause this is ugly
let lastRoute;

// this must be cached because of the access to document.body.style
let cachedTransformProp;
let cachedViewportDim = null;

function viewFadesIn(el, callback) {
  var tId;

  el.style.opacity = '0.5';
  el.style.transition = 'opacity 200ms ease-out';

  setTimeout(()=> {
    el.style.opacity = '1';
  });

  function after() {
    clearTimeout(tId);
    if (el) {
      el.removeAttribute('style');
      el.removeEventListener('transitioned', after, false);
    }
    callback();
  }

  el.addEventListener('transitioned', after, false);

  // in case transitioned does not fire
  // TODO find a way to avoid it
  tId = setTimeout(after, 250);
}

function viewFadesOut(el, callback) {
  var tId;

  el.style.opacity = '1';
  el.style.transition = 'opacity 200ms ease-out, visibility 0s linear 200ms';

  setTimeout(()=> {
    el.style.opacity = '0';
    el.style.visibility = 'hidden';
  });

  function after() {
    clearTimeout(tId);
    callback();
  }

  el.addEventListener('transitioned', after, false);

  // in case transitioned does not fire
  // TODO find a way to avoid it
  tId = setTimeout(after, 250);
}

function collectionHas(coll, el) {
  for (var i = 0, len = coll.length; i < len; i++) {
    if (coll[i] === el) return true;
  }
  return false;
}

function findParentBySelector(el, selector) {
  var matches = document.querySelectorAll(selector);
  var cur = el.parentNode;
  while (cur && !collectionHas(matches, cur)) {
    cur = cur.parentNode;
  }
  return cur;
}

function ontouch(tapHandler, holdHandler, repeatHandler, scrollX, scrollY, touchEndFeedback) {
  return function(el, isUpdate) {
    if (!isUpdate) {
      ButtonHandler(el,
                    e => {
                      m.startComputation();
                      try {
                        tapHandler(e);
                      } finally {
                        m.endComputation();
                      }
                    },
                    holdHandler ? () => utils.autoredraw(holdHandler) : null,
                    repeatHandler,
                    scrollX,
                    scrollY,
                    touchEndFeedback
                   );
    }
  };
}

function computeTransformProp() {
  return 'transform' in document.body.style ?
    'transform' : 'webkitTransform' in document.body.style ?
    'webkitTransform' : 'mozTransform' in document.body.style ?
    'mozTransform' : 'oTransform' in document.body.style ?
    'oTransform' : 'msTransform';
}

function viewportDim() {
  if (cachedViewportDim) return cachedViewportDim;

  let e = document.documentElement;
  let vpd = cachedViewportDim = {
    vw: e.clientWidth,
    vh: e.clientHeight
  };
  return vpd;
}

export default {
  fadingPage: animator(viewFadesIn, viewFadesOut),
  viewportDim,
  clearCachedViewportDim() {
    cachedViewportDim = null;
  },

  transformProp: function() {
    if (!cachedTransformProp) cachedTransformProp = computeTransformProp();
    return cachedTransformProp;
  },

  fadesOut: function(callback, selector, time = 150) {
    return function(e) {
      e.stopPropagation();
      var el = selector ? findParentBySelector(e.target, selector) : e.target;
      m.redraw.strategy('none');
      return Zanimo(el, 'opacity', 0, time)
        .then(() => utils.autoredraw(callback))
        .catch(console.log.bind(console));
    };
  },

  ontouch: function(tapHandler, holdHandler, repeatHandler, touchEndFeedback = true) {
    return ontouch(tapHandler, holdHandler, repeatHandler, false, false, touchEndFeedback);
  },
  ontouchX: function(tapHandler, holdHandler, touchEndFeedback = true) {
    return ontouch(tapHandler, holdHandler, null, true, false, touchEndFeedback);
  },
  ontouchY: function(tapHandler, holdHandler, touchEndFeedback = true) {
    return ontouch(tapHandler, holdHandler, null, false, true, touchEndFeedback);
  },
  classSet: function(classes) {
    var arr = [];
    for (var i in classes) {
      if (classes[i]) arr.push(i);
    }
    return arr.join(' ');
  },
  isIpadLike: function() {
    const { vh, vw } = viewportDim();
    return vh >= 700 && vw <= 1050;
  },
  isPortrait: function() {
    return window.matchMedia('(orientation: portrait)').matches;
  },
  isLandscape: function() {
    return window.matchMedia('(orientation: landscape)').matches;
  }
};
