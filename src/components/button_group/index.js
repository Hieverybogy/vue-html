import ZsButtonGroup from './src/button-group';

/* istanbul ignore next */
ZsButtonGroup.install = function(Vue) {
  Vue.component(ZsButtonGroup.name, ZsButtonGroup);
};

export default ZsButtonGroup;
