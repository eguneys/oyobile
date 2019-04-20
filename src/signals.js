import { Signal } from 'signals';


export default {

  redraw: new Signal(),

  afterLogin: new Signal(),

  afterLogout: new Signal(),

  sessionRestored: new Signal()

};
