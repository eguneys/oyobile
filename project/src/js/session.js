var session = null;

function isConnected() {
  return !!session;
}

function getSession() {
  return session;
}

export default {
  isConnected,
  get: getSession
};
