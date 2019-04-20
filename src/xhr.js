import { request } from './http';
import settings from './settings';
import session from './session';

export let cachedPools = [];

export function newGame() {
  const config = settings.gameSetup.human;

  const data = {
    variant: config.variant(),
    rounds: config.rounds(),
    mode: session.isConnected() ? config.mode() : '0',
    membersOnly: session.isConnected() ? config.membersOnly() : false
  };

  return request('/masa/new', {
    method: 'POST',
    data
  }, true);
}

export function lobby(feedback) {
  return request('/', null, feedback);
}

export function game(id, background) {
  var url = '/' + id;
  return request(url, { background }, true);
}

export function setServerLang(lang) {
  if (session.isConnected()) {
    // return request('/translation/select', {
    //   method: 'POST',
    //   data: { lang }
    // });
    return Promise.resolve();
  } else {
    return Promise.resolve();
  }
}
