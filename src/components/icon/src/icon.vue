<template>
    <p class="icon_wrap" :style="wrapStyle" @click="handleClick">
        <i
                :class="'zs-icon_' + icon"
                :style="iconStyle"
                v-if="icon"
                @click="handleIconClick">{{ firstLetter }}</i>
        <i
                :class="'zs-icon_' + icon2"
                :style="[iconStyle,icon2Style]"
                v-if="icon2"
                @click="handleIconClick">{{ _icon2 }}</i>
        <span v-if="text" v-html="text" @click="handleTextClick"></span>
        <i
                class="zs-right-icon"
                :class="'zs-icon_' + rightIcon"
                :style="iconStyle" v-if="rightIcon"
                @click="handleRightIconClick"></i>
    </p>
</template>

<script>
    import { isChinese } from '../../../assets/js/utils';
    export default {
        name: 'ZsIcon',

        props: {
            icon: String,
            iconDis: {
                type: [String, Number],
                default: 6
            },
            icon2: String,
            iconBackGround: {
                type: String,
                default: '#f39114'
            },
            icon2BackGround: {
                type: String,
                default: '#1daae5'
            },
            rightIconDis: {
                type: [String, Number],
                default: 6
            },
            rightIcon: String,
            size: {
                type: [String, Number],
                default: 14
            },
            text: {
                type: [String, Number],
                default: ''
            }
        },
        computed: {
            wrapStyle(){
                let style = {};
                style.paddingLeft = this.icon && this.text ? `${parseInt(this.size) + parseInt(this.iconDis)}px` : 0;
                if (this.icon2 && this.text) {
                    style.paddingLeft = `${parseInt(this.size) * 2 + parseInt(this.iconDis) * 2}px`;
                }
                style.paddingRight = this.rightIcon && this.text ? `${parseInt(this.size) + parseInt(this.rightIconDis)}px` : 0;
                style.minHeight = this.icon ? `${parseInt(this.size)}px` : 0;
                style.minWidth = this.icon ? `${parseInt(this.size)}px` : 0;
                style.lineHeight = `${parseInt(this.size)}px`;
                return style;
            },
            iconStyle(){
                let style = {};
                style.width = style.height = `${parseInt(this.size)}px`;
                if (this.icon === 'first-letter' || (this.icon && isChinese(this.icon))) {
                    style.backgroundColor = this.iconBackGround;
                    style.borderRadius = '2px';
                    style.lineHeight = `${parseInt(this.size)}px`;
                    style.fontSize = '12px';
                }
                return style;
            },
            icon2Style(){
                let style = {};
                if (this.icon2 && isChinese(this.icon2)) {
                    style.backgroundColor = this.icon2BackGround;
                    style.left = `${parseInt(this.size) + parseInt(this.iconDis)}px`;
                }
                return style;
            },
            firstLetter(){
                if (this.icon == 'first-letter') {
                    return this.text[0];
                } else if (isChinese(this.icon)) {
                    return this.icon[0];
                } else {
                    return '';
                }
            },
            _icon2(){
                if (isChinese(this.icon2)) {
                    return this.icon2[0];
                } else {
                    return '';
                }
            }
        },
        methods: {
            handleClick(event){
                this.$emit('click', event);
            },
            handleIconClick(){
                this.$emit('on-icon-click');
            },
            handleRightIconClick(){
                this.$emit('on-right-icon-click');
            },
            handleTextClick(){
                this.$emit('on-text-click');
            }
        }

    };
</script>
<style scoped>
    .icon_wrap {
        position: relative;
        display: inline-block;
    }

    .icon_wrap i {
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        background-position: center center;
        background-size: contain;
        background-repeat: no-repeat;
        text-align: center;
        color: #fff;
    }

    .icon_wrap .zs-right-icon {
        left: auto;
        right: 0;
        top: 50%;
    }

    .icon_wrap span {
        white-space: nowrap;
    }

    /*以下是具体图标*/

    .zs-icon_arrow-left {
        border-top: 1px solid #999;
        border-left: 1px solid #999;
        transform: translateY(-50%) translateX(25%) rotate(-45deg) !important;
    }

    .zs-icon_arrow-right {
        border-top: 1px solid #999;
        border-right: 1px solid #999;
        transform: translateY(-50%) translateX(-25%) rotate(45deg) !important;
    }

    .zs-icon_arrow-top {
        border-top: 1px solid #999;
        border-right: 1px solid #999;
        transform: translateY(-20%) rotate(-45deg) !important;
    }

    .zs-icon_arrow-bottom {
        border-top: 1px solid #999;
        border-right: 1px solid #999;
        transform: translateY(-75%) rotate(135deg) !important;
    }

    [class^='zs-icon_dot']:before {
        content: '';
        position: absolute;
        border-radius: 50%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .zs-icon_dot:before {
        width: 5px;
        height: 5px;
        background-color: #0696f5;
    }

    .zs-icon_dot-large:before {
        width: 6px;
        height: 6px;
        background-color: #0696f5;
    }

    .zs-icon_dot-gray:before {
        width: 5px;
        height: 5px;
        background-color: #b5aea4;
    }

    .zs-icon_dot-large-gray:before {
        width: 6px;
        height: 6px;
        background-color: #b5aea4;
    }

    [class^='zs-icon_caret'] {
        width: 0 !important;
        height: 0 !important;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
    }

    .zs-icon_caret-top {
        border-bottom: 6px solid #b1b2b4;
    }

    .zs-icon_caret-bottom {
        border-top: 6px solid #b1b2b4;
    }
    .zs-icon_caret-bottom-size {
        width: 0 !important;
        height: 0 !important;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 6px solid #b1b2b4;
    }

    .zs-icon_ten-cross:before {
        content: '';
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        height: 2px;
        background-color: #fff;
    }

    .zs-icon_ten-cross:after {
        content: '';
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        height: 100%;
        width: 2px;
        background-color: #fff;
    }

    .zs-icon_circle-cross {
        background-image: url('../assets/circle-cross.png');
    }

    .zs-icon_circle-cross-red {
        background-image: url('../assets/circle-cross-red.png');
    }

    .zs-icon_delete {
        background-image: url('../assets/delete.png');
    }

    .zs-icon_success {
        background-image: url('../assets/success.png');
    }

    .zs-icon_no-allow {
        background-image: url('../assets/no_allow.png');
    }

    .zs-icon_alert {
        background-image: url('../assets/alert.png');
    }

    .zs-icon_error {
        background-image: url('../assets/error.png');
    }

    .zs-icon_warning {
        background-image: url('../assets/warning.png');
    }

    .zs-icon_add {
        background-image: url('../assets/add.png');
    }

    .zs-icon_add2 {
        background-image: url('../assets/add2.png');
    }


    .zs-icon_password {
        background-image: url('../assets/password.png');
    }

    .zs-icon_danger {
        background-image: url('../assets/danger.png');
    }

    .zs-icon_time {
        background-image: url('../assets/time.png');
    }

    .zs-icon_del2 {
        background-image: url('../assets/delete2.png');
    }

    .zs-icon_pic {
        background-image: url('../assets/pic.png');
    }


</style>