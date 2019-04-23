export function tellWorker(worker, topic, payload) {
  if (payload !== undefined) {
    worker.postMessage({ topic, payload });
  } else {
    worker.postMessage({ topic });
  }
}

export function askWorker(worker, msg) {
  return new Promise((resolve, reject) => {
    function listen(e) {
      if (e.data.topic === msg.topic && (msg.reqid === undefined || e.data.reqid === msg.reqid)) {
        worker.removeEventListener('message', listen);
        resolve(e.data.payload);
      } else if (e.data.topic === 'error' && e.data.payload.callerTopic === msg.topic && (
        msg.reqid === undefined || e.data.reqid === msg.reqid)) {
        worker.removeEventListener('message', listen);
        reject(e.data.payload.error);
      }
    }
    worker.addEventListener('message', listen);
    worker.postMessage(msg);
  });
}
