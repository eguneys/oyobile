import throttle from 'lodash/throttle';
import Okeyground from 'okeyground-mobile';
import router from '../../../router';
import socket from '../../../socket';
import redraw from '../../../utils/redraw';
import ground from './ground';
import gameApi from '../../../oyunkeyf/game';
import socketHandler from './socketHandler';
import ClockCtrl from './clock/ClockCtrl';
import * as xhr from './roundXhr';
import * as masaXhr from '../../masa/masaXhr';
const { util } = Okeyground;
const { wrapGroup, wrapPiece, wrapDrop, partial } = util;

export default function OnlineRound(id, cfg) {
  const setData = (cfg) => {
    this.data = cfg;
  };

  this.onMove = (key, piece) => {
    if (key === Okeyground.move.drawMiddle) {
      this.sendMove(key);
    }
    if (key === Okeyground.move.discard) {
      this.vm.hasPlayedDiscard = true;
    }
  };
  
  this.onUserMove = (key, move) => {
    // TODO: why?
    if (key === Okeyground.move.leaveTaken) {
      return;
    }
    this.sendMove(key, move);
  };

  this.sendMove = (key, args = {}) => {
    var move = args;
    args.key = key;

    socket.send('move', move, {
      ackable: true
    });
  };

  this.apiMove = (o) => {
    var d = this.data,
        playing = gameApi.isPlayerPlaying(d);

    d.game.turns = o.ply;
    d.game.player = gameApi.sideByPly(o.ply);
    d.possibleMoves = d.player.side === d.game.player ? o.dests : [];
    if (true) {
      if (o.isMove) {
        if (o.drawmiddle) {
          this.okeyground.apiMove(o.key, wrapPiece(o.drawmiddle.piece));
        } else if (o.discard) {
          if (!this.vm.hasPlayedDiscard) {
            this.okeyground.apiMove(o.key, wrapPiece(o.discard.piece));
          } else {
            
          }
          this.vm.hasPlayedDiscard = false;
        } else if (o.opens) {
          this.okeyground.apiMove(o.key, wrapGroup(o.opens.group));
        } else if (o.drop) {
          this.okeyground.apiMove(o.key, wrapDrop(o.drop.piece, o.drop.pos));
        } else if (o.key === Okeyground.move.collectOpen) {
          this.restoreFen(o.fen, Okeyground.move.collectOpen);
        } else if (o.key === Okeyground.move.leaveTaken) {
          this.okeyground.apiMove(o.key, wrapPiece(o.leavetaken.piece));
        } else {
          this.okeyground.apiMove(o.key);
        }
      }

      this.okeyground.set({
        turnSide: d.game.player,
        movable: {
          dests: playing ? d.possibleMoves : []
        }
      });
    }

    if (o.clock) {
      var c = o.clock;
      if (this.clock) this.clock.setClock(d, o.clock.east, o.clock.west, o.clock.south, o.clock.north);
    }

    redraw();
  };

  this.outoftime = throttle(() => {
    socket.send('outoftime', this.data.game.player);
  }, 500);

  this.endWithData = (scores) => {
    xhr.reload(this).then(this.onReload);
  };

  this.onReload = (rCfg) => {
    setData(rCfg);

    if (!gameApi.playable(this.data)) {
      this.showActions();
      redraw();
    }
  };

  this.showActions = () => {
    router.backbutton.stack.push(this.hideActions);
    this.vm.showingActions = true;
  };

  this.hideActions = (fromBB) => {
    if (fromBB !== 'backbutton' && this.vm.showingActions) router.backbutton.stack.pop();
    this.vm.showingActions = false;
  };
  
  this.id = id;
  setData(cfg);

  this.vm = {
    scoresheetInfo: {}
  };
  
  this.okeyground = ground.make(
    this.data,
    this.onUserMove,
    this.onMove
  );

  this.clock = this.data.clock ? new ClockCtrl(this.data, {
    onFlag: this.outoftime
  }) : null;

  if (this.clock) {
    const tickNow = () => {
      this.clock && this.clock.tick();
      if (gameApi.playable(this.data)) this.clockTimeoutId = setTimeout(tickNow, 100);
    };
    this.clockTimeoutId = setTimeout(tickNow, 100);
  }

  socket.createGame(
    this.data.url.socket,
    this.data.player.version,
    socketHandler(this),
    this.data.url.round);

  this.unload = () => {
    clearTimeout(this.clockTimeoutId);
  };

  this.resign = () => {
    masaXhr.withdraw(this.data.game.masaId);
  };

  this.leaveTaken = () => {
    this.sendMove(Okeyground.move.leaveTaken);
  };
  
  this.openSeries = () => {
    this.okeyground.playOpenSeries();
  };

  this.openPairs = () => {
    this.okeyground.playOpenPairs();
  };
  
  this.sortPairs = () => {
    this.okeyground.sortPairs();
  };

  this.sortSeries = () => {
    this.okeyground.sortSeries();
  };

  this.leaveTaken = () => {
    this.sendMove(Okeyground.move.leaveTaken);
  };

  this.collectOpen = () => {
    this.sendMove(Okeyground.move.collectOpen);
  };


  this.restoreFen = (fen, hint) => {
    this.okeyground.set({
      fen: fen,
      animationHint: hint
    });
  };

  if (!gameApi.playable(this.data)) {
    this.showActions();
  }
  redraw();

}
