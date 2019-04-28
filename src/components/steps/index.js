import ZsSteps from './src/steps';

/* istanbul ignore next */
ZsSteps.install = function(Vue) {
  Vue.component(ZsSteps.name, ZsSteps);
};

export default ZsSteps;
