import socket from '../../../socket';
import throttle from 'lodash/throttle';
import * as utils from '../../../utils';
import * as xhr from '../masaXhr';
import faq from '../faq';
import playerInfo from '../playerInfo';
import m from 'mithril';

export default function controller() {
  const masa = m.prop();
  const hasJoined = m.prop(false);
  const isLoading = m.prop(false);
  const faqCtrl = faq.controller(masa);
  const playerInfoCtrl = playerInfo.controller(masa);

  function reload(data) {
    isLoading(false);
    const oldData = masa();
    masa(data);
    hasJoined(data.me && data.me.active);

    if (data.socketVersion) {
      socket.setVersion(data.socketVersion);
    }

    if (oldData.playerId !== data.playerId) {
      // reconnect with new playerId
      // TODO might miss redirect
      socket.connect();
    }
    
    m.redraw();
  }

  function join(id, side) {
    xhr.join(id, side).then(() => {
      hasJoined(true);
      m.redraw();
    }).catch(utils.handleXhrError);
  }

  function withdraw(id) {
    xhr.withdraw(id).then(() => {
      hasJoined(false);
      m.redraw();
    }).catch(utils.handleXhrError);    
  }

  const id = m.route.param('id');

  const throttleReload = throttle((m) => {
    isLoading(true);
    xhr.reload(m)
      .then(reload)
      .catch(() => isLoading(false));
  }, 1000);

  const handlers = {
    reload: () => throttleReload(id),
    resync: () => throttleReload(id),
    redirect: function(gameId) {
      m.route('/masa/' + masa().id + '/game/' + gameId, null, true);
    }
  };

  xhr.masa(id).then(data => {
    masa(data);
    hasJoined(data.me);
    socket.createMasa(id, masa().socketVersion, handlers);
  })
    .catch(utils.handleXhrError);

  return {
    masa,
    hasJoined,
    faqCtrl,
    playerInfoCtrl,
    join: throttle(join, 1000),
    withdraw: throttle(withdraw, 1000),
    isLoading
  };
}
