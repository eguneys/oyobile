const defaults = {
  apiVersion: 1,
  fetchTimeoutMs: 10000
};

const config = Object.assign({}, defaults, window.oyunkeyf);

export default config;
