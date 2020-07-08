<template>
    <div class="drag-option">
        <div class="item">
            <div class="title must-star">表头名称</div>
            <div class="value" ref="columnName">
                <el-input v-model="vnode.label" @change="addRecord"></el-input>
            </div>
        </div>
        <div class="item">
            <div class="title">数据类型</div>
            <div class="value">
                <el-select v-model="vnode.dataType" disabled>
                    <el-option 
                        v-for="t in dataTypes" :key="t.type" 
                        :label="t.label" :value="t.type"></el-option>
                </el-select>
            </div>
        </div>
        <div class="item" v-if="vnode.dataType === 'date' || 
            vnode.dataType === 'int' && vnode.useMatch === 'none' || vnode.dataType === 'float'">
            <div class="title">格式</div>
            <div class="value">
                <el-select v-if="vnode.dataType === 'date'" 
                    v-model="vnode.format" @change="addRecord">
                    <el-option v-for="f in dateFormatTypes" :key="f.value"
                        :label="f.label" :value="f.value">
                    </el-option>
                </el-select>

                <el-select v-if="vnode.dataType === 'int' || vnode.dataType === 'float'"
                    v-model="vnode.format" @change="addRecord">
                    <el-option v-for="f in numberFormatTypes" :key="f.value"
                        :label="f.label" :value="f.value">
                    </el-option>
                </el-select>
            </div>
        </div>
        <div class="item" v-if="vnode.dataType === 'float'">
            <div class="title">小数位</div>
            <div class="value">
                <el-input v-model="vnode.place" @change="addRecord"></el-input>
            </div>
        </div>
        <div class="item">
            <div class="title">表头对齐方式</div>
            <div class="value">
                <el-radio-group v-model="vnode.headerAlign" @change="addRecord">
                    <el-radio label="left">左对齐</el-radio>
                    <el-radio label="center">居中</el-radio>
                    <el-radio label="right">右对齐</el-radio>
                </el-radio-group>
            </div>
        </div>
        <div class="item">
            <div class="title">对齐方式</div>
            <div class="value">
                <el-radio-group v-model="vnode.align" @change="addRecord">
                    <el-radio label="left">左对齐</el-radio>
                    <el-radio label="center">居中</el-radio>
                    <el-radio label="right">右对齐</el-radio>
                </el-radio-group>
            </div>
        </div>
        <div class="item">
            <div class="title">固定列</div>
            <div class="value">
                <el-select v-model="vnode.fixed" @change="addRecord">
                    <el-option label="无" value=""></el-option>
                    <el-option label="左" value="left"></el-option>
                    <el-option label="右" value="right"></el-option>
                </el-select>
            </div>
        </div>

        <div class="item inline-block" ref="linkValue">
            <div class="title">是否链接</div>
            <div class="value">
                <el-checkbox v-model="vnode.isLink" @change="addRecord"> <el-button v-show="vnode.isLink" @click="setLinkConfig" size="small" type="text">设置</el-button></el-checkbox>
            </div>
        </div>

        <div class="item" v-if="vnode.dataType === 'int' || vnode.dataType === 'text'">
            <div class="title">数据匹配</div>
            <el-radio-group v-model="vnode.useMatch" @change="addRecord">
                <el-radio label="none">不启用</el-radio>
                <el-radio label="dataSource">匹配数据源</el-radio>
            </el-radio-group>
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
                <el-input v-model="vnode.width" placeholder="单位为px" @change="addRecord"></el-input>
            </div>
        </div>

        <div class="item inline-block">
            <div class="title">支持字段排序</div>
            <div class="value">
                <el-checkbox v-model="vnode.sortable" @change="addRecord"></el-checkbox>
            </div>
        </div>

        <div class="item inline-block">
            <div class="title">设为默认排序字段</div>
            <div class="value">
                <el-checkbox v-model="isDefaultSortName" @change="changeDefaultSortName"></el-checkbox>
            </div>
        </div>

        <div v-if="parentVnode.defaultSortName === vnode.fieldId" class="item inline-block">
            <div class="title">排序方式</div>
            <div class="value">
                <el-radio-group v-model="parentVnode.defaultSortType" @change="addRecord">
                    <el-radio label="descending">降序</el-radio>
                    <el-radio label="ascending">升序</el-radio>
                </el-radio-group>
            </div>
        </div>

        <div class="item inline-block">
            <div class="title">tip提示</div>
            <div class="value">
                <el-checkbox v-model="vnode.useTips" @change="addRecord"></el-checkbox>
            </div>
        </div>

        <div v-transfer-dom>
            <component :is="view" 
                v-model="optionVisible"
                :reference="optionReference"
                :option="currentOption" 
                @callback="callback"></component>
        </div>

        <component :is="settingView"
            :reference="settingReference"
            :vnode="settingVnode"
            v-model="settingVisible">
        </component>
    </div>
</template>

<script>
import { DateFormatTypes, NumberFormatTypes } from '../format.js'
import typeMixin from '../type-mixin.js'
export default {
    mixins: [typeMixin],
    components: {
        'set-options': () => import('../../components/set-options.vue'),
        'set-link': () => import('../../components/set-link')
    },
    data () {
        return {
            dateFormatTypes: [],
            numberFormatTypes: [],
            dataTypes: [
                { type: 'text', label: '文本' },
                { type: 'int', label: '整数' },
                { type: 'float', label: '小数' },
                { type: 'date', label: '日期' },
                { type: 'textarea', label: '多行文本' }
            ],
            currentOption: null,
            view: '',
            optionVisible: false,
            optionReference: null,
            settingView: '',
            settingReference: null,
            settingVnode: null,
            settingVisible: false,
            isDefaultSortName: false
        }
    },
    watch: {
        vnode: {
            handler () {
                this.isDefaultSortName = this.parentVnode.defaultSortName === this.vnode.fieldId
                this.$root.$emit('validate-preview-field', this.vnode)
            },
            deep: true
        }
    },
    methods: {
        addResource () {
            this.currentOption = this.vnode.matchOptions || []
            this.optionReference = this.$refs.matchOptions
            this.view = 'set-options'
            this.optionVisible = true
        },
        callback (data) {
            this.optionVisible = false
            this.vnode.matchOptions = data
             // 改变需要取消校验信息
            this.$root.$emit('validate-preview-field', this.vnode)
            this.ueditor.addRecord()
        },
        setLinkConfig () {
            this.settingReference = this.$refs.linkValue
            this.settingView = 'set-link'
            this.settingVnode = this.vnode
            this.settingVisible = true
        },
        changeDefaultSortName (val) {
            if (val) {
                this.parentVnode.defaultSortName = this.vnode.fieldId
                this.parentVnode.defaultSortType = this.parentVnode.defaultSortType || 'descending'
            } else {
                this.parentVnode.defaultSortName = ''
            }
            this.addRecord()
        }
    },
    created () {
        this.isDefaultSortName = this.parentVnode.defaultSortName === this.vnode.fieldId
        for (let type in DateFormatTypes) {
            this.dateFormatTypes.push({
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
    }
}
</script>
