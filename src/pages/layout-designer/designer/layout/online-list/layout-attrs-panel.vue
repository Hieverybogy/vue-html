<template>
    <div class="drag-option">
        <div class="item">
            <div class="title must-star">页面标题</div>
            <div class="value" ref="pageTitle">
                <el-input v-model="layoutAttrs.title" @change="addRecord"></el-input>
            </div>
        </div>
        <div class="item">
            <div class="title">表单布局</div>
            <div class="value">
                <el-checkbox v-model="layoutAttrs.slots.filters.visible" @change="addRecord">显示过滤区</el-checkbox>
            </div>
            <div class="value">
                <el-checkbox v-model="layoutAttrs.slots.moreFilters.visible" @change="addRecord">显示更多过滤区</el-checkbox>
            </div>
            <div class="value">
                <el-checkbox v-model="layoutAttrs.slots.btns.visible" @change="addRecord">显示操作按钮区</el-checkbox>
            </div>
        </div>
        <div class="item inline-block" v-if="layoutAttrs.slots.filters.visible">
            <div class="title">关键字搜索</div>
            <div class="value">
                <el-checkbox v-model="searchVisible" @change="addRecord"></el-checkbox>
            </div>
        </div>
        <div>
            <div class="title">关联表单id</div>
            <div class="value">
                <el-input v-model="layoutAttrs.relativeFormId" @change="addRecord"></el-input>
            </div> 
        </div>
        <div class="item" v-if="layoutAttrs.slots.btns.visible">
            <div class="title" ref="customBtn">操作按钮 <el-button @click="addCustomBtn" size="small" type="text">新增</el-button></div>
           
            <div class="value"
                ref="btnValue"
                v-for="(btn, i) in layoutAttrs.slots.btns.vnodes" :key="btn.guid">
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
        <div class="item">
            <div class="title">配置菜单链接地址 <el-button @click="copyOnlineUrl" size="small" type="text">复制</el-button></div>
            <div class="value">
                <el-input :value="onlineUrl" readonly></el-input>
            </div> 
        </div>
        <div class="item">
            <el-button @click="openDrawer" size="small" style="width:100%">编码</el-button>
        </div>

        <code-drawer :size="'100%'"
            append-to-body
            :visible.sync="drawerVisible"></code-drawer>

        <component :is="settingView"
            :reference="reference"
            :vnode="settingVnode"
            v-model="settingVisible"
            :title="settingTitle"
            @confirm="addCustomBtnSuccess">
        </component>
    </div>
</template>

<script>
import CodeDrawer from './code-drawer'

export default {
    inject: ['ueditor'],
    components: {
        CodeDrawer,
        'set-operation-btn': () => import('../../components/set-operation-btn'),
        'import-setting': () => import('./import-setting'),
        'export-setting': () => import('./export-setting')
    },
    props: {
        layoutAttrs: {
            type: Object,
            default () {
                return {
                    title: '',
                    slots: {
                        filters: {
                            visible: true
                        },
                        btns: {
                            visible: true
                        }
                    }
                }
            }
        }
    },
    data () {
        return {
            searchVisible: false,
            drawerVisible: false,
            reference: null,
            settingVnode: null,
            settingVisible: false,
            settingView: '',
            settingTitle: ''
        }
    },
    computed: {
        onlineUrl () {
            return `/online-list.html#/list/${this.$route.query.pageId}?appCode=${this.$route.query.appCode}`
        }
    },
    watch: {
        layoutAttrs: {
            handler (val) {
                this.updateSearchVisible()
            },
            immediate: true,
            deep: true
        },
        searchVisible (visible) {
            if (visible) {
                this.addKeywordSearch()
            } else {
                this.removeKeywordSearch()
            }
        }
    },
    methods: {
        addKeywordSearch () {
            this.ueditor.preview.vm.addKeywordSearch()
        },
        removeKeywordSearch () {
            this.ueditor.preview.vm.removeKeywordSearch()
        },
        updateSearchVisible () {
            if (this.ueditor && this.ueditor.preview) {
                const index = this.ueditor.preview.vm.keywordSearchIndexOf()
                this.searchVisible = index > -1
            }
        },
        addRecord () {
            this.ueditor.addRecord()
        },
        openDrawer () {
            this.drawerVisible = true
        },
        setOperationBtn (btn, i) {
            this.settingVnode = btn
            this.reference = this.$refs.btnValue[i]
            this.settingVisible = true
            let view = `${btn.type}-setting`
            if (btn.type === 'btn' || btn.type === 'add' || btn.type === 'custom') {
                view = 'set-operation-btn'
            }
            this.settingTitle = '设置操作按钮'
            this.settingView = view
        },
        addCustomBtn () {
            this.settingVnode = null
            this.reference = this.$refs.customBtn
            this.settingVisible = true
            this.settingView = 'set-operation-btn'
            this.settingTitle = '新增操作按钮'
        },
        addCustomBtnSuccess (btn) {
            this.layoutAttrs.slots.btns.vnodes.push(btn)
            this.addRecord()
        },
        deleteCustomBtn (i) {
            this.layoutAttrs.slots.btns.vnodes.splice(i, 1)
            this.addRecord()
        },
        copyOnlineUrl () {
            this.$copyText(this.onlineUrl).then(
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

<style scoped>
.custombtns-warp{
    font-size:12px;
    padding-left: 25px;
}
</style>
