import Zanimo from 'zanimo';
import * as utils from '../../utils';
import redraw from '../../utils/redraw';
import ButtonHandler from './button';
import animator from './animator';
import m from 'mithril';

const animDuration = 250;

function createTapHandler(tapHandler, holdHandler, repeatHandler, scrollX, scrollY, getElement, preventEndDefault) {
  return function(vnode) {
    ButtonHandler(vnode.dom,
                  (e) => {
                    tapHandler(e);
                    redraw();
                  },
                  holdHandler ? (e) => utils.autoredraw(() => holdHandler(e)) : undefined,
                  repeatHandler,
                  scrollX,
                  scrollY,
                  getElement,
                  preventEndDefault);
  };
}

export function ontap(tapHandler, holdHandler, repeatHandler, getElement) {
  return createTapHandler(tapHandler, holdHandler, repeatHandler, false, false, getElement);
}

export function ontapXY(tapHandler, holdHandler, getElement, preventEndDefault = true) {
  return createTapHandler(tapHandler, holdHandler, undefined, true, true, getElement, preventEndDefault);
}

export function slidesInUp(vnode) {
  const el = vnode.dom;
  el.style.transform = 'translateY(100%)';
  vnode.state.lol = el.offsetHeight;
  return Zanimo(el, 'transform', 'translateY(0)', 250, 'ease-out')
    .catch(console.log.bind(console));
}

export function slidesOutDown(callback, elID) {
  return function(fromBB) {
    const el = document.getElementById(elID);
    return Zanimo(el, 'transform', 'translateY(100%)', 250, 'ease-out')
      .then(() => utils.autoredraw(() => callback(fromBB)))
      .catch(console.log.bind(console));
  };
}



// el fade in transition, can be applied to any element
export function elFadeIn(el, duration = animDuration, origOpacity = '0.5', endOpacity = '1') {
  let tId;

  el.style.opacity = origOpacity;
  el.style.transition = `opacity ${duration}ms ease-out`;

  setTimeout(() => {
    el.style.opacity = endOpacity;
  });

  function after() {
    clearTimeout(tId);
    if (el) {
      el.removeAttribute('style');
      el.removeEventListener('transitionend', after, false);
    }
  }

  el.addEventListener('transitionend', after, false);
  // in case transitionend does not fire
  tId = setTimeout(after, duration + 10);
}


export function getButton(e) {
  const target = e.target;
  return target.tagName === 'BUTTON' ? target : findParentBySelector(target, 'button');
}

// OLD

//store temporarily last route to disable animations on same route
// TODO find a better way cause this is ugly
let lastRoute;

// this must be cached because of the access to document.body.style
let cachedTransformProp;
let cachedViewportDim = null;

function viewSlideIn(el, callback) {
  if (m.route() === lastRoute) {
    callback();
    return;
  }

  lastRoute = m.route();

  function after() {
    utils.setViewSlideDirection('fwd');
    el.removeAttribute('style');
    callback();
  }

  const direction = utils.getViewSlideDirection() === 'fwd' ? '100%' : '-100%';
  el.style.transform = `translate3d(${direction},0,0)`;
  el.style.transition = 'transform 200ms ease-out';

  setTimeout(() => {
    el.style.transform= 'translate3d(0%,0,0)';
  });

  el.addEventListener('transitionend', after, false);
}

function viewSlideOut(el, callback) {
  if (m.route() === lastRoute) {
    callback();
    return;
  }

  function after() {
    utils.setViewSlideDirection('fwd');
    callback();
  }

  const direction = utils.getViewSlideDirection() === 'fwd' ? '-100%' : '100%';
  el.style.transform = 'translate3d(0%,0,0)';
  el.style.transition = 'transform 200ms ease-out';

  setTimeout(() => {
    el.style.transform= `translate3d(${direction},0,0)`;
  });

  el.addEventListener('transitionend', after, false);
}

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

