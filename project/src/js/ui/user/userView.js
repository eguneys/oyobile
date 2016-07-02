import { header as headerWidget, backButton } from '../shared/common';
import layout from '../layout';
import i18n from '../../i18n';
import helper from '../helper';
import session from '../../session';

export default function view(ctrl) {
  const user = ctrl.user();

  if (!user) return null;

  function header() {
    const title = user.username;
    return headerWidget(null, backButton(title));
  }

  function profile() {
    return (
      <div id="userProfile" className="native_scroller_page">
      </div>
    );
  }

  return layout.free(header, profile);
}
