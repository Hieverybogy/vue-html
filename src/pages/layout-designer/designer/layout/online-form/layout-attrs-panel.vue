<template>
    <div class="drag-option">
        <el-collapse :value="activeName">
            <el-collapse-item title="基本设置" name="1">
                <div class="item">
                    <div class="title must-star">页面标题</div>
                    <div class="value" ref="pageTitle">
                        <el-input v-model="layoutAttrs.title" @change="addRecord"></el-input>
                    </div>
                </div>
                <div class="item">
                    <div class="title">表单布局</div>
                    <div class="value">
                        <el-radio-group v-model="layoutAttrs.doubleColumns" @change="addRecord">
                            <el-radio :label="false">单列</el-radio>
                            <el-radio :label="true">双列</el-radio>
                        </el-radio-group>
                    </div>
                </div>
                <div class="item">
                    <div class="title">宽度（width）</div>
                    <div class="value">
                        <el-input v-model="layoutAttrs.dialogOption.width" @change="addRecord"></el-input>
                    </div>
                </div>
                <div class="item">
                    <div class="title">高度（top）</div>
                    <div class="value">
                        <el-input v-model="layoutAttrs.dialogOption.top" @change="addRecord"></el-input>
                    </div>
                </div>
                <div class="item" v-if="layoutAttrs.isFlowEnabled">
                    <div class="title must-star">关联orderName字段</div>
                    <div class="value" ref="relateOrderName">
                        <el-select v-model="layoutAttrs.relateOrderName" @change="addRecord">
                            <el-option v-for="(field,index) in dataModel" :key="index" 
                                :label="field.FieldName" :value="field.FieldId">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="item" v-for="(btns, mode) in layoutAttrs.slots.footer" :key="mode">
                    <div class="title" :ref="mode + 'BtnAdd'">底部按钮({{titleDD[mode]}}) <el-button @click="addCustomBtn(mode)" size="small" type="text">新增</el-button></div>
                    <div class="value"
                        :ref="mode + 'btn'"
                        v-for="(btn, i) in btns" :key="btn.guid">
                        <el-checkbox 
                            v-model="btn.useable" @change="addRecord">{{btn.text}}
                            <el-button 
                                v-show="btn.useable" 
                                @click="setOperationBtn(btn, mode, i)" 
                                size="small" type="text">设置
                            </el-button>
                            <el-button 
                                v-show="btn.useable && btn.isCustom" 
                                @click="deleteCustomBtn(mode, i)" 
                                size="small" type="text">删除
                            </el-button>
                        </el-checkbox>
                    </div>
                </div>
                <div class="item">
                    <div class="title">配置列表关联表单id <el-button @click="copyFormId" size="small" type="text">复制</el-button></div>
                    <div class="value">
                        <el-input :value="relativeFormId" readonly></el-input>
                    </div> 
                </div>
            </el-collapse-item>
            <el-collapse-item title="高级设置" name="2">
                <div class="item">
                    <el-button @click="openDrawer" size="small" style="width:100%">编码</el-button>
                </div>
            </el-collapse-item>
        </el-collapse>
        
        <code-drawer :size="'100%'"
            append-to-body 
            :is-flow-enabled="layoutAttrs.isFlowEnabled"
            :visible.sync="drawerVisible"></code-drawer>

        <component :is="settingView"
            :reference="settingReference"
            :vnode="settingVnode"
            v-model="settingVisible"
            @confirm="settingConfirm">
        </component>
    </div>
</template>

<script>
import CodeDrawer from './code-drawer'

export default {
    inject: ['ueditor'],
    components: {
        CodeDrawer,
        'set-operation-btn': () => import('../../components/set-operation-btn')
    },
    props: {
        layoutAttrs: {
            type: Object,
            default () {
                return {
                    dialogOption: {}
                }
            }
        }
    },
    data () {
        return {
            titleDD: {
                Add: '新增模式',
                Edit: '修改模式',
                Adjust: '调整模式',
                View: '查看模式'
            },
            activeName: ['1', '2'],
            drawerVisible: false,
            settingView: '',
            settingReference: null,
            settingVnode: null,
            settingVisible: false
        }
    },
    computed: {
        dataModel() {
            return this.ueditor.dataModel
        },
        relativeFormId () {
            return this.$route.query.pageId
        }
    },
    methods: {
        addRecord () {
            this.ueditor.addRecord()
        },
        openDrawer () {
            this.drawerVisible = true
        },
        setOperationBtn (btn, mode, i) {
            this.settingView = 'set-operation-btn'
            this.settingReference = this.$refs[`${mode}btn`][i]
            this.settingVisible = true
            this.settingVnode = btn
        },
        addCustomBtn (mode) {
            this.settingView = 'set-operation-btn'
            this.addMode = mode
            this.settingReference = this.$refs[mode + 'BtnAdd'][0]
            this.settingVisible = true
            this.settingVnode = null
            this.settingTitle = '新增操作按钮'
        },
        deleteCustomBtn (mode, index) {
            this.layoutAttrs.slots.footer[mode].btns.splice(index, 1)
        },
        addCustomBtnSuccess (btn) {
            this.layoutAttrs.slots.footer[this.addMode].push(btn)
            this.addRecord()
        },
        settingConfirm (action, data) {
            if (action === 'set-operation-btn') {
                this.addCustomBtnSuccess(data)
            }
        },
        copyFormId () {
            this.$copyText(this.relativeFormId).then(
                res => {
                    this.$message({
                        message: '已成功复制，可直接去粘贴',
                        type: 'success'
                    })
                },
                err => {
                    this.$message.error('复制失败，请手动操作')
                }
            )
        }
    },
    created () {
        this.$root.layoutAttrsPanel = this
    }
}
</script>
