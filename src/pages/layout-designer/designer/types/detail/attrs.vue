<template>
    <div class="drag-option">
        <div class="item inline-block">
            <div class="title must-star">绑定字段</div>
            <div class="value">
                <el-select v-model="vnode.fieldId" @change="setChild">
                    <el-option v-for="(field,index) in dataModel" :key="index" 
                        :disabled="field.MarkCount > 0" :label="field.FieldName" :value="field.FieldId">
                        <span :class="{'before-must-star': !field.IsNullable}">{{ field.FieldName }}</span>
                    </el-option>
                </el-select>
            </div>
        </div>
        <div class="item">
            <div class="title must-star" ref="displayTitle">
                显示标题
                <i class="icon-edit sapi-code-icon" 
                    title="编辑代码" 
                    :class="{'sapi-code-edited': !!vnode.attrs['label-expression']}"
                    @click="showPopover('displayTitle', 'sapi-form-item', 'label')"></i>
            </div>
            <div class="value">
                <el-input v-model="vnode.label" @change="addRecord"></el-input>
            </div>
        </div>
        <div class="item">
            <div class="title must-star">添加列</div>
            <div class="value">
                <el-select size="mini" allow-create filterable multiple 
                    v-model="column" 
                    @change="selectCol">
                    <el-option v-for="(item,index) in columns"
                        :key="index" :label="item.FieldName" :value="item.FieldId">
                             <span :class="{'before-must-star': !item.IsNullable}">{{ item.FieldName }}</span>
                        </el-option>
                </el-select>
            </div>
        </div>
        <div class="item inline-block" v-if="false">
            <div class="title">显示操作列</div>
            <div class="value">
                <el-checkbox v-model="vnode.useOperateColumn" @change="addRecord"></el-checkbox>
            </div>
        </div>
        <div class="item inline-block">
            <div class="title">可新增</div>
            <div class="value">
                <el-checkbox v-model="vnode.canAdd" @change="addRecord"></el-checkbox>
            </div>
        </div>
        <div class="item inline-block">
            <div class="title">新增按钮名称</div>
            <div class="value">
                <el-input v-model="vnode.addBtnName" @change="addRecord"></el-input>
            </div>
        </div>
        <div class="item inline-block">
            <div class="title">可编辑</div>
            <div class="value">
                <el-checkbox v-model="vnode.canEdit" @change="addRecord"></el-checkbox>
            </div>
        </div>
        <div class="item inline-block">
            <div class="title">可删除</div>
            <div class="value">
                <el-checkbox v-model="vnode.canDelete" @change="addRecord"></el-checkbox>
            </div>
        </div>
        <div class="item">
            <div class="title">校验</div>
            <div class="value">
                <el-checkbox v-model="vnode.required" @change="addRecord">必填</el-checkbox>
            </div>
        </div>
        <div class="item" v-if="!inListLayout && vnode.required">
            <div class="title">必填校验失败提示</div>
            <div class="value">
                <el-input v-model="vnode.requiredErrorMsg" @change="addRecord"></el-input>
            </div>
        </div>
        <div class="item" v-if="!inListLayout && vnode.required">
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
            <div class="title" ref="conditionTitle">显示条件 
                <i class="icon-edit sapi-code-icon" 
                    title="编辑代码" 
                    :class="{'sapi-code-edited': !!vnode.attrs['v-if-expression']}"
                    @click="showPopover('conditionTitle', 'sapi-form-item', 'v-if')"></i></div>
            <div class="value" ref="conditionBtn">
                <el-button @click="setCondition('conditionBtn', 'v-if')" size="small" style="width:100%">设置条件</el-button>
            </div>
        </div>
        <div class="item" ref="bindEvent">
            <el-button @click="setBindEvent('bindEvent')" size="small" style="width:100%">设置绑定事件</el-button>
        </div>
    </div>
</template>

