import ZsStep from '../steps/src/step';

/* istanbul ignore next */
ZsStep.install = function(Vue) {
    Vue.component(ZsStep.name, ZsStep);
};

export default ZsStep;