import redraw from '../../../utils/redraw';
import router from '../../../router';

export default function(ctrl) {
  return {
    reload: ctrl.reload,
    redirect(gameId) {
      // doesn't fire for new join
      console.log("redirect"+gameId);
    }
  };
}
