import Rlite from 'rlite-router';
import * as RenderService from 'mithril/render';
import Vnode from 'mithril/render/vnode';
import signals from './signals';
import redraw from './utils/redraw';

const router = new Rlite();

let currentStateId = 0;
let viewSlideDirection = 'fwd';

let previousPath = '/';

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
        return Vnode(component, undefined, params);
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

function get() {
  const path = window.location.search || '?=/';
  return decodeURIComponent(path.substring(2));
}

function backHistory() {
  window.history.go(-1);
}

export default {
  backbutton
};
