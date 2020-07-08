<template>
    <div class="output-table-container">
        <table @click.stop  ref="tableEl">
            <colgroup v-if="colgroup && colgroup.length>0">
                <col :width="col.width" v-for="(col, c1) in colgroup" :key="c1" />
            </colgroup>
            <thead v-if="isShowThead">
                <tr>
                    <th v-for="(o1, i1) in headLabel" :key="i1" :align="o1.align">{{o1.title}}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(o1, i1) in dataForm" :key="i1">
                    <template v-for="(o2, i2) in o1.tr">
                        <td
                            :key="i2"
                            :ref="`td${o2.rows}-${o2.cols}`"
                            :colspan="o2.colspan"
                            :rowspan="o2.rowspan"
                            v-if="!o2.isHidden && o2.slots.length ===1"
                            :class="[{'label-title' : o2.slots[0].type === 'label' && o2.slots[0].attrs.type === 2}]"
                        >
                            <template v-if="o2.slots[0].type === 'label'">
                                <div v-if="doParserExpression(o2.slots[0].conditions)" class="label-td" :style="{textAlign: o2.slots[0].attrs.align}">
                                    {{handleLableTxt(o2.slots[0])}} <span class="dw">{{o2.slots[0].attrs.unit}}</span>   
                                </div>
                            </template>
                            <template v-else>
                                <component
                                    v-if="doParserExpression(o2.slots[0].conditions)"
                                    :is="dealComp(o2.slots[0].type)"
                                    :model="modelData"
                                    :vnode="o2.slots[0]"
                                ></component>
                            </template>
                        </td>
                        <td
                            :key="i2"
                            :ref="`td${o2.rows}-${o2.cols}`"
                            :colspan="o2.colspan"
                            :rowspan="o2.rowspan"
                            v-else-if="!o2.isHidden"
                        >
                            <div class="drag-td" v-for="(vnode, index) in o2.slots" :key="index">
                                <template v-if="vnode.type === 'label'">
                                    <div v-if="doParserExpression(vnode.conditions)" class="label-td" :class="[{'label-title' : vnode.attrs.type === 2}]" :style="{textAlign: vnode.attrs.align}">
                                        {{handleLableTxt(vnode)}} <span class="dw">{{vnode.attrs.unit}}</span>
                                    </div>
                                </template>
                                <template v-else>
                                    <component
                                        v-if="doParserExpression(vnode.conditions)"
                                        :is="dealComp(vnode.type)"
                                        :model="modelData"
                                        :vnode="vnode"
                                    ></component>
                                </template>
                            </div>
                        </td>
                    </template>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import FileListOnlinePlace from '../file-list/flow-online-place'
