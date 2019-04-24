import Rlite from 'rlite-router';
import * as RenderService from 'mithril/render';
import isFunction from 'lodash/isFunction';
import Vnode from 'mithril/render/vnode';
import signals from './signals';
import redraw from './utils/redraw';

const router = new Rlite();

let currentStateId = 0;
let viewSlideDirection = 'fwd';

let previousPath = '/';

const uid = (function() {
  let id = 0;
  return () => id++;
})();

const backbutton = (() => {
  const x = () => {

    const b = (x.stack.length === 0) ?null:x.stack.pop();

    if (isFunction(b)) {
      b('backbutton');
      redraw();
    } else if (!/^\/$/.test(get())) {
      backHistory();
    } else {
      window.navigator.app.exitApp();
    }
    
  };

  x.stack = [];
  
  return x;
})();

export function defineRoutes(mountPoint, routes) {

  for (let route in routes) {
    const component = routes[route];
    router.add(route, function onRouteMatch({ params }) {
      const RouteComponent = { view() {
        var node = Vnode(component, undefined, params);
        return node;
      }};

      function redraw() {
        RenderService.render(mountPoint, Vnode(RouteComponent));
      }

      signals.redraw.removeAll();
      signals.redraw.add(redraw);
      try {
        redraw();
      } catch (e) {
        signals.redraw.removeAll();
        throw e;
      }
    });
  }
  window.addEventListener('popstate', processQuerystring);
  processQuerystring();
}

function processQuerystring(e) {
  if (e && e.state) {
    if (e.state.id < currentStateId) {
      viewSlideDirection = 'bwd';
    } else {
      viewSlideDirection = 'fwd';
    }
    currentStateId = e.state.id;
  }
  previousPath = get();
  const qs = window.location.search || '?=';
  const matched = router.run(qs.slice(2));
  if (!matched) router.run('/');
}

function assignState(state, path) {
  try {
    const newState = state ?
            Object.assign({}, window.history.state, state) :
          window.history.state;

    if (path !== undefined) {
      window.history.replaceState(newState, '', '?=' + path);
    } else {
      window.history.replaceState(newState, '');
    }
  } catch(e) { console.error(e); }
}

function replacePath(path) {
  assignState(undefined, path);
}

function doSet(path, replace = false) {
  backbutton.stack = [];
  previousPath = get();
  if (replace) {
    replacePath(path);
  } else {
    const stateId = uid();
    currentStateId = stateId;
    viewSlideDirection = 'fwd';
    try {
      window.history.pushState({ id: stateId }, '', '?=' + path);
    } catch (e) { console.error(e); }
  }
  const matched = router.run(path);
  if (!matched) router.run('/');
}

function set(path, replace = false) {
  setTimeout(() => doSet(path, replace), 0);
}

function get() {
  const path = window.location.search || '?=/';
  return decodeURIComponent(path.substring(2));
}

function backHistory() {
  window.history.go(-1);
}

export default {
  get,
  set,
  backbutton,
  backHistory
};
