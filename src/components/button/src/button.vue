<template>
    <button :disabled="disabled" class="zs-button"
            @click="handleClick"
            :autofocus="autofocus"
            :type="nativeType"
            :class="[
      type ? 'zs-button__' + type : '',
      size ? 'zs-button__' + size : '',
      {
        'is-disabled': disabled,
        'is-loading': loading,
        'is-plain': plain
      }
    ]"
    >
        <i class="zs-icon__loading" v-if="loading"></i>
        <i :class="'zs-icon-' + icon" v-if="icon && !loading"></i>
        <slot></slot>
    </button>
</template>
<script>
    export default {
        name : 'ZsButton',

        props : {
            type : {
                type : String,
                default : 'default'
            },
            size : String,
            icon : {
                type : String,
                default : ''
            },
            nativeType : {
                type : String,
                default : 'button'
            },
            loading : Boolean,
            disabled : Boolean,
            plain : Boolean,
            autofocus : Boolean
        },

        methods : {
            handleClick(evt) {
                this.$emit('click', evt);
            }
        }
    };
</script>
