/* application entry point */

// import './polyfills';


// for moment a global object makes loading locales easier
import moment from 'moment';
window.moment = moment;

import * as utils from './utils';
import session from './session';
import redraw from './utils/redraw';
import settings from './settings';
import { loadPreferredLanguage, ensureLangIsAvailable, loadLanguage } from './i18n';
import * as xhr from './xhr';
import * as helper from './ui/helper';
import backbutton from './backbutton';
import socket from './socket';
import routes from './routes';
import router from './router';
import { isForeground, setForeground, setBackground } from './utils/appMode';

let firstConnection = true;

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
  document.addEventListener('backbutton', router.backbutton, false);
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
    if (firstConnection) {
      firstConnection = false;
      // xhr.status();
      
      session.rememberLogin()
        .then((user) => {
          const serverLang = user.language && user.language.split('-')[0];
          if (serverLang) {
            ensureLangIsAvailable(serverLang)
              .then(lang => {
                settings.general.lang(lang);
                loadLanguage(lang);
              });
          }
          redraw();
        }).catch(() => {
          console.log('connected as anonymous');
        });
    } else {
      socket.connect();
      session.refresh();
    }
  }
}

function onOffline() {
  if (isForeground() && !hasNetwork()) {
    socket.disconnect();
    redraw();
  }
}

function onResize() {
  helper.clearCachedViewportDim();
  redraw();
}

function onResume() {
  setForeground();
  session.refresh();
  socket.connect();
  redraw();
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
                          () => loadPreferredLanguage().then(main),
                          false
                         );
