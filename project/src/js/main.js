/* application entry point */

// import './polyfills';
import { loadPreferredLanguage } from './i18n';
import routes from './routes';

function main() {
  routes.init();
}

// function handleError(event, source, fileno, columNumber) {
// }

// window.onerror = handleError;

document.addEventListener('deviceready',
                          () => loadPreferredLanguage().then(main),
                          false
                         );
