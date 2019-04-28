<template>
  <div class="zs-radio-group">
    <slot></slot>
  </div>
</template>
<script>
  import Emitter from '../../src/utils/emitter';

  export default {
    name: 'ZsRadioGroup',

    componentName: 'ZsRadioGroup',

    mixins: [Emitter],

    props: {
      value: {},
      size: String,
      fill: String,
      textColor: String,
      disabled: Boolean
    },
    watch: {
      value(value) {
        this.$emit('change', value);
        this.dispatch('ZsFormItem', 'el.form.change', [this.value]);
      }
    }
  };
</script>

