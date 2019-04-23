import h from 'mithril/hyperscript';

import i18n from '../../i18n';
import redraw from '../../utils/redraw';
import * as helper from '../helper';

export default {
  renderSelect(
    label,
    name,
    options,
    settingsProp,
    isDisabled,
    onChangeCallback) {
    const prop = settingsProp();
    return [
      h('label', {
        'for': 'select_' + name
      }, i18n(label)),
      h('select', {
        id: 'select_' + name,
        disabled: isDisabled,
        onchange(e) {
          const val = e.target.value;
          settingsProp(val);
          if (onChangeCallback) onChangeCallback(val);
          setTimeout(redraw, 10);
        }
      }, options.map(e => renderOption(e[0], e[1], prop, e[2], e[3])))
    ];
  }
};

function renderOption(label, value, prop, labelArg, labelArg2) {
  const l = labelArg && labelArg2 ? i18n(label, labelArg, labelArg2) :
          labelArg ? i18n(label, labelArg) : i18n(label);
  return h('option', {
    key: value,
    value,
    selected: prop === value
  }, l);
}

// import i18n from '../../i18n';
// import m from 'mithril';

// function renderOption(label, value, storedValue, labelArg, labelArg2) {
//   return m('option', {
//     value: value,
//     selected: storedValue === value
//   }, i18n(label, labelArg, labelArg2));
// }

// export default {
//   renderRadio: function(label, name, value, checked, onchange) {
//     var id = name + '_' + value;
//     return [
//       m('input.radio[type=radio]', {
//         name,
//         id,
//         className: value,
//         value,
//         checked,
//         onchange
//       }),
//       m('label', {
//         'for': id
//       }, i18n(label))
//     ];
//   },

//   renderSelect: function(label, name, options, settingsProp, isDisabled, onChangeCallback) {
//     var storedValue = settingsProp();
//     return [
//       m('label', {
//         'for': 'select_' + name
//       }, i18n(label)),
//       m('select', {
//         id: 'select_' + name,
//         disabled: isDisabled,
//         config: function(el, isUpdate, context) {
//           if (!isUpdate) {
//             var onChange = function(e) {
//               settingsProp(e.target.value);
//               if (onChangeCallback) onChangeCallback(e.target.value);
//               setTimeout(function() {
//                 m.redraw();
//               }, 10);
//             };
//             el.addEventListener('change', onChange, false);
//             context.onunload = () => {
//               el.removeEventListener('change', onChange, false);
//             };
//           }
//         }
//       }, options.map(function(e) {
//         return renderOption(e[0], e[1], storedValue, e[2], e[3]);
//       }))
//     ];
//   },
//   renderCheckbox: function(label, name, settingsProp, callback, disabled) {
//     var isOn = settingsProp();
//     return m('div.check_container', {
//       className: disabled ? 'disabled': ''
//     }, [
//       m('label', {
//         'for': name
//       }, label),
//       m('input[type=checkbox]', {
//         name: name,
//         disabled,
//         checked: isOn,
//         onchange: function() {
//           const newVal = !isOn;
//           settingsProp(newVal);
//           if (callback) callback(newVal);
//         }
//       })
//     ]);
//   }
// };
