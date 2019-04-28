<template>
    <ul class="upload-photo-wrap clr">
        <li v-for="(image,index) in images">
            <div class="images-label" :style="{backgroundImage:`url('${image}')`}">
                <span class="image-del-icon" @click="handleDelImg(index)"></span>
            </div>
            <div v-if="append" class="top-set" @click="handleSetTopImg(index)">{{ parseFloat(appendCurr)===index ? '封面图' : '设为封面图'}}</div>
        </li>
        <li v-if="!isFull" class="upload-photo__btn">
            <label class="images-label add-label" :for="id" :class="[{'error-bor' : error}]">
                <input
                        class="imgInput"
                        :id="id"
                        type="file"
                        accept="image/gif,image/jpeg,image/png"
                        @change="handleAddImg(id)">
            </label>
        </li>
    </ul>
</template>

<script>

    export default {
        name: 'uploadPhoto',
        props: {
            images: {
                type: Array,
                default() {
                    return [];
                }
            },
            max: {
                type: [Number, String],
                default: 6
            },
            id: [String],
            error: {
                type: Boolean,
                default() {
                    return false;
                }
            },
            append: Boolean,
            appendCurr: [Number, String]
        },
        data() {
            return {
                arr: []
            };
        },
        computed: {
            isFull() {
                return this.images.length >= this.max;
            }
        },
        watch:{
            appendCurr(val){
                console.log(val);
            }
        },
        methods: {

            //添加图片
            addImg(element) {
                let _this = this;
                let file = document.getElementById(element).files[0]; //获取上传的文件
                let maxSize = 10485760; //最大10MB
                if (!file.type || file.type.split("/")[0] != "image") {
                    _this.$message({
                        message: this.$i18n.locale == 'cn' ?  '文件类型错误,请上传图片' : 'File type error, Please upload pictures',
                        duration: 1500
                    });
                    return;
                } else if (parseInt(file.size) >= parseInt(maxSize)) {
                    _this.$message({
                        message: this.$i18n.locale == 'cn' ? "上传的文件不能超过10MB":"Upload files cannot exceed 10MB",
                        duration: 1500
                    });
                    return;
                } else {
                    let elemFile = document.getElementById(element);
                    let fileTemp = elemFile.value.split("/");
                    let fileName =
                        JSON.stringify(new Date().getTime()) + fileTemp[fileTemp.length - 1];
                    comFn.ajax({
                        self: _this,
                        url: "/public/upload",
                        data: {
                            fileName: fileName,
                            size: elemFile.files[0].size
                        },
                        success(res) {
                            _this.uploadBank(res, fileName, element);
                        },
                        error(err) {}
                    });
                }
            },
            uploadBank(params, fileName, element) {
                let _this = this;
                let file = document.getElementById(element).files[0]; // 每次只允许上传一张图片，因此只取[0]
                let token = params.token;
                let url = params.serverAddress;
                let formData = new FormData();
                formData.append("fileName", file);
                $.ajax({
                    url:
                    url +
                    "/mc/post/" +
                    token +
                    "?fileName=" +
                    fileName +
                    "&appKey=" +
                    "params.appKey",
                    type: "POST",
                    cache: false,
                    data: formData,
                    processData: false,
                    contentType: false
                }).done(function(result) {
                    if (result.success) {
                        $(`#${element}`).val('');
                        _this.$emit('change',result.domain[0]);
                    } else {
                        _this.$message({
                            message: this.$i18n.locale == 'cn' ?'上传失败':'UPLOAD FAILED',
                            duration: 1500
                        })
                    }
                });
            },

            //添加图片
            handleAddImg(element) {
                let _this = this;
                let file = document.getElementById(element).files[0]; //获取上传的文件
                let maxSize = 10485760; //最大10MB
                if (!file.type || file.type.split("/")[0] != "image") {
                    _this.$message({
                        message: _this.$i18n.locale == 'cn' ? "文件类型错误,请上传图片":'File type error, Please upload pictures',
                        duration: 1500
                    });
                    return;
                } else if (parseInt(file.size) >= parseInt(maxSize)) {
                    _this.$message({
                        message: _this.$i18n.locale == 'cn' ? "上传的文件不能超过10MB":'Upload files cannot exceed 10MB',
                        duration: 1500
                    });
                    return;
                } else {

                    let formData = new FormData();
                    formData.append("file", file);

                    comFn.upload({
                        self: _this,
                        data: formData,
                        success(res) {
                            $(`#${element}`).val('');
                            _this.$emit('change',res.data);
                        }
                    });
                }
            },

            handleDelImg(index) {
                this.$confirm({
                    type: 'delete2',
                    message: this.$i18n.locale == 'cn' ?'确认删除该图片？':'Are you want to delete this image?',
                    cancelButtonText: this.$i18n.locale == 'cn' ?'取消':'CANCEL',
                    confirmButtonText: this.$i18n.locale == 'cn' ?'确定':'OK',
                }).then(() => {
                    this.$emit('delete', index);
                }).catch(() => {
                });

            },
            handleSetTopImg(index){
                this.$emit('getIndex',index);
            }
        }
    };
</script>
<style lang="less">
    @import './style.less';
</style>