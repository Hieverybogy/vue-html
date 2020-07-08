<template>
    <div class="output-file-list-container">
        <table @click.stop ref="tableEl" bordercolor="#c0ccda" :frame="frame || 'border'" :rules="rules || 'all'">
            <colgroup>
                <col :width="o1.width" v-for="(o1, i1) in dataForm" :key="i1" />
            </colgroup>
            <thead>
                <tr>
                    <th v-for="(o1, i1) in dataForm" :key="i1" :align="o1.align" :class="[{first : i1===0}]">
                        <i class="icon-file" v-if="i1===0"></i>
                        {{o1.title}}
                    </th>
                </tr>
            </thead>
            <tbody>
                <template v-if="dataList && dataList.length>0">
                    <tr v-for="(o1, i1) in dataList" :key="i1">
                        <td
                            v-for="(o2, i2) in dataForm"
                            :align="o2.align"
                            :key="i2"
                        >
                            <span v-if="o2._key === 'title' && o2.isLink" class="isLink" @click="handleLink(o1, o2)">{{handleLable(o1[o2.key], o2)}}</span>
                            <template v-else-if="o2._key === 'time'">{{$dateFormat("yyyy-MM-dd hh:mm:ss", o1[o2.key])}}</template>
                            <template v-else-if="o2._key === 'size'">{{setSize(o1[o2.key])}}</template>
                            <template v-else>{{handleLable(o1[o2.key], o2)}}</template>
                        </td>
                    </tr>
                </template>
                <template v-else>
                    <tr>
                        <td align="center" :colspan="dataForm.length" style="color: #999">暂无数据</td>
                    </tr>
                </template>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    inject: ["flowForm"],
    props: {
        dataForm: {
            type: [Array, Object],
            default() {
                return []
            }
        },
        dataList: {
            type: [Array, Object],
            default() {
                return []
            }
        },
        frame: String,
        rules: String
    },
    data() {
        return {
        };
    },
    computed: {
    },
    watch: {},
    methods: {
        handleLink(o1, o2) {
            if (o2.linkType === 'normal') { 
                this.preview(o1, o2)
            } else if (o2.linkType === 'link') {
                o2.linkPath && this.$utils.innerOpen(o2.linkPath);
            } else if (o2.linkType === 'method') {
                this.flowForm.$refs.flowFormView && this.flowForm.$refs.flowFormView[o2.linkMethod] && 
                    (this.flowForm.$refs.flowFormView[o2.linkMethod]())
            }
        },
        handleLable(val, o2) {
            const {useMatch, matchOptions} = o2
            if (!useMatch || useMatch === 'none') {
                return val
            } 

            // useMatch === 'dataSource'
            if (!matchOptions) {
                return val
            }
            let obj = matchOptions.find(item => {
                return item.value === val.toString()
            })
            return obj ? obj.label : val
        },
        setSize(item) {
            if (!item.size) {
                return "0 KB";
            }

            var size = Math.ceil(item.size / 1024);
            if (size >= 1024) {
                return (size / 1024).toFixed(2) + " MB";
            }

            return size + " KB";
        },
        // 文件查看
        preview (o1, o2) {
            if (!o1) return
            var name = this.handleLable(o1[o2.key], o2)

            var types =
                [".jpg", ".gif", ".jpeg", ".png", ".psd", ".svg", ".bmp"].join(
                    "$|"
                ) + "$";
            var reg = new RegExp(types, "ig");
            if (reg.test(o1.extension)) {
                Vue.setImagePrew(o1.filePath);
            } else {
                this.download(o1);
            }
        },
        download(item) {
            window.location.href = this.getExportUrl(item);
        },

        getExportUrl(item) {
            var token = this.$getToken()
            var aHref =
                `/${this.$webConfig.version}/file/export/download/${item.cloudFileId || item.id}` +
                (`/${this.$webConfig.version}/file/export/download/${item.cloudFileId || item.id}`.indexOf('?') > -1 ? '&' : '?') +
                'access_token=' + token

            // 没自带http:// 即使用base的url
            if (`/${this.$webConfig.version}/file/export/download/${item.cloudFileId || item.id}`.indexOf('http://') === -1 && 
                `/${this.$webConfig.version}/file/export/download/${item.cloudFileId || item.id}`.indexOf('https://') === -1) {
                aHref = this.$webConfig.fileServer + aHref
            }

            return aHref
        },
    },
    created() {},
    mounted() {
        // 把父级的margin-left去掉（为了吧标题挤上去）
        let el = this.$el.parentNode
        el.style.marginLeft = 0
        el.previousElementSibling && el.previousElementSibling.className === 'el-form-item__label' && (el.previousElementSibling.style.width = '100%')
    },
    beforeCreate() {

        if (Vue.setImagePrew) {
            return;
        }

        Vue.setImagePrew = function(path) {
            var dom = document.querySelector(".sapi-prew-box-img"),
                parent;
            var imgPath = `${this.$webConfig.filePreviewPath}`;
            if (!dom) {
                var ele = document.createElement("div");
                ele.className = "sapi-prew active";
                ele.innerHTML =
                    "<div class='sapi-prew-box'><img class='sapi-prew-box-img' src='"+ imgPath + path + '?_=' + new Date().getTime() +"' /></div>";
                document.body.appendChild(ele);
                parent = document.querySelector(".sapi-prew");
            } else {
                dom.src =  imgPath + path + '?_=' + new Date().getTime()
                parent = dom.parentNode.parentNode;
                parent.className = parent.className + " active";
            }

            function hideImage() {
                this.className = this.className.replace(/ active/g, "");
                this.removeEventListener("click", hideImage);
            }
            parent.addEventListener("click", hideImage, false);
            parent = null;
        };
    },
};
</script>

<style lang="less" scope>
@import "~@/static/css/sapi-variables";

.output-file-list-container{
    >table{
        width: 100%;
        border-collapse: collapse;
        // border: 1px solid #c0ccda;
        table-layout: fixed;
        // margin-bottom: 20px;
        >thead {
            background-color: #f8f8f8;
            >tr {
                >th{
                    padding: 0 10px;
                    // border: 1px solid #c0ccda;
                    height: 36px;
                    min-height: 36px;
                    box-sizing: border-box;
                    font-size: 13px;
                    line-height: 24px;
                    &.first{
                        color: @--color-primary;
                        .icon-file{
                            vertical-align: middle;
                            margin-top: -3px;
                            display: inline-block;
                            width: 16px;
                            height: 16px;
                            text-align: center;
                            color: #fff;
                            background-position: center;
                            background-size: cover;
                            border-radius: 1px;
                            margin-right: 5px;
                            -ms-flex-negative: 0;
                            flex-shrink: 0;
                            background-image: url('~@/static/images/file.png');
                        }
                    }
                }
            }
        }
        >tbody{
            >tr{
                > td {
                    // border: 1px solid #c0ccda;
                    height: 36px;
                    min-height: 36px;
                    padding: 0 10px;
                    box-sizing: border-box;
                    font-size: 13px;
                    line-height: 24px;
                    word-break: break-all;

                    .isLink{
                        cursor: pointer;
                        color: @--color-primary;

                        &:hover{
                            text-decoration: underline;
                        }
                    }
                }
            }
        }
       
    }
}
</style>
