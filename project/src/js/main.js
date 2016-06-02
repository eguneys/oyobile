/* application entry point */

// import './polyfills';


// for moment a global object makes loading locales easier
import moment from 'moment';
window.moment = moment;

import { loadPreferredLanguage } from './i18n';

import helper from './ui/helper';
import routes from './routes';

function main() {
  routes.init();

  // cache viewport dims
  helper.viewportDim();
}

// function handleError(event, source, fileno, columNumber) {
// }

// window.onerror = handleError;

document.addEventListener('deviceready',
                          () => loadPreferredLanguage().then(main),
                          false
                         );
