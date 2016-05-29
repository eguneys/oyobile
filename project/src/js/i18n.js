import m from 'mithril';

var messages = [];

export function loadPreferredLanguage() {
  var deferred = m.deferred();
  deferred.resolve('tr');
  return deferred.promise;
}
