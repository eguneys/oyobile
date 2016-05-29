import * as utils from '../../utils';
import ButtonHandler from './button';
import animator from './animator';
import m from 'mithril';

//store temporarily last route to disable animations on same route
// TODO find a better way cause this is ugly
let lastRoute;

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

export default {
  fadingPage: animator(viewFadesIn, viewFadesOut),
  ontouch: function(tapHandler, holdHandler, repeatHandler, touchEndFeedback = true) {
    return ontouch(tapHandler, holdHandler, repeatHandler, false, false, touchEndFeedback);
  }
}
