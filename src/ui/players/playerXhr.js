import { request } from '../../http';

export function onlinePlayers() {
  return request('/player/online', {}, true);
}
