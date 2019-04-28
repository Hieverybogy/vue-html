<template>
    <transition name="zs-dialog-fade">
        <div class="zs-dialog__wrapper" v-show="value" @click.self="handleWrapperClick">
            <div
                    class="zs-dialog"
                    :class="[sizeClass, customClass]"
                    id="zs-dialog"
                    ref="dialog">
                <div class="zs-dialog__header">
                    <slot name="title">
                        <span class="zs-dialog__title">{{title}}</span>
                    </slot>
                    <div class="zs-dialog__headerbtn">
                        <i v-if="showClose" class="zs-dialog__close zs-icon zs-icon-close" @click='close()'></i>
                    </div>
                </div>
                <div class="zs-dialog__body" v-if="rendered">
                    <slot></slot>
                </div>
                <div class="zs-dialog__footer" v-if="$slots.footer">
                    <slot name="footer"></slot>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    import Popup from '../../src/utils/popup';

    export default {
        name: 'ZsDialog',

        mixins: [Popup],

        props: {
            title: {
                type: String,
                default: ''
            },

            modal: {
                type: Boolean,
                default: true
            },

            modalAppendToBody: {
                type: Boolean,
                default: true
            },

            lockScroll: {
                type: Boolean,
                default: true
            },

            closeOnClickModal: {
                type: Boolean,
                default: true
            },

            closeOnPressEscape: {
                type: Boolean,
                default: true
            },

            showClose: {
                type: Boolean,
                default: true
            },

            size: {
                type: String,
                default: 'small'
            },

            customClass: {
                type: String,
                default: ''
            },

            top: {
                type: String,
                default: '15%'
            }
        },

        watch: {
            value(val) {
                this.$emit('input', val);
                if (val) {
                    this.$emit('open');
                    this.$nextTick(() => {
                        this.$refs.dialog.scrollTop = 0;
                    });
                    setTimeout(()=>{
                        /* 处理奇偶数+select弹窗糊掉的问题 */
                        let oldWidth = parseInt(window.getComputedStyle(this.$refs.dialog).width);
                        if(oldWidth%2 !== 0){
                            oldWidth= oldWidth + 1;
                        }
                        this.$refs.dialog.style.width = oldWidth + 'px';
                        /* 处理高度超过浏览器问题的问题 */
                        let height = parseInt(window.getComputedStyle(this.$refs.dialog).height);
                        let winHeight = parseInt(document.body.clientHeight);
                        if(winHeight - height < 60){
                            this.$refs.dialog.style.top = '30px';
                            this.$refs.dialog.style.transform = 'translate(-50%, 0)';
                            this.$refs.dialog.style.marginBottom = '30px';
                        }
                    },50)


                } else {
                    this.$emit('close');
                }
            }
        },
        computed: {
            sizeClass() {
                return `zs-dialog__${ this.size }`;
            }
        },

        methods: {
            handleWrapperClick() {
                if (this.closeOnClickModal) {
                    this.close();
                }
            }
        },

        mounted() {
            if (this.value) {
                this.rendered = true;
                this.open();
            }
        }
    };
</script>
