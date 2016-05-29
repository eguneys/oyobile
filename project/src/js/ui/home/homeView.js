import layout from '../layout';
import helper from '../helper';
import { header as headerWidget } from '../shared/common';
import m from 'mithril';

export default function homeView(ctrl) {
  function body() {
    return (
      <div className="native_scroller page">
        <div className="home">
          <section>
          </section>
          <section id="homeCreate">
            <button className="fatButton" config={helper.ontouch(() => m.route('/otb'))}>'i18ncreateAGame'</button>
          </section>
        </div>
      </div>
    );    
  }

  const header = headerWidget.bind(null, 'oyunkeyf.net');

  return layout.free(header, body);
}
