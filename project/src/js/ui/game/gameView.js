import roundView from '../round/view/roundView';
import m from 'mithril';

export default function view(ctrl) {
  if (ctrl.getRound()) return roundView(ctrl.getRound());
}
