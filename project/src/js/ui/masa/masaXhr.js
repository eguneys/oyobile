import { request } from '../../http';

export function currentMasas() {
  return request('/masa', {}, true);
}

export function masa(id) {
  return request('/masa/' + id, { data: {socketVersion: 1}}, true);
}

export function reload(id) {
  return request('/masa/' + id,
                 {
                   method: 'GET',
                   data: {},
                   background: true
                 });
}

export function join(id, side) {
  side = side ? `?side=${side}`: '';
  return request('/masa/' + id + '/join' + side, { method: 'POST' }, true);
}

export function withdraw(id) {
  return request('/masa/' + id + '/withdraw', { method: 'POST' }, true);
}
