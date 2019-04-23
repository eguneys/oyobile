import throttle from 'lodash/throttle';
import socket from '../../../socket';
import redraw from '../../../utils/redraw';
import * as utils from '../../../utils';
import * as xhr from '../masaXhr';
import faq from '../faq';
import socketHandler from './socketHandler';
import router from '../../../router';

export default function MasaCtrl(id) {

  this.id = id;

  this.faqCtrl = faq.controller(this);
  
  xhr.masa(id).then((data) => {
    this.masa = data;
    this.seatId = data.seatId;

    this.startsAt = window.moment(data.startsAt).calendar();
    loadCurrentPage(this.masa.standing);
    this.hasJoined = !!(data.me && !data.me.withdraw);

    socket.createMasa(
      this.id,
      this.masa.socketVersion,
      socketHandler(this));

    redraw();
  }).catch((err) => {
    if (err.status === 404) {
      this.notFound = true;
      redraw();
    } else {
      utils.handleXhrError(err);
    }
  });

  this.join = throttle(() => {
    xhr.join(this.masa.id)
      .then(() => {
        this.hasJoined = true;
        redraw();
      }).catch(utils.handleXhrError);
  }, 1000);

  this.withdraw = throttle(() => {
    xhr.withdraw(this.masa.id)
      .then(() => {
        this.hasJoined = false;
        redraw();
      }).catch(utils.handleXhrError);
  }, 1000);

  this.reload = throttle(() => {
    xhr.reload(this.id)
      .then(onReload)
      .catch(onXhrError);
  }, 2000);


  this.unload = () => {
    document.removeEventListener('resume', this.reload);
  };

  const onReload = (data) => {
    const oldData = this.masa;
    this.masa = data;
    this.seatId = data.seatId;
    loadCurrentPage(data.standing);
    this.hasJoined = !!(data.me && !data.me.withdraw);
    redirectToMyGame();
    redraw();
  };

  const redirectToMyGame = () => {
    var gameId = myCurrentGameId(this);
    if (gameId)
      router.set('/masa/' + this.masa.id + '/game/' + gameId, true);
  };

  const myCurrentGameId = (ctrl) => {
    var ids = {
      created: 10,
      started: 20,
      aborted: 25
    };

    var seatId = ctrl.seatId;
    if (!seatId) return null;
    var pairing = ctrl.masa.pairings.filter(p => {
      return p.s < ids.aborted && (
        p.u.filter((id) => id.toLowerCase() === seatId.toLowerCase())[0]
      );
    })[0];
    return pairing ? pairing.id : null;
  };

  const onXhrError = (err) => {
    if (err.status === 404) {
      this.notFound = true;
    }
    redraw();
  };

  const loadCurrentPage = (data) => {
    this.currentPageResults = data.players;
  };
}
