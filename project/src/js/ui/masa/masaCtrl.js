import socket from '../../socket';
import * as utils from '../../utils';
import * as xhr from './masaXhr';
import session from '../../session';
import helper from '../helper';
import m from 'mithril';

export default function controller() {

  const masas = m.prop();
  const currentTab = m.prop(m.route.param('tab') || 'created');

  function reload(data) {
    data.started = data.started.filter(supported);
    data.created = data.created.filter(supported);
    data.finished = data.finished.filter(supported);
    masas(data);
    return data;
  }

  const handlers = {
    reload: function(data) { reload(data); m.redraw(); }
  };

  socket.createMasaHome(handlers);

  xhr.currentMasas().then(reload).catch(utils.handleXhrError);

  return {
    masas,
    currentTab
  };
}

function supported(t) {
  return session.isConnected() || !t.rated || !t.membersOnly;
}
