import * as utils from '../../utils';
import * as helper from '../helper';

export default function popup(
  classes,
  headerF,
  contentF,
  isShowing,
  closef) {
  
  if (!isShowing) return null;

  const defaultClasses = {
    overlay_popup: true,
    native_scroller: true
  };
  
  let className;

  if (typeof classes === 'object') {
    className = helper.classSet(Object.assign({}, defaultClasses, classes));
  } else if (typeof classes === 'string') {
    className = helper.classSet(defaultClasses) + ' ' + classes;
  } else {
    throw new Error('First popup argument must be either a string or an object');
  }

  const contentClass = helper.classSet({
    'popup_content': true,
    'noheader': !headerF
  });

  return (
    <div key={String(contentF)} className="overlay_popup_wrapper fade-in"
    onbeforemove={(vnode) => {
      vnode.dom.classList.add('fading_out');
      return new Promise((resolve) => {
        setTimeout(resolve, 500);
      });
    }}>
      <div className="popup_overlay_close"
        oncreate={closef ? helper.ontap(closef): utils.noop }/>
      <div className={className}>
      {headerF ? <header>{headerF()}</header>: null}
        <div className={contentClass}>
          {contentF()}
        </div>
      </div>
    </div>
  );
}

// function styleConf(el) {
//   const vh = helper.viewportDim().vh;
//   const h = el.getBoundingClientRect().height;
//   const top = (vh - h) / 2;
//   // el.style.top = top + 'px';
// }

// export default function(classes, headerF, contentF, isShowing, closeF) {
//   if (!isShowing) return null;

//   const defaultClasses = {
//     overlay_popup: true,
//     native_scroller: true
//   };

//   let className;

//   if (typeof classes === 'object') {
//     className = helper.classSet(Object.assign({}, defaultClasses, classes));
//   } else if (typeof classes === 'string') {
//     className = helper.classSet(defaultClasses) + ' ' + classes;
//   } else
//     throw new Error('First popup argument must be either string or an object');

//   return (
//     <div className="overlay_popup_wrapper">
//       <div className="popup_overlay_close"
//            config={closeF ? helper.ontouch(helper.fadesOut(closeF, '.overlay_popup_wrapper')) : utils.noop } />
//       <div className={className} config={styleConf}>
//         {headerF ? <header>{headerF()}</header> : null }
//         <div className="popup_content">
//           {contentF()}
//         </div>
//       </div>
//     </div>
//   );
// }
