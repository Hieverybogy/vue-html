<template>
    <div class="output-subform-list-container">
        <table @click.stop ref="tableEl" bordercolor="#c0ccda" :frame="frame || 'border'" :rules="rules || 'all'">
            <colgroup>
                <col :width="o1.width" v-for="(o1, i1) in dataForm" :key="i1" />
            </colgroup>
            <thead>
                <tr>
                    <th v-for="(o1, i1) in dataForm" :key="i1" :align="o1.align">
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
                            <span v-if="o2.isLink" class="isLink" @click="handleLink(o2)">{{handleLable(o1[o2.key], o2)}}</span>
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
        handleLink(o2) {
            if (o2.linkType === 'link') {
                this.$utils.innerOpen(o2.linkPath);
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
        }
    },
    created() {},
    mounted() {
        // 把父级的margin-left去掉（为了吧标题挤上去）
        let el = this.$el.parentNode
        el.style.marginLeft = 0
        el.previousElementSibling && el.previousElementSibling.className === 'el-form-item__label' && (el.previousElementSibling.style.width = '100%')
    },
};
</script>

<style lang="less" scope>
@import "~@/static/css/sapi-variables";

.output-subform-list-container{
    >table{
        width: 100%;
        border-collapse: collapse;
        // border: 1px solid #c0ccda;
        table-layout: fixed;
        // margin-bottom: 20px;
        >thead {
            background-color: #eff2f7;
            >tr {
                >th{
                    padding: 0 10px;
                    // border: 1px solid #c0ccda;
                    height: 35px;
                    min-height: 35px;
                    box-sizing: border-box;
                    font-size: 13px;
                    line-height: 24px;
                    background: #eff2f7;
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
                >td {
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
