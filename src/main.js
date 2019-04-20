/* application entry point */

// import './polyfills';


// for moment a global object makes loading locales easier
import moment from 'moment';
window.moment = moment;

import m from 'mithril';
import * as utils from './utils';
import session from './session';
import settings from './settings';
import { loadPreferredLanguage } from './i18n';
import { status as xhrStatus, setServerLang } from './xhr';
import * as helper from './ui/helper';
import backbutton from './backbutton';
import socket from './socket';
import routes from './routes';
import { isForeground, setForeground, setBackground } from './utils/appMode';

function main() {
  routes.init();

  // cache viewport dims
  helper.viewportDim();

  // pull session data once (to log in user automatically thanks to cookie)
  // and also listen to online event in case network was disconnected at app
  // startup
  if (utils.hasNetwork()) {
    onOnline();
  }

  document.addEventListener('online', onOnline, false);
  document.addEventListener('offline', onOffline, false);
  document.addEventListener('resume', onResume, false);
  document.addEventListener('pause', onPause, false);
  document.addEventListener('backbutton', backbutton, false);
  window.addEventListener('unload', function() {
    socket.destroy();
    socket.terminate();
  });
  window.addEventListener('resize', onResize, false);

  if (cordova.platformId === 'android') {
    window.StatusBar.backgroundColorByHexString('#151A1E');
  }

  setTimeout(function() {
    window.navigator.splashscreen.hide();
    window.StatusBar.hide();
    // xhrStatus();
  }, 500);
}

function onOnline() {
  if (isForeground()) {
    session.rememberLogin()
      .then(() => {
        m.redraw();
      })
      .then(() => setServerLang(settings.general.lang()));
  }
}

function onOffline() {
  if (isForeground()) {
    socket.disconnect();
    m.redraw();
  }
}

function onResize() {
  helper.clearCachedViewportDim();
  m.redraw();
}

function onResume() {
  setForeground();
  socket.connect();
}

function onPause() {
  setBackground();
  socket.disconnect();
}

// function handleError(event, source, fileno, columNumber) {
//   var description = event + ' at ' + source + ' [' + fileno + ', ' + columNumber + ']';
// }

// window.onerror = handleError;

document.addEventListener('deviceready',
                          () => main(), //loadPreferredLanguage().then(main),
                          false
                         );
