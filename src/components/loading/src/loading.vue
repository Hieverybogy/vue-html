<template>
    <transition name="zs-loading-fade" @after-leave="handleAfterLeave">
        <div id="publicLoading" style="background:rgba(0,0,0,0.3);position:fixed;top:0;bottom:0;left:0;right:0;width:100%;height:100%;z-index:99999;"  v-show="visible">
            <div class="spinner">
                <div class="rect1"></div>
                <div class="rect2"></div>
                <div class="rect3"></div>
                <div class="rect4"></div>
                <div class="rect5"></div>
            </div>
        </div>
    </transition>
</template>

<script>
    export default {
        data() {
            return {
                visible: false,
                fullscreen : true,
            }
        },
        methods: {
            handleAfterLeave() {
                this.$emit('after-leave');
            }
        }
    };
</script>

<style>
    #publicLoading .spinner {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 100%;
        height: 80px;
        text-align: center;
        font-size: 20px;
    }

    #publicLoading .spinner > div {
        background-color: #fff;
        height: 100%;
        width: 6px;
        display: inline-block;
        -webkit-animation: stretchdelay 1.2s infinite ease-in-out;
        animation: stretchdelay 1.2s infinite ease-in-out;
    }

    #publicLoading .spinner .rect2 {
        -webkit-animation-delay: -1.1s;
        animation-delay: -1.1s;
    }

    #publicLoading .spinner .rect3 {
        -webkit-animation-delay: -1.0s;
        animation-delay: -1.0s;
    }

    #publicLoading .spinner .rect4 {
        -webkit-animation-delay: -0.9s;
        animation-delay: -0.9s;
    }

    #publicLoading .spinner .rect5 {
        -webkit-animation-delay: -0.8s;
        animation-delay: -0.8s;
    }

    @-webkit-keyframes stretchdelay {
        0%, 40%, 100% { -webkit-transform: scaleY(0.4) }
        20% { -webkit-transform: scaleY(1.0) }
    }

    @keyframes stretchdelay {
        0%, 40%, 100% {
            transform: scaleY(0.4);
            -webkit-transform: scaleY(0.4);
        }
        20% {
               transform: scaleY(1.0);
               -webkit-transform: scaleY(1.0);
        }
    }
    .zs-dialog-fade-enter-active {
         animation: dialog-fade-in .3s;
     }

    .zs-dialog-fade-leave-active {
         animation: dialog-fade-out .3s;
     }

    @keyframes dialog-fade-in {
        0% {
            transform: translate3d(0, -20px, 0);
            opacity: 0;
        }
        100% {
            transform: translate3d(0, 0, 0);
            opacity: 1;
        }
    }

    @keyframes dialog-fade-out {
        0% {
            transform: translate3d(0, 0, 0);
            opacity: 1;
        }
        100% {
            transform: translate3d(0, -20px, 0);
            opacity: 0;
        }
    }
</style>
