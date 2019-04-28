<template>
    <div class="zs-checkbox-group">
        <slot></slot>
    </div>
</template>
<script>
    import Emitter from '../../src/utils/emitter';

    export default {
        name : 'ZsCheckboxGroup',

        componentName : 'ZsCheckboxGroup',

        mixins : [Emitter],

        props : {
            value : {}
        },

        watch : {
            value(value) {
                this.dispatch('ZsFormItem', 'el.form.change', [value]);
            }
        }
    };
</script>


