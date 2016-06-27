import { request } from './http';
import settings from './settings';

export function newGame() {
  const config = settings.gameSetup.human;

  const data = {
    variant: config.variant(),
    rounds: config.rounds(),
    mode: config.mode()
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
