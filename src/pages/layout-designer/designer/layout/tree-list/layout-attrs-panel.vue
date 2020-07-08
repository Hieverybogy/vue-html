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
                <el-checkbox v-model="layoutAttrs.slots.btns.visible" @change="addRecord">显示操作区</el-checkbox>
            </div>
        </div>
        <div class="item inline-block" v-if="layoutAttrs.slots.filters.visible">
            <div class="title">关键字搜索</div>
            <div class="value">
                <el-checkbox v-model="searchVisible" @change="addRecord"></el-checkbox>
            </div>
        </div>
        <div class="item" v-if="layoutAttrs.slots.btns.visible">
            <div class="title">操作按钮</div>
            <el-checkbox-group v-model="operationBtns" @change="changeOperationBtns">
                <div class="value"
                    v-for="btn in operationBtnsOptions" :key="btn.type">
                    <el-checkbox 
                        :label="btn.type">{{btn.text}}</el-checkbox>
                </div>
            </el-checkbox-group>
        </div>
        <div class="item" v-if="useImport">
            <div class="title must-star">导入模板路径</div>
            <div ref="importTemplate">
                <el-input v-model="importBtn.template"></el-input>
            </div>
        </div>
        <div class="item" v-if="useImport">
            <div class="title must-star">导入api</div>
            <div ref="importApi">
                <el-input v-model="importBtn.api"></el-input>
            </div>
        </div>
        <div class="item" v-if="useExport">
            <div class="title must-star">导出api</div>
            <div ref="exportApi">
                <el-input v-model="exportBtn.api"></el-input>
            </div>
        </div>
        <div class="item" v-if="false">
            <div class="title">初始化api</div>
            <div class="value">
                <el-input v-model="layoutAttrs.api"></el-input>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    inject: ['ueditor'],
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
            operationBtns: [],
            operationBtnsOptions: [
                { type: 'add', text: '新增' },
                { type: 'edit', text: '修改' },
                { type: 'delete', text: '删除' },
                { type: 'import', text: '导入', title: '', api: '', template: '' },
                { type: 'export', text: '导出', title: '', api: '' }
            ],
            searchVisible: false,
            importBtn: null,
            exportBtn: null
        }
    },
    computed: {
        useImport () {
            if (!this.layoutAttrs.slots.btns.visible) {
                return false
            }
            const vnodes = this.layoutAttrs.slots.btns.vnodes.filter((vnode) => {
                return vnode.type === 'import'
            })
            return vnodes.length > 0
        },
        useExport () {
            if (!this.layoutAttrs.slots.btns.visible) {
                return false
            }
            const vnodes = this.layoutAttrs.slots.btns.vnodes.filter((vnode) => {
                return vnode.type === 'export'
            })
            return vnodes.length > 0
        }
    },
    watch: {
        layoutAttrs: {
            handler (val) {
                this.initOperationBtns()
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
        initOperationBtns () {
            if (!this.layoutAttrs) {
                return
            }
            const btns = this.layoutAttrs.slots.btns.vnodes

            this.operationBtns = btns.map((item) => {
                if (item.type === 'import') {
                    this.importBtn = item
                    this.operationBtnsOptions[3] = item
                    this.$set(this.operationBtnsOptions, 3, item)
                }

                if (item.type === 'export') {
                    this.importBtn = item
                    this.$set(this.operationBtnsOptions, 4, item)
                }

                return item.type
            })
        },
        changeOperationBtns (btnTypes) {
            const rst = []
            for (let i = 0, len = this.operationBtnsOptions.length; i < len; i++) {
                let typeObj = btnTypes.filter((type) => {
                    return type === this.operationBtnsOptions[i].type
                })

                if (typeObj.length > 0) {
                    rst.push(this.operationBtnsOptions[i])
                }
            }

            this.layoutAttrs.slots.btns.vnodes = rst
            this.addRecord()
        },
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
        }
    },
    created () {
        this.$root.layoutAttrsPanel = this
        this.importBtn = this.operationBtnsOptions[3]
        this.exportBtn = this.operationBtnsOptions[4]
    }
}
</script>
