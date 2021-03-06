import globalConfig from './config';
import redraw from './utils/redraw';
import storage from './storage';
import { SESSION_ID_KEY } from './http';
import { newSri, autoredraw, hasNetwork } from './utils';
import { askWorker, tellWorker } from './utils/worker';
import session from './session';


function setupConnection(setup, socketHandlers) {
  const sid = storage.get(SESSION_ID_KEY);
  if (sid !== null) {
    if (setup.opts.params) {
      setup.opts.params[SESSION_ID_KEY] = sid;
    } else {
      setup.opts.params = {
        [SESSION_ID_KEY]: sid
      };       
    }
  } else if (setup.opts.params) {
    delete setup.opts.params.sessionId;
  }
  setup.opts.options.isAuth = !!sid;
  worker.onmessage = (msg) => {
    switch (msg.data.topic) {
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
      let h = socketHandlers.events[msg.data.payload.t];
      if (h) h(msg.data.payload.d, msg.data.payload);
      break;
    }
  };

  tellWorker(worker, 'create', setup);
}

function onConnected() {
  if (!connectedWS) {
    connectedWS = true;
    redraw();
  }
}

function onDisconnected() {
  if (connectedWS) {
    connectedWS = false;
    redraw();
  }
}


function reconnectCurrent() {
  
}

let connectedWS = false;

const worker = new Worker('lib/socketWorker.js');
const defaultHandlers = {
  
};

function createLobby(name, onOpen, handlers) {
  const socketHandlers = {
    onOpen: () => {
      session.refresh();
      onOpen();
    },
    events: Object.assign({}, defaultHandlers, handlers)
  };
  const opts = {
    options: {
      name,
      debug: globalConfig.mode === 'dev',
      pingDelay: 2000,
      sendOnOpen: [],
      registeredEvents: Object.keys(socketHandlers.events)
    }
  };
  const setup = {
    clientId: newSri(),
    socketEndPoint: globalConfig.socketEndPoint,
    url: `/lobby/socket/v${globalConfig.apiVersion}`,
    opts
  };
  setupConnection(setup, socketHandlers);
}

function createMasa(masaId, version, handlers) {
  let url = '/masa/' + masaId + `/socket/v${globalConfig.apiVersion}`;
  const socketHandlers = {
    events: Object.assign({}, defaultHandlers, handlers),
    onOpen: session.backgroundRefresh
  };
  const opts = {
    options: {
      name: 'masa',
      debug: globalConfig.mode === 'dev',
      pingDelay: 2000,
      registeredEvents: Object.keys(socketHandlers.events)
    }
  };
  const setup = {
    clientId: newSri(),
    socketEndPoint: globalConfig.socketEndPoint,
    url,
    version,
    opts
  };
  setupConnection(setup, socketHandlers);
}

function createGame(
  url,
  version,
  handlers,
  gameUrl) {
  const socketHandlers = {
    onOpen: session.backgroundRefresh,
    events: Object.assign({}, defaultHandlers, handlers)
  };
  const opts = {
    options: {
      name: 'game',
      debug: globalConfig.mode === 'dev',
      sendOnOpen: [],
      registeredEvents: Object.keys(socketHandlers.events)
    }
  };
  const setup = {
    clientId: newSri(),
    socketEndPoint: globalConfig.socketEndPoint,
    url,
    version,
    opts
  };
  
  setupConnection(setup, socketHandlers);
}

export default {
  createGame,
  createLobby,
  createMasa,
  reconnectCurrent,
  setVersion(version) {
    tellWorker(worker, 'setVersion', version);
  },
  send: (t, data, opts) => {
    tellWorker(worker, 'send', [t, data, opts]);
  },
  isConnected() {
    return connectedWS;
  },
  connect() {
    tellWorker(worker, 'connect');
  },
  destroy() {
    tellWorker(worker, 'destroy');
  }
};


/// OLD


// const worker = new Worker('lib/socketWorker.js');

// let socketHandlers;
// let errorDetected = false;
// let connectedWS = true;

// let alreadyWarned = false;
// let redrawOnDisconnectedTimeoutID;
// let proxyFailTimeoutID;
// const proxyFailMsg = "Oyunkeyf sunucularına bağlantı koptu. Problem sürekli yaşanıyorsa proxy yada network'la ilgili olabilir.";

// const defaultHandlers = {
// };

// function createGame(url, version, handlers, gameUrl) {
//   errorDetected = false;
//   socketHandlers = {
//     onError: function() {
//       // we can't get socket error, so we send an xhr to test whether the
//       // rejection is an authorization issue
//       if (!errorDetected) {
//         // just to be sure that we don't send an xhr every second when the
//         // websocket is trying to reconnect
//         errorDetected = true;
//         xhr.game(gameUrl.substring(1)).then(function() {}, function(err) {
//           if (err.status === 401) {
//             window.plugins.toast.show(i18n('unauthorizedError'), 'short', 'center');
//             m.route('/');
//           }
//         });
//       }
//     },
//     events: Object.assign({}, defaultHandlers, handlers)
//   };

