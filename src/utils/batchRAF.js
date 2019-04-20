let callbacks = new Set();
let batching = false;

export function batchRequestAnimationFrame(callback) {
  callbacks.add(callback);
  if (!batching) {
    batching = true;
    requestAnimationFrame((ts) => {
      const batch = callbacks;
      batching = false;
      callbacks = new Set();
      batch.forEach(f => f(ts));
    });
  }
}