<script>
import typeMixin from '../type-mixin.js'
export default {
    mixins: [typeMixin],
    data () {
        return {
            column: null,
            columns: [],
            eventType: [
                { event: 'add', remark: '点击新增按钮触发事件', defaultArguments: '(event: Event)' },
                { event: 'delete', remark: '点击删除按钮触发事件', defaultArguments: '(row, index)' }
            ]
        }
    },
    methods: {
        setChild (id) {
            let field = this.dataModel.find(field => field.FieldId === id)

            if (field.Relationship === 1) {
                this.subDataModel = field.Children || []
                this.subDataModelVisible = true
                this.vnode.aliasFieldId = id
                this.vnode.label = field.FieldName
                this.columns = []
                this.column = []
                this.vnode.columns = []
                // field = this.subDataModel.find((field) => {
                //     return field.FieldId === this.vnode.subFieldId
                // })
            } else if (field) {
                this.vnode.aliasFieldId = id
                this.columns = field.Children
                this.vnode.label = field.FieldName
            }

            this.addRecord()

            // 改变需要取消校验信息
            this.$root.$emit('validate-preview-field', this.vnode)
        },
        selectCol () {
            let exsitCols = this.vnode.columns
            let columns = []
            this.$set(this.vnode, 'columns', columns)
            let fields = this.columns

            exsitCols.forEach(column => {
                const isExist = this.column.find(fieldId => column.fieldId === fieldId)
                if (isExist) {
                    columns.push(column)
                }
            })

            this.column.forEach(column => {
                let field = fields.find(field => field.FieldId === column)
                let col = exsitCols.find(field => field.fieldId === column)
                if (!col) {
                    // const typeDD = {
                    //     'string': 'text',
                    //     'longString': 'textarea',
                    //     'attachment': 'upload',
                    //     8: 'select',
                    //     6: 'radio',
                    //     'int': 'int',
                    //     'float': 'float',
                    //     'subTable': 'detail',
                    //     'dateTime': 'date',
                    //     1006: 'custom',
                    //     7: 'checkbox'
                    // }
                    const newVnode = this.ueditor.preview.Types.$factory(field.FieldType || '', void 0, this.vnode, this.ueditor.layoutAttrs)
                    newVnode.attrs.length = field.Length
                    newVnode.fieldId = field.FieldId
                    newVnode.model = 'props.row'
                    newVnode.parentFieldId = ''

                    // const columnVnode = {
                    //     guid: Vue.$utils.guid(),
                    //     fieldId: field.FieldId,
                    //     label: field.FieldName,
                    //     type: 'column',
                    //     width: '',
                    //     // 包含节点类型
                    //     vnode: newVnode
                    // }
                    const columnVnode = this.ueditor.preview.Types.$factory('column', {
                        fieldId: field.FieldId,
                        label: field.FieldName,
                        // 包含节点类型
                        vnode: newVnode
                    }, this.vnode, this.ueditor.layoutAttrs)

                    columns.push(columnVnode)
                }
            })

            // 改变需要取消校验信息
            this.$root.$emit('validate-preview-field', this.vnode)
            this.addRecord()
        },
        subChange (id) {
            let data = this.subDataModel.find(field => {
                return field.FieldId === id
            })

            this.vnode.aliasFieldId = id
            this.vnode.label = data.FieldName
            this.columns = data.Children || []
            this.column = []
            this.vnode.columns = []

            // 改变需要取消校验信息
            this.$root.$emit('validate-preview-field', this.vnode)
            this.addRecord()
        },
        init () {
            if (this.vnode.fieldId) {
                let field = this.dataModel.find(
                    field => field.FieldId === this.vnode.fieldId
                )

                // 一对一的关系，需要绑定子属性
                if (field.Relationship === 1) {
                    this.subDataModel = field.Children
                    this.subDataModelVisible = true

                    field = this.subDataModel.find((field) => {
                        return field.FieldId === this.vnode.subFieldId
                    })

                    this.columns = field.Children
                    this.column = (this.vnode.columns || []).map(
                        vnode => vnode.fieldId
                    )
                } else if (field) {
                    this.columns = field.Children
                    this.column = (this.vnode.columns || []).map(
                        vnode => vnode.fieldId
                    )
                }
            }
        }
    }
}
</script>

