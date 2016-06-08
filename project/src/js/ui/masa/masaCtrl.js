import socket from '../../socket';
import * as utils from '../../utils';
import * as xhr from './masaXhr';
import helper from '../helper';
import m from 'mithril';

export default function controller() {
  const handlers = {
    reload: function(data) {
      masas(data);
      m.redraw();
    }
  };

  socket.createMasaHome(handlers);

  const masas = m.prop();
  const currentTab = m.prop(m.route.param('tab') || 'created');

  xhr.currentMasas().then(data => {
    data.started = data.started.filter(supported);
    data.created = data.created.filter(supported);
    data.finished = data.finished.filter(supported);
    masas(data);
    return data;
  }).catch(utils.handleXhrError);

  return {
    masas,
    currentTab
  };
}

function supported(t) {
  return true;
}
