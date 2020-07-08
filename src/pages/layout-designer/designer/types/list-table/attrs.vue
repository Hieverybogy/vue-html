<template>
    <div class="drag-option">
        <div class="item">
            <div class="title must-star">绑定字段</div>
            <div class="value">
                <el-input v-model="vnode.fieldId" @change="addRecord"></el-input>
            </div>
        </div>
        <div class="item inline-block">
            <div class="title">自定义列表api</div>
            <div class="value">
                <el-checkbox v-model="vnode.customListApi" @change="customListApiChange"></el-checkbox>
            </div>
        </div>
        <div v-if="vnode.customListApi" class="item">
            <el-button ref="btnCustomApi" @click="setCustomApi" size="small" style="width:100%">自定义api</el-button>
        </div>
        <div class="item">
            <div class="title must-star">添加列</div>
            <div class="value">
                <el-select size="mini" allow-create filterable multiple 
                    v-model="column" 
                    @change="selectCol">
                    <el-option v-for="(item,index) in columns" 
                        :key="index" :label="item.FieldName" :value="item.FieldId"></el-option>
                </el-select>
            </div>
        </div>
        <div class="item">
            <div class="title must-star">指定关键字查询列</div>
            <div class="value">
                <el-select size="mini" allow-create filterable multiple 
                    v-model="vnode.searchKey" 
                    @change="selectCol">
                    <el-option v-for="(item,index) in columns" 
                        :key="index" :label="item.FieldName" :value="item.FieldId"></el-option>
                </el-select>
            </div>
        </div>
        <div class="item inline-block">
            <div class="title">显示操作列</div>
            <div class="value">
                <el-checkbox v-model="vnode.useOperationColumn" @change="addRecord"></el-checkbox>
            </div>
        </div>
        <div class="item">
            <div class="title">操作列名称</div>
            <div class="value">
                <el-input v-model="vnode.operationColumnConfig.label" @change="addRecord"></el-input>
            </div>
        </div>
        <div class="item">
            <div class="title">操作列宽度</div>
            <div class="value">
                <el-input v-model="vnode.operationColumnConfig.width" @change="addRecord"></el-input>
            </div>
        </div>
        <div class="item">
            <div class="title">操作列v-if表达式</div>
            <div class="value">
                <el-input v-model="vnode.operationColumnConfig['v-if-expression']" @change="addRecord"></el-input>
            </div>
        </div>
        <div class="item">
            <div class="title" ref="btnAdd">操作列按钮 <el-button @click="addCustomBtn" size="small" type="text">新增</el-button></div>
            <div class="value">
                <div class="value"
                    ref="btnValue"
                    v-for="(btn, i) in vnode.operationColumnConfig.btns" :key="btn.guid">
                    <el-checkbox 
                        v-model="btn.useable" @change="addRecord">{{btn.text}}
                        <el-button 
                            v-show="btn.useable" 
                            @click="setOperationBtn(btn, i)" 
                            size="small" type="text">设置
                        </el-button>
                        <el-button 
                            v-show="btn.useable && btn.type === 'custom'" 
                            @click="deleteCustomBtn(i)" 
                            size="small" type="text">删除
                        </el-button>
                    </el-checkbox>
                </div>
            </div>
        </div>
        <div class="item inline-block">
            <div class="title">可调整列宽</div>
            <div class="value">
                <el-checkbox v-model="vnode.resizeable" @change="addRecord"></el-checkbox>
            </div>
        </div>
        <div class="item inline-block">
            <div class="title">可分页</div>
            <div class="value">
                <el-checkbox v-model="vnode.pagination" @change="addRecord"></el-checkbox>
            </div>
        </div>
        <div class="item inline-block">
            <div class="title">可全选</div>
            <div class="value">
                <el-checkbox v-model="vnode.checkedAll" @change="addRecord"></el-checkbox>
            </div>
        </div>

        <component :is="settingView"
            :reference="settingReference"
            :vnode="settingVnode"
            v-model="settingVisible"
            in-row
            @confirm="settingConfirm">
        </component>
    </div>
