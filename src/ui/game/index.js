import * as helper from '../helper';
import i18n from '../../i18n';
import socket from '../../socket';
import router from '../../router';
import { hasNetwork, handleXhrError } from '../../utils';
import { game as gameXhr } from '../../xhr';
import * as sleepUtils from '../../utils/sleep';
import OnlineRound from '../shared/round/OnlineRound';
import roundView from '../shared/round/view/roundView';

export default {
  oninit({ attrs }) {
    let gameData;

    sleepUtils.keepAwake();

    if (hasNetwork()) {
      gameXhr(attrs.id)
        .then(data => {
          gameData = data;
          
          setTimeout(() => {
            this.round = new OnlineRound(attrs.id, data);
          }, 400);

        }).catch(error => {
          handleXhrError(error);
          router.set('/');
        });
    }
  },
  oncreate(vnode) {
    if (vnode.dom)
      helper.elFadeIn(vnode.dom);
  },
  onremove() {
    sleepUtils.allowSleepAgain();
    socket.destroy();
    if (this.round) {
      this.round.unload();
    }
  },
  view({attrs}) {
    if (this.round) return roundView(this.round);
    
    return null;
  }
};
