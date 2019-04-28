<template>
    <transition name="msgbox-fade">
        <div class="zs-message-box__wrapper" v-show="value" @click.self="handleWrapperClick">
            <div class="zs-message-box" :class="customClass">
                <div class="zs-message-box__header" v-if="title !== undefined">
                    <div class="zs-message-box__title">{{ title }}</div>
                    <i class="zs-message-box__close zs-icon-close" @click="handleAction('cancel')" v-if="showClose"></i>
                </div>
                <div class="zs-message-box__content" v-if="message !== ''">
                    <!--<div class="zs-message-box__title">{{ title }}</div>-->
                    <div class="zs-message-box__message" :style="{ 'margin-left': typeClass ? '50px' : '0' }">
                        <p>{{message }}</p>
                    </div>
                </div>
                <div class="zs-message-box__btns">
                    <zs-button
                            type="default"
                            :loading="cancelButtonLoading"
                            :class="[ cancelButtonClasses ]"
                            v-show="showCancelButton"
                            @click.native="handleAction('cancel')">
                        {{ cancelButtonText }}
                    </zs-button>
                    <zs-button
                            :loading="confirmButtonLoading"
                            ref="confirm"
                            :class="[ confirmButtonClasses ]"
                            v-show="showConfirmButton"
                            @click.native="handleAction('confirm')">
                        {{ confirmButtonText }}
                    </zs-button>
                </div>
            </div>
        </div>
    </transition>
</template>

<script type="text/babel">
    import Popup from '../../src/utils/popup';
    import ZsButton from '../../button';

    let typeMap = {
        warning: 'warning1',
        wechat: 'wechat',
        delete: 'delete1'
    };

    export default {
        mixins: [Popup],

        props: {
            modal: {
                default: true
            },
            lockScroll: {
                default: true
            },
            showClose: {
                type: Boolean,
                default: true
            },
            closeOnClickModal: {
                default: true
            },
            closeOnPressEscape: {
                default: true
            }
        },

        components: {
            ZsButton
        },

        computed: {
            typeClass() {
                let ret = '';
                if (this.type) {
                    ret = typeMap[this.type] ? typeMap[this.type] : this.type;
                }
                return ret;
            },

            confirmButtonClasses() {
                return `zs-button__primary ${ this.confirmButtonClass }`;
            },
            cancelButtonClasses() {
                return `${ this.cancelButtonClass }`;
            }
        },

        methods: {
            getSafeClose() {
                const currentId = this.uid;
                return () => {
                    this.$nextTick(() => {
                        if (currentId === this.uid) this.doClose();
                    });
                };
            },
            doClose() {
                if (!this.value) return;
                this.value = false;
                this._closing = true;
                if (this.lockScroll) {
                    setTimeout(() => {
                        if (this.modal && this.bodyOverflow !== 'hidden') {
                            document.body.style.overflow = this.bodyOverflow;
                            document.body.style.paddingRight = this.bodyPaddingRight;
                        }
                        this.bodyOverflow = null;
                        this.bodyPaddingRight = null;
                    }, 200);
                }

                this.opened = false;
                this.doAfterClose();
                if (this.action) this.callback(this.action, this);
            },

            handleWrapperClick() {
                if (this.closeOnClickModal) {
                    this.action = '';
                    this.doClose();
                }
            },

            handleAction(action) {
                this.action = action;
                if (typeof this.beforeClose === 'function') {
                    this.close = this.getSafeClose();
                    this.beforeClose(action, this, this.close);
                } else {
                    this.doClose();
                }
            }

        },
        watch: {
            value(val) {
                if (val) this.uid++;
                if (this.$type === 'alert' || this.$type === 'confirm') {
                    this.$nextTick(() => {
                        this.$refs.confirm.$el.focus();
                    });
                }
            }
        },
        data() {
            return {
                uid: 1,
                title: undefined,
                message: '',
                type: '',
                customClass: '',
                showConfirmButton: true,
                showCancelButton: false,
                action: '',
                confirmButtonText: '',
                cancelButtonText: '',
                confirmButtonLoading: false,
                cancelButtonLoading: false,
                confirmButtonClass: '',
                confirmButtonDisabled: false,
                cancelButtonClass: '',
                callback: null
            };
        }
    };
</script>
