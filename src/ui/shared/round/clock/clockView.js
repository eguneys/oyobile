import h from 'mithril/hyperscript';

export default {
  oninit({attrs}) {
    const { ctrl, side } = attrs;

    this.clockOnCreate = ({dom}) => {
      ctrl.elements[side] = dom;
      ctrl.updateElement(side, ctrl.millisOf(side));
    };
    this.clockOnUpdate = ({dom}) => {
      ctrl.elements[side] = dom;
      ctrl.updateElement(side, ctrl.millisOf(side));
    };
  },

  view({attrs}) {

    return h('div', { className: 'bar' }, [
      h('span', {
        className: 'bar2',
        oncreate: this.clockOnCreate,
        onupdate: this.clockOnUpdate
      })
    ]);
  }
};
