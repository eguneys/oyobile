import ground from '../shared/offlineRound/ground';
import makeData from '../shared/offlineRound/data';
import m from 'mithril';

export default function controller() {

  const userMove = (key) => {
    console.log(key);
  };

  const onMove = (key) => {
    console.log(key);
  };

  this.init = (data) => {
    this.data = data;
    if (!this.okeyground) {
      this.okeyground = ground.make(this.data, '', userMove, onMove);
    }
    m.redraw();
  };
  
  this.startNewGame = () => {
    this.init(makeData({}));
  };
  
  
  this.startNewGame();
}
