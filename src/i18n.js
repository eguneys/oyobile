import settings from './settings';
import { loadLocalJsonFile } from './utils';


const defaultCode = 'tr';

let lang = defaultCode;
let messages = {};

const untranslated = {
};

export function getLang() {
  return lang;
}

export default function i18n(key, ...args) {
  var str = messages[key] || untranslated[key]|| key;
  args.forEach(a => { str = str.replace('%s', String(a)); });
  
  return str;
}

export function loadPreferredLanguage() {
  const fromSettings = settings.general.lang();
  if (fromSettings) {
    return loadLanguage(fromSettings);
  }

  return new Promise(resolve => {
    window.navigator.globalization.getPreferredLanguage(
      l => resolve(l.value.split('-')[0]),
      () => resolve(defaultCode)
    );
  }).then((code) => {
    settings.general.lang(code);
    return code;
  }).then(loadFile)
    .then(loadMomentLocale);
}

export function loadLanguage(lang) {
  return loadFile(lang)
    .then(loadMomentLocale);
}

function loadFile(code) {
  return loadLocalJsonFile('i18n/' + code + '.json')
    .then(data => {
      lang = code;
      messages = data;
      return code;
    }).catch(error => {
      if (code === defaultCode) throw new Error(error);
      return loadFile(defaultCode);
    });
}

// export function getAvailableLanguages() {
//   return m.request({
//     url: 'i18n/refs.json',
//     method: 'GET'
//   }).then(data => { return data; }, error => {
//     // same workaround for iOS as above
//     if (error && error[0][0] === 'tr')
//       return error;
//     else
//       throw { error: 'Cannot load languages' };
//   });
// }



// export function loadFromSettings() {
//   return loadFile(settings.general.lang()).then(loadMomentLocale);
// }

// function loadFile(code) {
//   return m.request({
//     url: 'i18n/' + code + '.json',
//     method: 'GET',
//     deserialize: function(text) {
//       try {
//         return JSON.parse(text);
//       } catch (e) {
//         throw { error: 'Lang not available' };
//       }
//     }
//   }).then(function(data) {
//     messages = data;
//     return code;
//   }, function(error) {
//     // workaround for iOS: because xhr for local file has a 0 status it will
//     // reject the promise and still have the response object
//     if (error && error.playWithAFriend) {
//       messages = error;
//       return code;
//     } else {
//       if (code === defaultCode) throw new Error(error);
//       return loadFile(defaultCode);
//     }
//   });
// }

function loadMomentLocale(code) {
  if (code !== 'en') {
    var script = document.createElement('script');
    script.src = 'moment/locale/' + code + '.js';
    document.head.appendChild(script);
  }
  window.moment.locale(code);
  return code;
}

