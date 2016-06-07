import m from 'mithril';
import okeyground from 'okeyground-mobile';
import makeData from './data';
import i18n from '../../i18n';
import * as utils from '../../utils';
import socket from '../../socket';
import socketHandler from './socketHandler';
import ground from './ground';
import mutil from './util';
import gameApi from '../../oyunkeyf/game';
import gameStatus from '../../oyunkeyf/status';

const { util } = okeyground;
const { wrapGroup, wrapPiece, wrapDrop, partial } = util;

export default function(cfg) {
  this.data = makeData(cfg);

  this.vm = {
  };

  this.setTitle = (text) => {
    if (!text) {
      if (gameStatus.started(this.data)) {
        text = gameApi.title(this.data);
      } else if (gameStatus.finished(this.data)) {
        text = i18n('gameOver');
      }
    } else {
      text = 'oyunkeyf.net';
    }
    this.title = text;
  };
  this.setTitle();

  const connectSocket = () => {
    if (utils.hasNetwork()) {
      socket.createGame(
        this.data.url.socket,
        this.data.player.version,
        socketHandler(this),
        this.data.url.round
      );
    }
  };

  connectSocket();

  this.toggleUserPopup = (position, userId) => {
    console.log('user', userId);
  };

  var userMove = (key, move) => {
    this.sendMove(key, move);
  };

  var onMove = (key, piece) => {
    console.log('sound.move', key, piece);
    if (key === okeyground.move.drawMiddle) {
      this.sendMove(key);
    }
    if (key === okeyground.move.discard) {
      this.vm.hasPlayedDiscard = true;
    }
  };

  this.sendMove = (key, args = {}) => {
    var move = args;
    args.key = key;
    socket.send('move', move, {
      ackable: true
    });
  };

  this.apiMove = (o) => {
    const d = this.data;
    const playing = gameApi.isPlayerPlaying(d);

    d.game.turns = o.ply;
    d.game.player = gameApi.sideByPly(o.ply);
    d.game.oscores = o.oscores;
    d.possibleMoves = d.player.side === d.game.player ? o.dests : [];
    this.setTitle();
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
        } else if (o.key === okeyground.move.collectOpen) {
          this.restoreFen(o.fen);
        } else if (o.key === okeyground.move.leaveTaken) {
          this.restoreFen(o.fen);
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
      if (this.clock) this.clock.update(c);
    }
  };

  this.restoreFen = (fen) => {
    var oldFen = this.okeyground.getFen();
    this.okeyground.set({
      fen: mutil.persistentFen(fen, oldFen)
    });
  };

  this.saveBoard = () => {
    var boardFen = this.okeyground.getFen();
    mutil.fenStore.set(boardFen);
  };

  this.okeyground = ground.make(this.data, cfg.game.fen, userMove, onMove);

  this.reload = (rCfg) => {
    this.data = makeData(rCfg);
    this.setTitle();

    // ground.reload(this.okeyground, this.data, rCfg.game.fen);
    m.redraw();
  };
}
