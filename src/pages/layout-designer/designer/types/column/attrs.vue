<template>
    <div class="drag-option">
        <div class="item">
            <div class="title must-star" ref="displayTitle">
                表头名称
                <i class="icon-edit sapi-code-icon" 
                    title="编辑代码" 
                    :class="{'sapi-code-edited': !!vnode.attrs['label-expression']}"
                    @click="showPopover('displayTitle', 'el-table-column', 'label')"></i>
            </div>
            <div class="value">
                <el-input v-model="vnode.label" @change="addRecord"></el-input>
            </div>
        </div>
        <div class="item" v-if="false">
            <div class="title">列模板 
                <i class="icon-edit sapi-code-icon" 
                    v-show="vnode.useCustomTemplate"
                    title="编辑代码" 
                    :class="{'sapi-code-edited': !!vnode.attrs['v-if-expression']}"
                    @click="showPopover('conditionTitle', 'el-table-column>template', 'v-if')"></i></div>
            <div class="value">
                <el-checkbox v-model="vnode.useCustomTemplate" @change="addRecord">自定义</el-checkbox>
            </div>
        </div>
        <div class="item">
            <div class="title">组件类型</div>
            <div class="value">
                <el-select v-model="vnode.vnode.type" @change="typeChange">
                    <el-option 
                        v-for="(type,index) in types" :key="index" 
                        :label="type.label" :value="type.value"></el-option>
                </el-select>
            </div>
        </div>
        <div class="item">
            <div class="title">列宽度</div>
            <div class="value">
                <el-input v-model="vnode.width" placeholder="单位为PX" @change="addRecord"></el-input>
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
            <div class="title">tip提示</div>
            <div class="value">
                <el-checkbox v-model="vnode.showOverflowTooltip" @change="addRecord">是</el-checkbox>
            </div>
        </div>
        <div class="item">
            <div class="title">列是否固定</div>
            <div class="value">
                <el-radio-group v-model="vnode.fixed" @change="addRecord">
                    <el-radio :label="false">不固定</el-radio>
                    <el-radio label="left">固定到左侧</el-radio>
                    <el-radio label="right">固定到右侧</el-radio>
                </el-radio-group>
            </div>
        </div>
        <div class="item" v-if="!inListLayout">
            <div class="title" ref="conditionTitle">显示条件 
                <i class="icon-edit sapi-code-icon" 
                    title="编辑代码" 
                    :class="{'sapi-code-edited': !!vnode.attrs['v-if-expression']}"
                    @click="showPopover('conditionTitle', 'el-table-column', 'v-if')"></i>
            </div>
            <div class="value" ref="conditionBtn">
                <el-button @click="setCondition('conditionBtn', 'v-if')" size="small" style="width:100%">设置条件</el-button>
            </div>
        </div>
        <component :is="vnode.vnode.type ? (vnode.vnode.type + '-attrs') : ''" 
            :vnode="vnode.vnode" :container="vnode.type" style="padding:0;"></component>
    </div>
</template>

<script>
import { TypesAttrs } from '../../types/index.js'
import typeMixin from '../type-mixin.js'

export default {
    components: TypesAttrs,
    mixins: [typeMixin],
    props: {
        parentVnode: {
            type: Object,
            default () {
                return {
                    vnode: {}
                }
            }
        }
    },
    data () {
        return {
            types: [],
            view: ''
        }
    },
    methods: {
        typeChange (type) {
            const newVnode = this.ueditor.preview.Types.$factory(type || '', void 0, this.parentVnode, this.layoutAttrs)
            newVnode.attrs.length = this.vnode.vnode.attrs.length
            newVnode.fieldId = this.vnode.fieldId
            newVnode.model = 'props.row'
            newVnode.parentFieldId = ''

            this.$set(this.vnode, 'vnode', newVnode)

            this.addRecord()
        }
    },
    created () {
        const ts = this.ueditor.preview.Types
        for (let type in ts) {
            if (ts[type] && ts[type].user &&
                ts[type].user.indexOf(this.vnode.type) > -1) {
                this.types.push({
                    label: ts[type].label,
                    value: ts[type].type
                })
            }
        }
    }
}
</script>
