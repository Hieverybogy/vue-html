<template>
    <div class="drag-option">
        <div class="item">
            <div class="title">用途</div>
            <div class="value">
                <el-radio-group v-model="vnode.selectType" @change="addRecord">
                     <el-radio label="all">选择公司/部门</el-radio>
                    <el-radio label="compnay">仅选择公司</el-radio>
                    <el-radio label="dept">仅选择部门</el-radio>
                </el-radio-group>
            </div>
        </div>
        <div class="item">
            <el-button ref="btnBindingFields" @click="setBindingFields" size="small" style="width:100%">设置绑定字段</el-button>
        </div>
        <div v-if="!inTableColumn" class="item">
            <div class="title must-star">绑定字段</div>
            <div class="value" v-if="inListLayout">
                <el-input v-model="vnode.fieldId" @change="addRecord"></el-input>
            </div>
        </div>
        <div v-if="!inTableColumn" class="item">
            <div class="title must-star">显示标题</div>
            <div class="value">
                <el-input v-model="vnode.label" @change="addRecord"></el-input>
            </div>
        </div>
        <div class="item">
            <div class="title">仅能选中末节点</div>
            <div class="value">
                <el-checkbox v-model="vnode.onlyLeafActive" @change="addRecord">是</el-checkbox>
            </div>
        </div>
        <div class="item">
            <div class="title">是否显示清除按钮</div>
            <div class="value">
                <el-checkbox v-model="vnode.attrs.clearable" @change="addRecord">是</el-checkbox>
            </div>
        </div>
        <div class="item" v-if="!inListLayout">
            <div class="title">校验</div>
            <div class="value">
                <el-checkbox v-model="vnode.required" @change="addRecord">必填</el-checkbox>
            </div>
        </div>
        <div class="item" v-if="vnode.required && !inListLayout">
            <div class="title">必填校验失败提示</div>
            <div class="value">
                <el-input v-model="vnode.requiredErrorMsg" @change="addRecord"></el-input>
            </div>
        </div>
        <div class="item" v-if="!inListLayout && vnode.required && !inTableColumn">
            <div class="title">自定义校验</div>
            <div class="value">
                <el-select v-model="vnode.validator" @change="addRecord" placeholder="请选择">
                    <el-option
                        v-for="item in bindingMethods"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
        </div>
        <div class="item" v-if="!inListLayout">
            <div class="title">字段权限</div>
            <div class="value">
                <el-checkbox v-model="vnode.attrs.readonly" @change="addRecord">只读</el-checkbox>
            </div>
        </div>
        <div v-if="!inListLayout && !inTableColumn && layoutAttrs.doubleColumns" class="item">
            <div class="title">布局</div>
            <div class="value">
                <el-checkbox v-model="vnode.fullline" @change="addRecord">占据整行</el-checkbox>
            </div>
            <div class="value">
                <el-checkbox v-model="vnode.alone" @change="addRecord">左侧空置</el-checkbox>
            </div>
        </div>

        <component :is="settingView"
            :reference="settingReference"
            :vnode="settingVnode"
            v-model="settingVisible">
        </component>
    </div>
</template>

<script>
import typeMixin from '../type-mixin.js'
export default {
    components: {
        'binding-fields-setting': () => import('./binding-fields-setting')
    },
    mixins: [typeMixin],
    data () {
        return {
            settingView: '',
            settingReference: null,
            settingVnode: null,
            settingVisible: false
        }
    },
    methods: {
        setBindingFields () {
            this.settingView = 'binding-fields-setting'
            this.settingReference = this.$refs.btnBindingFields.$el
            this.settingVisible = true
            this.settingVnode = this.vnode
        }
    }
}
</script>