//   const opts = {
//     options: {
//       name: 'game',
//       debug: false,
//       registeredEvents: Object.keys(socketHandlers.events)
//     }
//   };
//   tellWorker(worker, 'create', {
//     clientId: oyunkeyfSri,
//     socketEndPoint: window.oyunkeyf.socketEndPoint,
//     url,
//     version,
//     opts
//   });
// }

// function createMasa(masaId, version, handlers) {
//   let url = '/masa/' + masaId + '/socket/v1';

//   socketHandlers = {
//     events: Object.assign({}, defaultHandlers, handlers)
//   };
//   const opts = {
//     options: {
//       name: 'masa',
//       debug: false,
//       pingDelay: 2000,
//       registeredEvents: Object.keys(socketHandlers.events)
//     }
//   };
//   tellWorker(worker, 'create', {
//     clientId: oyunkeyfSri,
//     socketEndPoint: window.oyunkeyf.socketEndPoint,
//     url,
//     version,
//     opts
//   });
// }

// function createMasaHome(handlers) {
//   let url = '/socket';

//   socketHandlers = {
//     events: Object.assign({}, defaultHandlers, handlers)
//   };
//   const opts = {
//     params: { flag: 'masa' },
//     options: {
//       name: 'masaHome',
//       debug: false,
//       pingDelay: 2000,
//       registeredEvents: Object.keys(socketHandlers.events)
//     }
//   };
//   tellWorker(worker, 'create', {
//     clientId: oyunkeyfSri,
//     socketEndPoint: window.oyunkeyf.socketEndPoint,
//     url,
//     version: 0,
//     opts
//   });
// }

// function createLobby(lobbyVersion, onOpen, handlers) {
//   socketHandlers = {
//     onOpen,
//     events: Object.assign({}, defaultHandlers, handlers)
//   };
//   const opts = {
//     options: {
//       name: 'lobby',
//       debug: false,
//       pingDelay: 2000,
//       registeredEvents: Object.keys(socketHandlers.events)
//     }
//   };
//   tellWorker(worker, 'create', {
//     clientId: oyunkeyfSri,
//     socketEndPoint: window.oyunkeyf.socketEndPoint,
//     url: '/lobby/socket/v1',
//     version: lobbyVersion,
//     opts
//   });
// }


// function createDefault() {
//   // default socket is useless when anon.?
//   if (hasNetwork()) {
//     socketHandlers = {
//       events: defaultHandlers
//     };
//     const opts = {
//       options: {
//         name: 'default',
//         debug: false,
//         pingDelay: 2000,
//         registeredEvents: Object.keys(socketHandlers.events)
//       }
//     };
//     tellWorker(worker, 'create', {
//       clientId: oyunkeyfSri,
//       socketEndPoint: window.oyunkeyf.socketEndPoint,
//       url: '/socket',
//       version: 0,
//       opts
//     });
//   }
// }

// function onConnected() {
//   const wasOff = !connectedWS;
//   connectedWS = true;
//   clearTimeout(proxyFailTimeoutID);
//   clearTimeout(redrawOnDisconnectedTimeoutID);
//   if (wasOff) m.redraw();
// }

// function onDisconnected() {
//   const wasOn = connectedWS;
//   connectedWS = false;
//   if (wasOn) redrawOnDisconnectedTimeoutID = setTimeout(function() {
//     m.redraw();
//   }, 2000);
//   if (wasOn && !alreadyWarned && !storage.get('donotshowproxyfailwarning')) proxyFailTimeoutID = setTimeout(() => {
//     // check if disconnection lasts, it could mean a proxy prevents
//     // establishing a tunnel
//     if (hasNetwork() && !connectedWS) {
//       alreadyWarned = true;
//       window.navigator.notification.alert(proxyFailMsg, function() {
//         storage.set('donotshowproxyfailwarning', true);
//       });
//     }
//   }, 20000);
// }

// worker.addEventListener('message', function(msg) {
//   switch(msg.data.topic) {
//   case 'onOpen':
//     if (socketHandlers.onOpen) socketHandlers.onOpen();
//     break;
//   case 'disconnected':
//     onDisconnected();
//     break;
//   case 'connected':
//     onConnected();
//     break;
//   case 'onError':
//     if (socketHandlers.onError) socketHandlers.onError();
//     break;
//   case 'handle':
//     var h = socketHandlers.events[msg.data.payload.t];
//     if (h) h(msg.data.payload.d || null, msg.data.payload);
//     break;
//   }
// });

// // export default {
// //   createDefault,
// //   createMasa,
// //   createMasaHome,
// //   createGame,
// //   createLobby,
// //   setVersion(version) {
// //     tellWorker(worker, 'setVersion', version);
// //   },
// //   send(type, data, opts) {
// //     tellWorker(worker, 'send', [type, data, opts]);
// //   },
// //   connect() {
// //     tellWorker(worker, 'connect');
// //   },
// //   disconnect() {
// //     tellWorker(worker, 'disconnect');
// //   },
// //   isConnected() {
// //     return connectedWS;
// //   },
// //   destroy() {
// //     tellWorker(worker, 'destroy');
// //   },
// //   terminate() {
// //     if (worker) worker.terminate();
// //   }
// // };