export function viewportDim() {
  if (cachedViewportDim) return cachedViewportDim;

  let e = document.documentElement;
  let vpd = cachedViewportDim = {
    vw: e.clientWidth,
    vh: e.clientHeight
  };
  return vpd;
}

function collectionHas(coll, el) {
  for (let i = 0, len = coll.length; i < len; i++) {
    if (coll[i] === el) return true;
  }
  return false;
}

export function findParentBySelector(el, selector) {
  const matches = document.querySelectorAll(selector);
  let cur = el;
  while (cur && !collectionHas(matches, cur)) {
    cur = cur.parentNode;
  }
  return cur;
}

export function getLI(e) {
  const target = e.target;
  return target.tagName === 'LI' ? target : findParentBySelector(target, 'LI');
}

export function classSet(classes) {
  const arr = [];
  for (let i in classes) {
    if (classes[i]) arr.push(i);
  }
  return arr.join(' ');
}

// export default {
//   slidingPage: animator(viewSlideIn, viewSlideOut),
//   fadingPage: animator(viewFadesIn, viewFadesOut),
//   viewportDim,
//   clearCachedViewportDim() {
//     cachedViewportDim = null;
//   },

//   transformProp: function() {
//     if (!cachedTransformProp) cachedTransformProp = computeTransformProp();
//     return cachedTransformProp;
//   },

//   slidesInUp: function(el, isUpdate, context) {
//     if (!isUpdate) {
//       el.style.transform = 'translateY(100%)';
//       // force reflow back
//       context.lol = el.offsetHeight;
//       Zanimo(el, 'transform', 'translateY(0)', 250, 'ease-out')
//         .catch(console.log.bind(console));
//     }
//   },
//   slidesOutDown: function(callback, elID) {
//     return function() {
//       const el = document.getElementById(elID);
//       m.redraw.strategy('none');
//       return Zanimo(el, 'transform', 'translateY(100%)', 250, 'ease-out')
//         .then(utils.autoredraw.bind(null, callback))
//         .catch(callback);
//     };
//   },

//   fadesOut: function(callback, selector, time = 150) {
//     return function(e) {
//       e.stopPropagation();
//       var el = selector ? findParentBySelector(e.target, selector) : e.target;
//       m.redraw.strategy('none');
//       return Zanimo(el, 'opacity', 0, time)
//         .then(() => utils.autoredraw(callback))
//         .catch(console.log.bind(console));
//     };
//   },

//   ontouch: function(tapHandler, holdHandler, repeatHandler, touchEndFeedback = true) {
//     return ontouch(tapHandler, holdHandler, repeatHandler, false, false, touchEndFeedback);
//   },
//   ontouchX: function(tapHandler, holdHandler, touchEndFeedback = true) {
//     return ontouch(tapHandler, holdHandler, null, true, false, touchEndFeedback);
//   },
//   ontouchY: function(tapHandler, holdHandler, touchEndFeedback = true) {
//     return ontouch(tapHandler, holdHandler, null, false, true, touchEndFeedback);
//   },
//   classSet: function(classes) {
//     var arr = [];
//     for (var i in classes) {
//       if (classes[i]) arr.push(i);
//     }
//     return arr.join(' ');
//   },

//   isWideScreen: function() {
//     return viewportDim().vw >= 600;
//   },
//   isIpadLike: function() {
//     const { vh, vw } = viewportDim();
//     return vh >= 700 && vw <= 1050;
//   },
//   isPortrait: function() {
//     return window.matchMedia('(orientation: portrait)').matches;
//   },
//   isLandscape: function() {
//     return window.matchMedia('(orientation: landscape)').matches;
//   },
//   progress: function (p) {
//     if (p === 0) return null;
//     return m('span', {
//       className: 'progress ' + (p > 0 ? 'positive' : 'negative'),
//       'data-icon': p > 0 ? 'N' : 'M'
//     }, Math.abs(p));
//   }
// };
