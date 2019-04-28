<template>
    <div class="unpower">
        <div class="email-img"></div>
        <p class="email-err">{{$t("menu.unPower")}}</p>
    </div>
</template>

<script>
    import {turnToNextPage, getCookie} from "../../assets/js/utils";
    export default {
        name: 'unpower',
        props: {
            show: {
                type: Boolean,
                default: false
            },
        },
        data() {
            return {
                power: [],
            };
        },
        computed: {

        },
        watch:{

        },
        methods: {

        },
        mounted() {
            this.power = localStorage.menu ? JSON.parse(localStorage.menu) : [];
            if(this.show){
                let _url = window.location.pathname ? window.location.pathname.split('/home/')[1] : '';
                if(this.power.indexOf(_url)===-1){
                    setTimeout(()=>{
                        turnToNextPage('/open/login.html');
                    },1000);
                }
            }
        }
    };
</script>
<style lang="less">
    @import './style.less';
</style>