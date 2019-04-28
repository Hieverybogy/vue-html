<template>
    <div class="zs-message__wrap">
        <transition name="zs-message-fade">
            <div
                    class="zs-message"
                    :class="customClass"
                    v-show="visible"
                    @mouseenter="clearTimer"
                    @mouseleave="startTimer">
                <p style="line-height: 0">
                    <zs-icon class="zs-message__icon" :icon="iconType" icon-dis="10" size="18"
                             :text="message"></zs-icon>
                </p>
            </div>
        </transition>
    </div>
</template>
<script>
    import zsIcon from '../../icon/index.js';

    const typeMap = {
        error: 'error',
        success: 'success',
        warning: 'warning',
        danger: 'warning'
    };
    export default {
        components: { zsIcon },
        data() {
            return {
                visible: false,
                message: '',
                duration: 1200,
                type: 'info',
                customClass: '',
                onClose: null,
                showClose: false,
                closed: false,
                timer: null
            };
        },

        computed: {
            iconType() {
                return this.type && typeMap[this.type] ? typeMap[this.type] : '';
            }
        },

        watch: {
            closed(newVal) {
                if (newVal) {
                    this.visible = false;
                    this.$el.addEventListener('transitionend', this.destroyElement);
                    this.$destroy(true);
                    this.$el.parentNode.removeChild(this.$el);
                }
            }
        },

        methods: {
            destroyElement() {
                this.$el.removeEventListener('transitionend', this.destroyElement);

            },

            close() {
                this.closed = true;
                if (typeof this.onClose === 'function') {
                    this.onClose(this);
                }
            },

            clearTimer() {
                clearTimeout(this.timer);
            },

            startTimer() {
                if (this.duration > 0) {
                    this.timer = setTimeout(() => {
                        if (!this.closed) {
                            this.close();
                        }
                    }, this.duration);
                }
            }
        },

        mounted() {
            this.startTimer();
        }
    };
</script>
