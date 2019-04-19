import { request } from './http';
import { hasNetwork, handleXhrError } from './utils';
import i18n from './i18n';
import settings from './settings';
import throttle from 'lodash/throttle';
import m from 'mithril';

var session = null;

function isConnected() {
  return !!session;
}

function getSession() {
  return session;
}

function getUserId() {
  return (session && session.id) ? session.id : null;
}

function nowPlaying() {
  var np = session && session.nowPlaying || [];
  return np.filter(function(e) {
    return settings.game.supportedVariants.indexOf(e.variant.key) !== -1;
  });
}

function login(username, password) {
  return request('/login', {
    method: 'POST',
    data: {
      username,
      password
    }
  }, true).then(function(data) {
    session = data;
    return session;
  });
}

function logout() {
  return request('/logout', {}, true).then(function() {
    session = null;
  }, function(err) {
    handleXhrError(err);
    throw err;
  });
}

function signup(username, email, password) {
  return request('/signup', {
    method: 'POST',
    data: {
      username,
      email,
      password
    }
  }, true).then(function(data) {
    session = data;
    return session;
  });
}

function rememberLogin() {
  return request('/account/info', {
    background: true
  }).then(function(data) {
    session = data;
    return data;
  });
}

function refresh() {
  if (hasNetwork() && isConnected()) {
    return request('/account/info', {
      background: true
    }).then(function(data) {
      session = data;
      m.redraw();
      return session;
    }, err => {
      if (session && err.status === 401) {
        session = null;
        m.redraw();
        window.plugins.toast.show(i18n('signedOut'), 'short', 'center');
      }
      throw err;
    });
  } else {
    return Promise.resolve(false);
  }
}

export default {
  isConnected,
  signup,
  logout,
  login: throttle(login, 1000),
  rememberLogin: throttle(rememberLogin, 1000),
  refresh: throttle(refresh, 1000),
  get: getSession,
  getUserId,
  nowPlaying: nowPlaying
};
