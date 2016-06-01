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
  var deferred = m.deferred();
  deferred.resolve('tr');
  return deferred.promise;
}
