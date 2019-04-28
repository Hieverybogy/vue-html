<template>
    <div>
        <div class="operate-area">
            <input type="file" id="ipt" v-show="false" class="file-input" @change="canvasShow = false">
            <div v-show="canvasShow" class="add-image" @click="addImage">
                <i class="icon-work"></i>
            </div>
            <div v-show="!canvasShow" class="canvas-wrapper canvas-box">
            </div>
            <div class="review-area">
                <p>头像</p>
                <div class="review-image" ref="defaultImg">
                    <img src="./photo-default.png" />
                </div>
            </div>
        </div>
        <button id="save">确定</button>
    </div>
</template>

<script>
    import ZmCanvasCrop from './zm-canvas-crop.js';
    export default {
        data() {
            return {
                canvasShow: true,
            }
        },
        watch: {},
        methods: {
            addImage() {
                this.$el.querySelector('.operate-area>.file-input').value = '';
                this.$el.querySelector('.operate-area>.file-input').click();
            },
            /* ----------------------------------------------------------- insert (增) start ----------------------------------------------------------------*/

            /* ----------------------------------------------------------- insert (增) end ----------------------------------------------------------------*/

            /* ----------------------------------------------------------- delete (删) start ----------------------------------------------------------------*/

            /* ----------------------------------------------------------- delete (删) end ----------------------------------------------------------------*/

            /* ----------------------------------------------------------- update (改) start ----------------------------------------------------------------*/

            /* ----------------------------------------------------------- update (改) end ----------------------------------------------------------------*/

            /* ----------------------------------------------------------- select (查) start ----------------------------------------------------------------*/

            /* ----------------------------------------------------------- select (查) end ----------------------------------------------------------------*/

            /* ----------------------------------------------------------- handle (操) start ----------------------------------------------------------------*/

            /* ----------------------------------------------------------- handle (操) end ----------------------------------------------------------------*/

        },
        created() {

        },
        mounted() {
            function saveCallBack(blob) {

            }
            function errorCallBack(warn) {
                this.canvasShow = true;
            }
            this.c = new ZmCanvasCrop({
                fileInput: $('#ipt')[0],
                saveBtn: $('#save')[0],
                box_width: 308, //剪裁容器的最大宽度
                box_height: 314, //剪裁容器的最大高度
                min_width: 240, //要剪裁图片的最小宽度
                min_height: 240 //要剪裁图片的最小高度
            }, saveCallBack, errorCallBack);
        }
    };
</script>

<style lang="less">
    @import './style.less';
</style>
