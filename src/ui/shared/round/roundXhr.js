import { fetchJSON } from '../../../http';

export function reload(ctrl) {
  return fetchJSON(ctrl.data.url.round);
}