import SubformListOnlinePlace from '../subform-list/flow-online-place'
import format from "@/components/format/format.js";
import tool from "@/components/format/format-tool.js";
export default {
    components: {
        FileListOnlinePlace,
        SubformListOnlinePlace
    },
    props: {
        colgroup: {
            type: Array,
            default() {
                return []
            }
        },
        dataForm: {
            type: [Array, Object],
            default() {
                return []
            }
        },
        headLabel: {
            type: [Array, Object],
            default() {
                return []
            }
        },
        isShowThead: Boolean,
        modelData: Object
    },
    data() {
        return {
        };
    },
    computed: {},
    watch: {},
    methods: {
        isLabel (item) {
            if (item.slots[0] && item.slots[0].attrs && item.slots.length ===1 && item.slots[0].type === 'label') {
                return true
            }
            return false
        },
        dealComp(type) {
            let arr = type ? type.split('') : []
            let result = []
            for (let k of type) {
                if (k.toLowerCase() === k) {
                    result.push(k)
                } else {
                    result.push('-')
                    result.push(k.toLowerCase())
                }
            }
            
            return `${result.join('')}-online-place`
        },
        // 处理lable
        handleLableTxt(vnode) {
            if (vnode.isNoNeedFieldId) { // 不绑定字段
                return vnode.attrs.value
            } else { // 绑定字段
                let txt = this.modelData[vnode.attrs.key]
                if (!txt && txt!==0) return txt

                if (!vnode.attrs.controlType) { // 常规
                    if (vnode.attrs.useMatch === 'dataSource') {  // 匹配数据源
                        let reslut = vnode.attrs.matchOptions.find(o1 => {
                           return o1.value === txt.toString()
                        })
                        txt = reslut ? reslut.label : txt
                    }
                } else { // 整数、小数
                    let place = vnode.attrs.place && parseInt(vnode.attrs.place) > 0 ? parseInt(vnode.attrs.place) : ''
                    if (vnode.attrs.format === 'normal') {
                        if (vnode.attrs.controlType === 1) { // 整形
                            txt = txt || txt===0 ? parseInt(txt) : '';
                        } else if (vnode.attrs.controlType === 2) { // 小数
                            txt = place ? tool.decimalNum(txt, place) : txt
                        } 
                    } else if (vnode.attrs.format === 'thousand') {
                        if (vnode.attrs.controlType === 1) {
                            place = 0
                        }
                        let point = txt.toString().split('.')[1] || ''
                        txt = tool.moneyNum(txt, place)
                        if (place === '') {
                            txt = `${txt}${point ? '.' + point : ''}`
                        }
                    }
                }
                
                return txt
            }
        },
        doParserExpression (conditions) {
            let exp = ''
            let conditonsArr = conditions ? conditions['v-if'] || [] : []

            conditonsArr.forEach((cond, i) => {
                const logicTxt = i > 0 ? (cond.logic === 'AND' ? ' && ' : ' || ') : ''

                // 包含和未包含：只对数字和字符串有效
                if (cond.operation === 'in' || cond.operation === 'not in') {
                    let valueTxt
                    if (cond.valueType === 'int' || cond.valueType === 'float') {
                        valueTxt = `[${(cond.value || '')}]`
                    } else {
                        valueTxt = `['${(cond.value || '').split(/\s*[,，]\s*/g).join('\', \'')}']`
                    }
                    exp += `${logicTxt}${valueTxt}.indexOf(${cond.type !== 'formMode' ? 'this.modelData.' : ''}${cond.prop}) ${cond.operation === 'in' ? '!==' : '==='} -1`
                } else if (cond.operation === 'like' || cond.operation === 'not like') {
                    // 只对字符串有效
                    exp += `${logicTxt}(${cond.type !== 'formMode' ? 'this.modelData.' : ''}${cond.prop}).indexOf('${cond.value}') ${cond.operation === 'like' ? '!==' : '==='} -1`
                } else {
                    exp += `${logicTxt}${cond.type !== 'formMode' ? 'this.modelData.' : ''}${cond.prop} ${cond.operation} '${cond.value}'`
                }
            })

            return exp ? eval(exp) : true
        },
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
.output-table-container {
    // padding-bottom: 20px;
    >table {
        width: 100%;
        border-collapse: collapse;
        border: 1px solid #c0ccda;
        table-layout: fixed;
        >thead{
            background-color: #eff2f7;
            >tr {
                th{
                    border: 1px solid #c0ccda;
                    height: 36px;
                    min-height: 36px;
                    padding: 0 8px;
                    input{
                        border: none;
                        width: 100%;
                        height: 100%;
                        background-color: #eff2f7;
                        outline: none;
                    }
                }
            }
        }
        >tbody{
            >tr {
                >td {
                    border: 1px solid #c0ccda;
                    height: 36px;
                    min-height: 36px;
                    word-break: break-all;
                    &.label-title{
                        background: #eff2f7;
                    }
                    .drag-td {
                        width: 100%;
                        height: 100%;
                        .label-td{
                            min-height: 36px;
                            padding: 8px 6px;
                            line-height: 20px;
                            box-sizing: border-box;
                            .dw{
                                display: inline-block;
                                color: #999;
                                font-size: 12px;
                            }


                            &.label-title{
                                background: #eff2f7;
                            }
                        }
                    }
                    .label-td{
                        min-height: 36px;
                        padding: 8px 6px;
                        line-height: 20px;
                        box-sizing: border-box;
                        .dw{
                            display: inline-block;
                            color: #999;
                            font-size: 12px;
                        }

                        &.label-title{
                            background: #eff2f7;
                        }
                    }
                }
            }
        }
    }
}
</style>
