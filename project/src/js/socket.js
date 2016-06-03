import storage from './storage';
import { oyunkeyfSri, askWorker, tellWorker, hasNetwork } from './utils';
import m from 'mithril';

const worker = new Worker('lib/socketWorker.js');

let socketHandlers;
let errorDetected = false;
let connectedWS = true;

let alreadyWarned = false;
let redrawOnDisconnectedTimeoutID;
let proxyFailTimeoutID;
const proxyFailMsg = "Oyunkeyf sunucularına bağlantı koptu. Problem sürekli yaşanıyorsa proxy yada network'la ilgili olabilir.";

const defaultHandlers = {
};

function createMasa(masaId, version, handlers) {
  let url = '/masa/' + masaId + '/socket/v1';

  socketHandlers = {
    events: Object.assign({}, defaultHandlers, handlers)
  };
  const opts = {
    options: {
      name: 'masa',
      debug: false,
      pingDelay: 2000,
      registeredEvents: Object.keys(socketHandlers.events)
    }
  };
  tellWorker(worker, 'create', {
    clientId: oyunkeyfSri,
    socketEndPoint: window.oyunkeyf.socketEndPoint,
    url,
    version,
    opts
  });
}

function onConnected() {
  const wasOff = !connectedWS;
  connectedWS = true;
  clearTimeout(proxyFailTimeoutID);
  clearTimeout(redrawOnDisconnectedTimeoutID);
  if (wasOff) m.redraw();
}

function onDisconnected() {
  const wasOn = connectedWS;
  connectedWS = false;
  if (wasOn) redrawOnDisconnectedTimeoutID = setTimeout(function() {
    m.redraw();
  }, 2000);
  if (wasOn && !alreadyWarned && !storage.get('donotshowproxyfailwarning')) proxyFailTimeoutID = setTimeout(() => {
    // check if disconnection lasts, it could mean a proxy prevents
    // establishing a tunnel
    if (hasNetwork() && !connectedWS) {
      alreadyWarned = true;
      window.navigator.notification.alert(proxyFailMsg, function() {
        storage.set('donotshowproxyfailwarning', true);
      });
    }
  }, 20000);
}

worker.addEventListener('message', function(msg) {
  switch(msg.data.topic) {
  case 'onOpen':
    if (socketHandlers.onOpen) socketHandlers.onOpen();
    break;
  case 'disconnected':
    onDisconnected();
    break;
  case 'connected':
    onConnected();
    break;
  case 'onError':
    if (socketHandlers.onError) socketHandlers.onError();
    break;
  case 'handle':
    var h = socketHandlers.events[msg.data.payload.t];
    if (h) h(msg.data.payload.d || msg.data.payload);
    break;
  }
});

export default {
  createMasa,
  setVersion(version) {
    tellWorker(worker, 'setVersion', version);
  }
};
