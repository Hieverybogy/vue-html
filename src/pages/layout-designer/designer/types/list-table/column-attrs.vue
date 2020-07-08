<template>
    <div class="drag-option">
        <div class="item">
            <div class="title must-star">表头名称</div>
            <div class="value" ref="columnName">
                <el-input v-model="vnode.label"></el-input>
            </div>
        </div>
        <div class="item">
            <div class="title">数据类型</div>
            <div class="value">
                <el-select v-model="vnode.dataType" disabled>
                    <el-option 
                        v-for="(t, index) in dataTypes" :key="t.type" 
                        :label="t.label" :value="t.type"></el-option>
                </el-select>
            </div>
        </div>
        <div class="item" v-if="vnode.dataType === 'date' || 
            vnode.dataType === 'int' && vnode.useMatch === 'none' || vnode.dataType === 'float'">
            <div class="title">格式</div>
            <div class="value">
                <el-select v-if="vnode.dataType === 'date'" 
                    v-model="vnode.format">
                    <el-option v-for="f in dateFormatTypes" :key="f.value"
                        :label="f.label" :value="f.value">
                    </el-option>
                </el-select>

                <el-select v-if="vnode.dataType === 'int' || vnode.dataType === 'float'"
                    v-model="vnode.format">
                    <el-option v-for="f in numberFormatTypes" :key="f.value"
                        :label="f.label" :value="f.value">
                    </el-option>
                </el-select>
            </div>
        </div>
        <div class="item" v-if="vnode.dataType === 'float'">
            <div class="title">小数位</div>
            <div class="value">
                <el-input v-model="vnode.place"></el-input>
            </div>
        </div>
        <div class="item">
            <div class="title">固定列</div>
            <div class="value">
                <el-select v-model="vnode.fixed">
                    <el-option label="无" value=""></el-option>
                    <el-option label="左" value="left"></el-option>
                    <el-option label="右" value="right"></el-option>
                </el-select>
            </div>
        </div>

        <div class="item inline-block">
            <div class="title">是否链接</div>
            <div class="value">
                <el-checkbox v-model="vnode.isLink"></el-checkbox>
            </div>
        </div>

        <div class="item" v-if="vnode.isLink">
            <div class="title">链接类型</div>
            <div class="value">
                <el-radio-group v-model="vnode.linkType">
                    <el-radio label="detail">详情</el-radio>
                    <el-radio label="custom">链接</el-radio>
                </el-radio-group>
            </div>
        </div>

        <div class="item" v-if="vnode.isLink && vnode.linkType === 'custom'">
            <div class="title must-star">文件目录（以@开头）</div>
            <div class="value" ref="linkFileDir">
                <el-input v-model="vnode.linkDirectory" ></el-input>
            </div>
        </div>

        <div class="item" v-if="vnode.isLink && vnode.linkType === 'custom'">
            <div class="title must-star">路由全路径</div>
            <div class="value" ref="linkPath">
                <el-input v-model="vnode.linkPath" ></el-input>
            </div>
        </div>

        <div class="item" v-if="vnode.dataType === 'int' || vnode.dataType === 'text'">
            <div class="title">数据匹配</div>
            <el-radio-group v-model="vnode.useMatch">
                <div class="value">
                    <el-radio label="none">不启用</el-radio>
                </div>
                <div class="value">
                    <el-radio label="method">匹配方法</el-radio>
                </div>
                <div class="value">
                    <el-radio label="dataSource">匹配数据源</el-radio>
                </div>
            </el-radio-group>
        </div>

        <div class="item" v-if="vnode.useMatch === 'method'">
            <div class="title must-star">匹配方法</div>
            <div class="value" ref="matchMethod">
                <el-select v-model="vnode.matchMethod" clearable filterable>
                    <el-option v-for="(item,index) in methodTyps" :key="index" 
                        :label="item.label" :value="item.value"></el-option>
                </el-select>
            </div>
        </div>
        <div class="item" v-if="vnode.useMatch === 'dataSource'">
            <div class="title must-star">匹配数据源</div>
            <div class="value" ref="matchOptions">
                <el-button size="small" @click="addResource">添加</el-button>
            </div>
        </div>

        <div class="item inline-block">
            <div class="title">宽度</div>
            <div class="value">
                <el-input v-model="vnode.width" placeholder="单位为PX"></el-input>
            </div>
        </div>

        <div class="item inline-block">
            <div class="title">字段排序</div>
            <div class="value">
                <el-checkbox v-model="vnode.sortable"></el-checkbox>
            </div>
        </div>

        <div class="item inline-block">
            <div class="title">tip提示</div>
            <div class="value">
                <el-checkbox v-model="vnode.useTips"></el-checkbox>
            </div>
        </div>

        <div v-transfer-dom>
            <component :is="view" 
                v-model="settingVisible"
                :option="currentOption" 
                @callback="callback"></component>
        </div>
    </div>
</template>

<script>
import { DateFormatTypes, NumberFormatTypes } from '../format.js'
import { getExtendMixins } from '../../config.js'
export default {
    components: {
        'set-options': () => import('../../components/set-options.vue')
    },
    props: {
        vnode: {
            type: Object,
            default () {
                return {
                    vnode: {}
                }
            }
        },
        dataModel: {
            type: Array,
            required: true
        },
        container: {
            type: String,
            default: 'default'
        },
        layoutAttrs: {
            type: Object,
            default () {
                return {}
            }
        }
    },
    data () {
        return {
            dataFormatTypes: [],
            numberFormatTypes: [],
            dataTypes: [
                { type: 'text', label: '文本' },
                { type: 'int', label: '整数' },
                { type: 'float', label: '小数' },
                { type: 'date', label: '日期' },
                { type: 'textarea', label: '多行文本' }
            ],
            methodTyps: [],
            currDateFormat: '',
            currentOption: null,
            view: '',
            settingVisible: false
        }
    },
    watch: {
        vnode: {
            handler () {
                this.$root.$emit('validate-preview-field', this.vnode)
            },
            deep: true
        }
    },
    methods: {
        addResource () {
            this.currentOption = this.vnode.matchOptions || []
            this.view = 'set-options'
            this.settingVisible = true
        },
        callback (data) {
            this.settingVisible = false
            this.vnode.matchOptions = data
             // 改变需要取消校验信息
            this.$root.$emit('validate-preview-field', this.vnode)
        }
    },
    created () {
        const mixins = getExtendMixins()

        for (let type in DateFormatTypes) {
            this.dataFormatTypes.push({
                value: DateFormatTypes[type].format,
                label: DateFormatTypes[type].label
            })
        }

        for (let type in NumberFormatTypes) {
            this.numberFormatTypes.push({
                value: type,
                label: NumberFormatTypes[type]
            })
        }

        for (let key in mixins) {
            this.methodTyps.push({ label: mixins[key].label, value: key })
        }
    }
}
</script>
