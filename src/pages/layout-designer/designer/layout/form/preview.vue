<template>
    <sapi-form-panel
        :dialog="!append"
        :dialog-options="{
            width: attrs.dialogOption.width,
            top: attrs.dialogOption.top
        }"
        :panel-options="{
            usePostNav: usePostNav
        }"
        v-model="visible" class="form-edit-preview" @on-open="open" @on-close="close">
        <template slot="title">
            <span v-text="attrs.title || '请右侧设置标题'"></span>
        </template>

        <sapi-form
            ref="form"
            :rules="rules"
            :in-dialog="!append"
            :class="{'preview-form-double-columns': attrs.doubleColumns}"
            :model="model" class="form-content">
            <sapi-form-collapses v-if="attrs.slots.default.existCollapses">
                <draggable
                    @add="handleCollapsesAdd(attrs.slots.default.vnodes, $event)"
                    :list="attrs.slots.default.vnodes"
                    :move="moveValidate"
                    @change="draglistChange"
                    class="clearfix"
                    :options="{group:'widget', ghostClass: 'ghost', swapThreshold:0.5, animation: 100}">
                        <template v-for="(vnode, i) in attrs.slots.default.vnodes">
                            <form-item-draggable :key="vnode.guid" :vnode="vnode" :index="i"
                                :class="{'form-item-fullline': vnode.fullline, 'form-item-alone': vnode.alone}"
                                v-if="vnode.type !== 'collapseItem'"></form-item-draggable>

                            <draggable-wrap 
                                class="collapses-outer-draggable-wrap"
                                @delete-vnode="deleteCollapseItem" 
                                :key="vnode.guid"
                                v-else :vnode="vnode" :index="i">
                                <sapi-form-collapses-item
                                    :title="vnode.attrs && vnode.attrs.title || ''"
                                    :can-title-click="false"
                                    :is-expand="vnode.attrs && vnode.attrs.isExpand">
                                    <draggable
                                        class="collapses-draggable-wrap"
                                        @add="handleCollapsesInnerAdd(vnode.vnodes, $event)"
                                        :list="vnode.vnodes"
                                        group="widget"
                                        @change="draglistChange"
                                        ghostClass="ghost"
                                        :swapThreshold="0.5"
                                        :class="{'collapses-item-empty': vnode.vnodes && vnode.vnodes.length === 0}"
                                        :animation="100">
                                            <template v-for="(childVnode, cIndex) in vnode.vnodes">
                                                <form-item-draggable :key="childVnode.guid"
                                                    :class="{'form-item-fullline': childVnode.fullline, 'form-item-alone': childVnode.alone}"
                                                    :vnode="childVnode" :index="cIndex"></form-item-draggable>
                                            </template>
                                    </draggable>
                                </sapi-form-collapses-item>
                            </draggable-wrap>
                        </template>
                </draggable>
            </sapi-form-collapses>
            <draggable v-else
                @add="handleCollapsesAdd(attrs.slots.default.vnodes, $event)"
                :list="attrs.slots.default.vnodes"
                class="clearfix form-item-draggable-wrap"
                :class="{
                    'vnode-empty': attrs.slots.default.vnodes.length === 0
                }"
                @change="draglistChange"
                :options="{group:'widget', ghostClass: 'ghost', swapThreshold:0.5, animation: 100}">
                <template v-for="(vnode, i) in attrs.slots.default.vnodes">
                    <form-item-draggable
                        :key="vnode.guid"
                        :class="{'form-item-fullline': vnode.fullline, 'form-item-alone': vnode.alone}" 
                        :vnode="vnode" :index="i"></form-item-draggable>
                </template>
            </draggable>
        </sapi-form>

        <template slot="footer">
			<el-button size="small">取消</el-button>
			<el-button size="small" type="primary">提交</el-button>
		</template>
    </sapi-form-panel>
</template>

<script>
import formItemDraggable from './form-item-draggable.vue'
import DraggableWrap from '../../components/draggable-wrap.vue'
import draggable from '../../components/draggable.js'
import Types from './types.js'

