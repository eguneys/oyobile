import backbutton from '../../backbutton';
import helper from '../helper';

export default {
  controller: function(masa) {
    let isOpen = false;

    function open() {
      backbutton.stack.push(close);
      isOpen = true;
    }
    function close(fromBB) {
      if (fromBB !== 'backbutton' && isOpen) backbutton.stack.pop();
      isOpen = false;
    }

    return {
      open,
      close,
      isOpen: function() { return isOpen; },
      masa
    };
  },
  view: function(ctrl) {
    
  }
};
