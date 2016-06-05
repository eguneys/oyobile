import makeData from './data';
import * as utils from '../../utils';
import socket from '../../socket';
import socketHandler from './socketHandler';
import ground from './ground';

export default function(cfg) {
  this.data = makeData(cfg);

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

  var userMove = function(key, move) {
    
  };

  var onMove = function(key, move) {
  };

  this.okeyground = ground.make(this.data, cfg.game.fen, userMove, onMove);
}
