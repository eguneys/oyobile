import { request } from '../../http';

export function user(id) {
  var url = '/api/user/' + id;
  return request(url, {}, true);
}
