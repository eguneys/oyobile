import { SESSION_ID_KEY, fetchJSON } from './http';
import { hasNetwork, handleXhrError } from './utils';
import redraw from './utils/redraw';
import i18n from './i18n';
import settings from './settings';
import throttle from 'lodash/throttle';
import storage from './storage';

let session;

function isConnected() {
  return session !== undefined;
}

function getSession() {
  return session;
}

function isSession(data) {
  return data.id !== undefined;
}

function storeSession(d) {
  
}

function login(username, password) {
  return fetchJSON('/login', {
    method: 'POST',
    body: JSON.stringify({
      username,
      password
    })
  }, true)
    .then((data) => {
      if (isSession(data)) {
        session = data;
        if (session.sessionId) {
          storage.set(SESSION_ID_KEY, session.sessionId);
        }
        // storeSession(data);
        return session;
      }
      return false;
    });
}

function signup(username, email, password) {
  return fetchJSON('/signup', {
    method: 'POST',
    body: JSON.stringify({
      username,
      email,
      password
    })
  }, true)
    .then(d => {
      if (isSession(d)) {
        session = d;
        if (session.sessionId) {
          storage.set(SESSION_ID_KEY, session.sessionId);
        }
      }
      return d;
    });
}

function rememberLogin() {
  return fetchJSON('/account/info')
    .then((data) => {
      session = data;
      storeSession(data);
      return data;
    });
}

function refresh() {
  return fetchJSON('/account/info', { cache: 'reload' })
    .then((data) => {
      session = data;
      storeSession(data);
      redraw();
    }).catch((err) => {
      if (session !== undefined && err.status === 401) {
        session = undefined;
        onLogout();
        redraw();
        window.plugins.toast.show(i18n('signedOut'), 'short', 'center');
      }
    });
}

function onLogout() {
  storage.remove(SESSION_ID_KEY);
  signals.afterLogout.dispatch();
}

function logout() {
  return fetchJSON('/logout', { method: 'GET' }, true)
    .then(() => {
      session = undefined;
      redraw();
    }).catch(handleXhrError);
};

export default {
  isConnected,
  signup,
  logout,
  login: throttle(login, 1000),
  rememberLogin: throttle(rememberLogin, 1000),
  get: getSession,
  refresh: throttle(refresh, 1000)
};