</template>

<script>
import SapiPopover from '../../components/sapi-popover'
import typeMixin from '../type-mixin.js'
export default {
    mixins: [typeMixin],
    components: {
        SapiPopover,
        'set-operation-btn': () => import('../../components/set-operation-btn'),
        'set-custom-api': () => import('../../components/set-custom-api')
    },
    data () {
        return {
            column: null,
            columns: [],
            listDataModel: [],
            settingView: '',
            settingReference: null,
            settingVnode: null,
            settingVisible: false
        }
    },
    watch: {
        vnode: {
            handler() {
                this.initColumn()
            },
            immediate: true
        }
    },
    methods: {
        selectCol () {
            let exsitCols = this.vnode.columns
            let columns = []
            let fields = this.columns
            this.column.forEach(column => {
                let field = fields.find(field => field.FieldId === column)
                let col = exsitCols.find(field => field.fieldId === column)
                if (col) {
                    columns.push(col)
                } else {
                    const dataType = field.FieldType

                    const columnVnode = this.ueditor.preview.Types.$factory('listTableColumn', {
                        fieldId: field.FieldId,
                        fieldName: field.FieldName,
                        dataType: dataType,
                        label: field.FieldName,
                        primaryKey: field.IsPrimaryKey,
                        format: (dataType === 'int' || dataType === 'float') ? 'normal' : (dataType === 'date' ? 'yyyy-MM-dd' : '')
                    }, this.vnode, this.ueditor.layoutAttrs, this.ueditor)

                    columns.push(columnVnode)
                }
            })

            this.vnode.columns = columns

            // 改变需要取消校验信息
            this.$root.$emit('validate-preview-field', this.vnode)

            this.addRecord()
        },
        initColumn () {
            this.column = (this.vnode.columns || []).map(vnode => vnode.fieldId)
        },
        customListApiChange () {
            this.column = []
            // 清空配置列
            this.vnode.columns = []
            this.updateListDataModel()
            this.ueditor.addRecord()
        },
        settingConfirm (action, data) {
            if (action === 'set-operation-btn') {
                this.addCustomBtnSuccess(data)
            } else {
                this.updateListDataModel()
            }
        },
        updateListDataModel () {
            let model
            if (this.vnode.customListApi) {
                const fieldIds = this.vnode.customApiConfig.resListFields
                model = fieldIds.map((item) => {
                    return {
                        FieldId: item.fieldId,
                        FieldName: item.fieldName,
                        FieldType: item.fieldType,
                        IsPrimaryKey: item.primaryKey || false
                    }
                })
            } else {
                model = this.dataModel
            }

            this.listDataModel = model
            // 暂支持：整数、小数、文本、多行文本、日期字段的绑定
            this.columns = this.listDataModel.filter(function (item) {
                return ['text', 'textarea', 'int', 'float', 'date'].indexOf(item.FieldType) > -1
            })
            this.ueditor.addRecord()
        },
        addRecord () {
            this.ueditor.addRecord()
        },
        setCustomApi () {
            this.settingView = 'set-custom-api'
            this.settingReference = this.$refs.btnCustomApi.$el
            this.settingVisible = true
            this.settingVnode = this.vnode
        },
        setOperationBtn (btn, i) {
            this.settingView = 'set-operation-btn'
            this.settingReference = this.$refs.btnValue[i]
            this.settingVisible = true
            this.settingVnode = btn
            this.settingTitle = '设置操作按钮'
        },
        addCustomBtn () {
            this.settingView = 'set-operation-btn'
            this.settingReference = this.$refs.btnAdd
            this.settingVisible = true
            this.settingVnode = null
            this.settingTitle = '新增操作按钮'
        },
        deleteCustomBtn (index) {
            this.vnode.operationColumnConfig.btns.splice(index, 1)
        },
        addCustomBtnSuccess (btn) {
            this.vnode.operationColumnConfig.btns.push(btn)
            this.addRecord()
        }
    },
    created () {
        this.updateListDataModel()
    }
}
</script>

