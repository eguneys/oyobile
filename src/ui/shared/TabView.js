import h from 'mithril/hyperscript';
import { viewportDim } from '../helper';

export default {
  oncreate({attrs, dom}) {
  },

  view({attrs}) {
    const curIndex = attrs.selectedIndex;
    const vw = viewportDim().vw;
    const width = attrs.content.length * 100;
    const shift = -(curIndex * vw);

    const style = {
      width: `${width}vw`,
      transform: `translateX(${shift}px)`
    };
    
    return h('div.tabs-view-wrapper', h('div.tabs-view', {
      style,
      className: attrs.className
    }, attrs.content.map((_, index) =>
                         h('div.tab-content', {
                           'data-index':index,
                           className: curIndex === index ? 'current':''
                         }, curIndex === index ? h(Tab, { index, ...attrs }) : null)
                        ))
            );
    
  }

}

const Tab = {
  onbeforeupdate({attrs}, {attrs: oldattrs }) {
    return attrs.content[attrs.index] !== oldattrs.content[oldattrs.index];
  },

  view({attrs}) {
    return attrs.renderer(attrs.content[attrs.index], attrs.index);
  }
}
