import merge from 'lodash/merge';
import spinner from './spinner';
import globalConfig from './config';
import { buildQueryString } from './utils/querystring';
import storage from './storage';

export const SESSION_ID_KEY = 'sessionId';

const baseUrl = globalConfig.apiEndPoint;

function addQueryString(url, queryString) {
  const prefix = url.indexOf('?') < 0 ? '?' : '&';
  let res = url + prefix + queryString;
  return res;
}

function request(url, type, opts, feedback) {

  let timeoutId;

  function onComplete() {
    clearTimeout(timeoutId);
    if (feedback) spinner.stop();
  }

  if (opts && opts.query) {
    const query = buildQueryString(opts.query);
    if (query !== '') {
      url = addQueryString(url, query);
    }
    delete opts.query;
  }
  
  const cfg = {
    method: 'GET',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Accept': 'application/vnd.oyunkeyf.v' + globalConfig.apiVersion + '+json'
    }
  };

  merge(cfg, opts);

  const init = {
    ...cfg,
    credentials: 'include',
    headers: new Headers(cfg.headers)
  };

  if ((init.method === 'POST' || init.method === 'PUT') &&
      !init.headers.get('Content-Type')) {
    (init.headers).append('Content-Type', 'application/json; charset=UTF-8');
    if (!init.body){
      init.body = '{}';
    }
  }

  const sid = storage.get(SESSION_ID_KEY);
  if (sid !== null) {
    init.headers.append(SESSION_ID_KEY, sid);
  }

  const fullUrl = url.indexOf('http') > -1 ? url : baseUrl + url;

  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(
      () => reject(new Error('Request timeout')),
      globalConfig.fetchTimeoutMs
    );
  });

  const respOrTimeout = Promise.race([
    fetch(fullUrl, init),
    timeoutPromise
  ]);

  if (feedback) {
    spinner.spin();
  }

  return new Promise((resolve, reject) => {
    respOrTimeout
      .then((r) => {
        onComplete();
        if (r.ok) {
          resolve(r[type]());
        } else {
          r.text()
            .then((bodyText) => {
              try {
                reject({
                  status: r.status,
                  body: JSON.parse(bodyText)
                });
              } catch (_) {
                reject({
                  status: r.status,
                  body: r.statusText
                });
              }
            });
        }
      }).catch(err => {
        onComplete();
        reject({
          status: 0,
          body: err.message
        });
      });
  });
}

export function fetchJSON(url, opts, feedback = false) {
  return request(url, 'json', opts, feedback);
}

export const apiVersion = 1;

// const baseUrl = window.oyunkeyf.apiEndPoint;

function onSuccess(data) {
  spinner.stop();
  return data;
}

function onError(data) {
  spinner.stop();
  throw data;
}

function xhrConfig(xhr) {
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  xhr.setRequestHeader('Accept', 'application/vnd.oyunkeyf.v' + apiVersion + '+json');
  xhr.withCredentials = true;
  xhr.timeout = 8000;
}

// convenient wrapper around m.request
// export function request(url, opts, feedback, xhrConf) {
//   var cfg = {
//     url: baseUrl + url,
//     method: 'GET',
//     data: { },
//     config: xhrConf || xhrConfig,
//     deserialize: function(text) {
//       try {
//         return JSON.parse(text);
//       } catch (e) {
//         throw { response: { error: 'Cannot read data from the server' }};
//       }
//     },
//     unwrapError: function(response, xhr) {
//       return { response, status: xhr.status };
//     }
//   };
//   merge(cfg, opts);

//   if (cfg.method === 'GET') {
//     cfg.data._ = Date.now();
//   }

//   var promise = m.request(cfg);

//   if (feedback) {
//     spinner.spin(document.body);
//     return promise.then(onSuccess, onError);
//   } else {
//     return promise;
//   }
// } 
