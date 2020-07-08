<template>
    <div class="drag-option">
        <div class="item">
            <div class="title must-star">绑定字段</div>
            <div class="value">
                <el-input v-model="vnode.fieldId" @change="addRecord"></el-input>
            </div>
        </div>
        <div class="item">
            <div class="title must-star" ref="displayTitle">
                显示标题
                <i v-if="false" class="icon-edit sapi-code-icon" 
                    title="编辑代码" 
                    :class="{'sapi-code-edited': !!vnode.attrs['label-expression']}"
                    @click="showPopover('displayTitle', 'sapi-form-item', 'label')"></i>
            </div>
            <div class="value">
                <el-input v-model="vnode.label" @change="addRecord"></el-input>
            </div>
        </div>
        <div class="item">
            <div class="title">数据源类型</div>
            <div class="value">
                <el-radio-group v-model="vnode.dataSourceType" @change="addRecord">
                    <el-radio label="custom">自定义</el-radio>
                    <el-radio label="api">设置api</el-radio>
                    <el-radio label="dataProp">绑定data属性</el-radio>
                </el-radio-group>
            </div>
        </div>
        <div class="item" v-if="vnode.dataSourceType !== 'dataProp'">
            <div class="title must-star">绑定数据源</div>
            <div class="value">
                <el-button size="small" @click="settingDataSource" style="width:100%">设置</el-button>
            </div>
        </div>
        <div class="item" v-if="vnode.dataSourceType === 'dataProp'">
            <div class="title must-star">绑定data属性</div>
            <div class="value">
                <el-select v-model="vnode.optionsProp" @change="addRecord">
                     <el-option v-for="p in bindingProps" :key="p" 
                        :label="p" :value="p">
                    </el-option>
                </el-select>
            </div>
        </div>
        <div class="item" v-if="!inListLayout && !inTableColumn && false">
            <div class="title" ref="conditionTitle">显示条件
                <i class="icon-edit sapi-code-icon" 
                    title="编辑代码" 
                    :class="{'sapi-code-edited': !!vnode.attrs['v-if-expression']}"
                    @click="showPopover('conditionTitle', 'sapi-form-item', 'v-if')"></i></div>
            <div class="value" ref="conditionBtn">
                <el-button @click="setCondition('conditionBtn', 'v-if')" size="small" style="width:100%">设置条件</el-button>
            </div>
        </div>

        <component :is="view" 
            v-model="settingVisible"
            :option="currentOption" 
            :reference="reference"
            :type="vnode.type"
            @callback="callback"></component>
        
        <component :is="apiOptionsView"
            v-model="apiOptionsVisible"
            :reference="reference"
            :vnode="vnode"></component>
    </div>
</template>

<script>
import typeMixin from '../type-mixin.js'
import optionsMixin from '../options-mixin.js'
export default {
    components: {
        'options-setting': () => import('./options-setting')
    },
    mixins: [typeMixin, optionsMixin],
    data () {
        return {
            formatTypes: [],
            currFormat: '',
            apiOptionsView: '',
            apiOptionsVisible: false
        }
    },
    methods: {
        settingDataSource (event) {
            if (this.vnode.dataSourceType === 'custom') {
                this.setDataSource(event)
            } else {
                let reference = event.target
                if (event.target.tagName.toUpperCase() === 'SPAN') {
                    reference = event.target.parentNode
                }

                this.reference = reference
                this.apiOptionsView = 'options-setting'
                this.apiOptionsVisible = true
            }
        }
    }
}
</script>