export default {
    components: {
        formItemDraggable,
        DraggableWrap,
        draggable
    },
    provide () {
        return {
            preview: this,
            ueditor: this.ueditor
        }
    },
    props: {
        value: Boolean,
        option: Object,
        append: Boolean,
        usePostNav: Boolean,
        attrs: {
            type: Object,
            default () {
                return {
                    title: '',
                    layout: 'form',
                    doubleColumns: false,
                    dialogOption: {
                        width: '500px',
                        top: '25%'
                    },
                    slots: {
                        default: {
                            visible: true,
                            existCollapses: false,
                            vnodes: []
                        }
                    }
                }
            }
        },
        ueditor: Object
    },
    data () {
        return {
            disabled: false,
            visible: false,
            model: {
            },
            rules: {
            }
        }
    },
    watch: {
        value(val) {
            this.visible = this.value;
        }
    },
    methods: {
        open() {
            this.$refs.form && this.$refs.form.resetFields()
            this.createModel = {
            };
        },
        close() {
            this.$emit('input', false);
        },
        submit() {
            this.$refs.form.validate((valid) => {
            })
        },
        handleCollapsesInnerAdd (list, event) {
            const typeObj = list[event.newIndex]
            if (typeObj.guid) {
                return
            }
            const newVnode = Types[typeObj.type].create({ model: 'model' }, void 0, this.attrs)

            this.setRule(newVnode)
            this.$set(list, event.newIndex, newVnode)
            this.ueditor.setActiveVnode(newVnode)
        },
        setRule (vnode) {
            var getValidator = function (vnode) {
                return function (rule, value, callback) {
                    let errorMsg = ''

                    if (!vnode.fieldId && !vnode.isNoNeedFieldId) {   // 当不需要绑定字段时，加上isNoNeedFieldId字段
                        errorMsg += '未设置绑定字段；'
                    }

                    if (vnode.type === 'radio' ||
                        vnode.type === 'checkbox' ||
                        vnode.type === 'select') {
                        if ((!vnode.options || vnode.options.length === 0) && !vnode.api) {
                            errorMsg += '未设置数据源；'
                        }
                    }

                    if (vnode.type === 'custom' && !vnode.componentName) {
                        errorMsg += '未设置组件类型；'
                    }

                    if (vnode.type === 'detail') {
                        if (!vnode.columns || vnode.columns.length === 0) {
                            errorMsg += '未设置子表列；'
                        }

                        if (vnode.columns) {
                            vnode.columns.forEach((column) => {
                                if (column.vnode.type === 'custom' && !vnode.componentName) {
                                    errorMsg += vnode.label + '列未设置组件类型；'
                                }
                            })
                        }
                    }

                    if (errorMsg) {
                        callback(new Error(errorMsg))
                    } else {
                        callback()
                    }
                }
            }
            if (Types[vnode.type].category === 'base' ||
                Types[vnode.type].category === 'enhance') {
                const rule = {
                    type: Object,
                    required: false,
                    validator: getValidator(vnode),
                    trigger: ['change', 'blur']
                }

                this.$set(this.rules, vnode.guid, rule)
            }
        },
        handleCollapsesAdd (list, event) {
            const typeObj = list[event.newIndex]
            if (typeObj.guid) {
                return
            }
            if (typeObj.type === 'collapseItem' &&
                !this.attrs.slots.default.existCollapses) {
                this.attrs.slots.default.existCollapses = true
            }
            const newVnode = Types[typeObj.type].create({ model: 'model' }, void 0, this.attrs)

            this.setRule(newVnode)
            this.$set(list, event.newIndex, newVnode)
            this.ueditor.setActiveVnode(newVnode)
        },
        draglistChange () {
            this.$nextTick(function () {
                this.ueditor.addRecord()
            })
        },
        deleteCollapseItem (vnode) {
            if (vnode.type === 'collapseItem') {
                const defaultSlots = this.attrs.slots.default
                let isExistCollapseItem = false
                for (let i = 0, len = defaultSlots.length; i < len; i++) {
                    if (defaultSlots[i].type === 'collapseItem') {
                        isExistCollapseItem = true
                        break
                    }
                }

                this.attrs.slots.default.existCollapses = isExistCollapseItem
            }
        },
        moveValidate (evt) {
            if (evt.draggedContext.element.type === 'collapseItem' &&
                (evt.related && evt.related.className.indexOf('collapses-draggable-wrap') > -1 ||
                evt.to && evt.to.className.indexOf('collapses-draggable-wrap') > -1)) {
                return false
            }
        }
    },
    mounted() {
        const that = this
        this.visible = this.value;
        this.validatePreviewField = function (vnode) {
            that.$refs.form.validateField(vnode.guid)
        }
        this.ueditor.$root.$on('validate-preview-field', this.validatePreviewField)
    },
    beforeDestroy () {
        this.ueditor.$root.$off('validate-preview-field', this.validatePreviewField)
    }
}
</script>
