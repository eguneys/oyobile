import i18n from '../i18n';
import m from 'mithril';

export function noop() {}

export const oyunkeyfSri = Math.random().toString(36).substring(2);

export function tellWorker(worker, topic, payload) {
  if (payload !== undefined) {
    worker.postMessage({ topic, payload });
  } else {
    worker.postMessage({ topic });
  }
}

export function askWorker(worker, msg, callback) {
  return new Promise(function(resolve) {
    function listen(e) {
      if (e.data.topic === msg.topic) {
        worker.removeEventListener('message', listen);
        if (callback) {
          callback(e.data.payload);
        } else {
          resolve(e.data.payload);
        }
      }
    }
    worker.addEventListener('message', listen);
    worker.postMessage(msg);
  });
}


export function hasNetwork() {
  return window.navigator.connection.type !== window.Connection.NONE;
}

export function handleXhrError(error) {
  var {response: data, status} = error;
  if (!hasNetwork()) {
    window.plugins.toast.show(i18n('noInternetConnection'), 'short', 'center');
  } else {
    let message;
    if (!status || status === 0) {
      message = 'oyunkeyfIsUnreachable';
    } else if (status === 401) {
      message = 'unauthorizedError';
    } else if (status === 404) {
      message = 'resourceNotFoundError';
    } else if (status === 503) {
      message = 'oyunkeyfIsUnavailableError';
    } else if (status >= 500) {
      message = 'serverError';
    } else {
      message = 'Error.';
    }

    message = i18n(message);

    if (typeof data === 'string') {
      message += ` ${data}`;
    } else if (data.global && data.global.constructor === Array) {
      message += ` ${data.global[0]}`;
    } else if (typeof data.error === 'string') {
      message += ` ${data.error}`;
    }

    window.plugins.toast.show(message, 'short', 'center');
  }
}

function partialApply(fn, args) {
  return fn.bind.apply(fn, [null].concat(args));
}

export function partialf() {
  return partialApply(arguments[0], Array.prototype.slice.call(arguments, 1));
}

export function f() {
  var args = arguments,
      fn = arguments[0];
  return function() {
    fn.apply(fn, Array.prototype.slice.call(args, 1));
  };
}

export function playerName(player, withRating) {
  if (player.username || player.user) {
    var name = player.username || player.user.username;
    return name;
  }
  if (player.ai) {
    return aiName(player.ai);
  }

  if (player.side) {
    return i18n(player.side);
  }

  return i18n('anonymous');
}

export function aiName(level) {
  return i18n('aiBot', level);
}

export function backHistory() {
  setViewSlideDirection('bwd');
  if (window.navigator.app && window.navigator.app.backHistory) {
    window.navigator.app.backHistory();
  }
  else
    window.history.go(-1);
}

// simple way to determine views animation direction
var viewSlideDirection = 'fwd';
export function setViewSlideDirection(d) {
  viewSlideDirection = d;
}
export function getViewSlideDirection() {
  return viewSlideDirection;
}


export function getBoardBounds(viewportDim, isPortrait, isIpadLike, mode) {
  const { vh, vw } = viewportDim;
  const top = 50;

  if (isPortrait) {
    // const contentHeight = vh - 50;
    // const pTop = 50 + (mode === 'game' ? ((contentHeight - vw - 40) / 2) : 0);
    const contentHeight = vh;
    const pTop = 0;
    return {
      top: pTop,
      right: vw,
      bottom: pTop + vw,
      left: 0,
      width: vw,
      height: vw
    };
  } else {
    // const lSide = vh - top;
    const lSide = vh - 5;
    const lWidth = vw - 5; // lSide * (4/3);
    const spaceCenter = vw - lWidth;
    return {
      top,
      right: lSide,
      bottom: top + lSide,
      left: spaceCenter / 2,
      width: lWidth,
      height: lSide
    };
  }
}

export function autoredraw(action) {
  m.startComputation();
  try {
    return action();
  } finally {
    m.endComputation();
  }
}

const perfIconsMap = {
  yuzbir: 'T',
  duzokey: '+'
};

export function gameIcon(perf) {
  return perfIconsMap[perf] || '8';
}

export function formatMasaDuration(rounds, scores) {
  return rounds ? rounds + i18n('hands') : scores + i18n('scores')[0];
}

export function pad(num, size) {
  var s = num + '';
  while (s.length < size) s = '0' + s;
  return s;
}

export function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
