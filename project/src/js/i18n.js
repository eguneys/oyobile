import settings from './settings';
import m from 'mithril';

var messages = [];

const untranslated = {
};

const defaultCode = 'tr';

export default function i18n(key) {
  var str = messages[key] || untranslated[key]|| key;
  for (var i = 1; i < arguments.length; ++i) {
    str = str.replace('%s', arguments[i]);
  }
  return str;
}

export function loadPreferredLanguage() {
  if (settings.general.lang())
    return loadFromSettings();

  var deferred = m.deferred();
  window.navigator.globalization.getPreferredLanguage(
    language => deferred.resolve(language.value.split('-')[0]),
    () => deferred.resolve(defaultCode));

  return deferred.promise.then(code => {
    settings.general.lang(code);
    return code;
  })
    .then(loadFile)
    .then(loadMomentLocale);
}

export function loadFromSettings() {
  return loadFile(settings.general.lang()).then(loadMomentLocale);
}

function loadFile(code) {
  return m.request({
    url: 'i18n/' + code + '.json',
    method: 'GET',
    deserialize: function(text) {
      try {
        return JSON.parse(text);
      } catch (e) {
        throw { error: 'Lang not available' };
      }
    }
  }).then(function(data) {
    messages = data;
    return code;
  }, function(error) {
    // workaround for iOS: because xhr for local file has a 0 status it will
    // reject the promise and still have the response object
    if (error && error.playWithAFriend) {
      messages = error;
      return code;
    } else {
      if (code === defaultCode) throw new Error(error);
      return loadFile(defaultCode);
    }
  });
}

function loadMomentLocale(code) {
  if (code !== 'en') {
    var script = document.createElement('script');
    script.src = 'moment/locale/' + code + '.js';
    document.head.appendChild(script);
  }
  window.moment.locale(code);
  return code;
}
