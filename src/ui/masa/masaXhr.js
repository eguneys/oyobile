import { fetchJSON } from '../../http';

export function currentMasas() {
  return fetchJSON('/masa', {}, true);
}

export function masa(id) {
  return fetchJSON('/masa/' + id, { query: { socketVersion: 1 }}, true);
}

export function reload(id, page) {
  return fetchJSON('/masa/' + id, { method: 'GET', query: page ? { page }: {}});
}

export function join(id) {
  return fetchJSON('/masa/'+ id + '/join', { method: 'POST' }, true);
}

export function invite(id) {
  return fetchJSON('/masa/'+ id + '/invite', { method: 'POST' }, true);
}

export function withdraw(id) {
  return fetchJSON('/masa/'+ id + '/withdraw', { method: 'POST' }, true);
}

// import { request } from '../../http';

// export function currentMasas() {
//   return request('/masa', {}, true);
// }

// export function masa(id) {
//   return request('/masa/' + id, { data: {socketVersion: 1}}, true);
// }

// export function reload(id) {
//   return request('/masa/' + id,
//                  {
//                    method: 'GET',
//                    data: {},
//                    background: true
//                  });
// }

// export function join(id, side) {
//   side = side ? `?side=${side}`: '';
//   return request('/masa/' + id + '/join' + side, { method: 'POST' }, true);
// }

// export function withdraw(id) {
//   return request('/masa/' + id + '/withdraw', { method: 'POST' }, true);
// }
