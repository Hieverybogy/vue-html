<template>
    <sapi-popover 
        popper-class="sapi-binding-prop-popover"
        v-model="visible"
        :width="600"
        :height="500"
        :title="title"
        :reference="reference"
        @after-enter="afterEnter"
        @confirm="confirm">

        <div class="sapi-binding-prop-box">
            <el-row :gutter="10">
                <el-col :span="6">
                    <div class="sapi-binding-prop-left">
                        <el-scrollbar class="page-component__scroll" tag="ul">
                            <li class="sapi-binding-prop-item" 
                                v-for="p in bindingProps" 
                                :key="p" 
                                :title="p"
                                @click="insertBindingProp(p)">
                                {{p}}
                            </li>
                        </el-scrollbar>
                    </div>
                </el-col>
                <el-col :span="18">
                    <div class="sapi-binding-prop-right">
                        <div class="binding-code-editor-top">
                            <base-code-editor 
                                ref="vnodeHtml" 
                                :value="expressionPreview"
                                class="binding-prop-html-editor"
                                language="html"
                                beautifier="html"
                                readonly
                                manual-render
                                :options="{
                                    minimap: {
                                        enabled:false
                                    },
                                    wordWrap: 'on',
                                    lineNumbersMinChars: 2,
                                    lineDecorationsWidth: 2,
                                    overviewRulerBorder: false,
                                    wrappingIndent:'indent',
                                    scrollbar: {
                                        horizontalHasArrows:false,
                                        horizontal:'hidden',
                                        vertical: 'hidden'
                                    }
                                }"></base-code-editor>
                        </div>

                        <div class="binding-code-operation-wrap">
                           <label>运算符：</label>
                           <el-button-group>
                                <el-button size="mini" @click="insertBindingProp('&&')">&&</el-button>
                                <el-button size="mini" @click="insertBindingProp('||')">||</el-button>
                                <el-button size="mini" @click="insertBindingProp('===')">===</el-button>
                                <el-button size="mini" @click="insertBindingProp('!==')">!==</el-button>
                                <el-button size="mini" @click="insertBindingProp('>')">></el-button>
                                    <el-button size="mini" @click="insertBindingProp('<')"><</el-button>
                                <el-button size="mini" @click="insertBindingProp('>=')">>=</el-button>
                                <el-button size="mini" @click="insertBindingProp('<=')"><=</el-button>
                                <el-button size="mini" @click="insertBindingProp('?')">?</el-button>
                                <el-button size="mini" @click="insertBindingProp(':')">:</el-button>
                            </el-button-group>
                        </div>

                        <div class="binding-code-editor-bottom">
                            <base-code-editor 
                                ref="codeEditor" 
                                class="binding-prop-editor"
                                :value="expression"
                                language="javascript"
                                @input="updateValue"
                                manual-render
                                :options="{
                                    minimap: {
                                        enabled:false
                                    },
                                    wordWrap: 'on',
                                    lineNumbersMinChars: 2,
                                    lineDecorationsWidth: 2,
                                    overviewRulerBorder: false,
                                    scrollbar: {
                                        horizontalHasArrows:false,
                                        horizontal:'hidden',
                                        vertical: 'hidden'
                                    }
                                }"></base-code-editor>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
    </sapi-popover>
</template>

<script>
import SapiPopover from './sapi-popover'
import BaseCodeEditor from './base-code-editor'

export default {
	inject: ['ueditor'],
    components: {
        SapiPopover,
        BaseCodeEditor
    },
    props: {
        value: {
            type: Boolean,
            default: false
        },
        vnode: Object,
        // popover弹窗指向的元素对象
        reference: {
            validator: function (el) {
                if (el && el.nodeType === 1) {
                    return true
                }
                return false
            },
            required: true
        },
        // 条件属性或者绑定字段
        conditionProp: {
            type: String,
            default: '',
            required: true
        },
        // 条件属性或者绑定字段所在元素
        bindingPropTagName: {
            type: String,
            default: '',
            required: true
        }
    },
    data () {
        return {
            visible: false,
            propExpression: '',
            vnodeHtml: ''
        }
    },
    computed: {
        bindingProps () {
            return this.ueditor.bindingDataOption || {}
        },
        isDerective () {
            return this.conditionProp.indexOf('v-') === 0
        },
        expression () {
            const reg = new RegExp(`<${this.bindingPropTagName}[^>]*?(:?${this.conditionProp}="([^"]*)")`)
            const rst = reg.exec(this.vnodeHtml)

            if (rst) {
                // 未动态绑定将绑定值加单引号
                return (this.isDerective || rst[1].indexOf(':') === 0) ? rst[2] : `'${rst[2]}'`
            } else {
                return ''
            }
        },
        title () {
            return `设置${this.conditionProp}表达式`
        },
        expressionPreview () {
            let exp = this.vnodeHtml
            const reg = new RegExp(`<${this.bindingPropTagName}[^>]*?(:?${this.conditionProp}="([^"]*)")`)
            const rst = reg.exec(exp)
            if (rst) {
                // 未动态绑定的情况添加":"
                if (!this.isDerective && rst[1].indexOf(':') !== 0) {
                    exp = exp.replace(rst[1], `:${rst[1]}`)
                }
                exp = exp.replace(rst[2], this.propExpression)
            } else {
                // 插入指令，不同vnode、不同conditionProp替换可能不同
                exp = exp.replace(new RegExp(`<${this.bindingPropTagName}`), (patt) => {
                    return patt + ` ${this.isDerective ? '' : ':'}${this.conditionProp}="${this.propExpression}"`
                })

            }

            return exp
        }
    },
    watch: {
        visible (val) {
            this.$emit('input', val)
        },
        value: {
            handler (val) {
                this.visible = val

                if (val) {
                    try {
                        let html = this.ueditor.preview.parseVnode(this.vnode, null, { 
                            mode: 'Add', 
                            data: [], 
                            methods: [], 
                            locked: true, 
                            preview: this.ueditor.preview, 
                            // 仅预览当前构建元素
                            previewCurrentVnode: true
                        })

                        if(this.$utils.isArray(html)) {
                            html = html.join('')
                        }
                        this.vnodeHtml = html
                    }catch(err) {
                        console.log(err)
                    }
                    this.propExpression = this.expression
                }
            },
            immediate: true
        },
        vnode () {
            if (this.visible) {
                this.$emit('input', false)
            }
        },
        expressionPreview () {
            if (this.visible) {
                this.selectUpdateCode()
            }
        }
    },
    methods: {
        afterEnter () {
            this.$refs.codeEditor.render()
            this.$refs.codeEditor.focusEnd()
            this.$refs.vnodeHtml.render()
            this.selectUpdateCode()
        },
        close () {
            this.$emit('input', false)
        },
        confirm () {
            if (this.$refs.codeEditor) {
                let vnode = this.vnode
                // 明细列除了label/v-if特殊处理
                if (vnode.type === 'column' && this.conditionProp !== 'label' && 
                    this.conditionProp !== 'v-if') {
                    vnode = this.vnode.vnode
                }
                // this.vnode.attrs[`${this.conditionProp}-expression`] = this.$refs.codeEditor.getValue().replace(/^\s+|\s+$/gm,'')
                this.$set(vnode.attrs, `${this.conditionProp}-expression`, this.$refs.codeEditor.getValue().replace(/^\s+|\s+$/gm,''))
                this.$emit('input', false)
                this.ueditor.addRecord()
            }
        },
        insertBindingProp (p) {
            if (this.$refs.codeEditor) {
                this.$refs.codeEditor.insertContent(`${p} `)
            }
        },
        updateValue (val) {
            this.propExpression = val
        },
        selectUpdateCode () {
            // 选中编辑的代码
            if (this.$refs.vnodeHtml) {
                const code = `${this.isDerective ? '' : ':'}${this.conditionProp}="${this.propExpression}"`
                this.$nextTick(function () {
                    this.$refs.vnodeHtml.findAndSelectRange(code)
                })
            }
        }
    }
}
</script>

<style lang="less">
@import "~@/static/css/sapi-variables";
    .sapi-binding-prop-popover{

        .sapi-binding-prop-box{
            height: 500px;
            padding: 0 10px;
        }

        .sapi-binding-prop-left,.sapi-binding-prop-right{
            height: 500px;
        }

        .sapi-binding-prop-left,  .binding-code-editor-top, .binding-code-editor-bottom{
            border: 1px solid @--border-color-base;
            border-radius: @--border-radius-base; 
            box-sizing: border-box;
        }

        .binding-code-operation-wrap{
            height: 40px;
            display:flex;
            align-items: center;

            & .el-button--mini{
                width:35px;
                padding-left:0;
                padding-right:0;
            }
        }

        .binding-code-editor-top{
            height: 230px;
        }

        .binding-code-editor-bottom{
            height: 230px;
        }

        .binding-code-editor-top, .binding-code-editor-bottom{
            position:relative;
        }

        .binding-prop-editor, .binding-prop-html-editor{
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 2px;
            font-size: 14px;
        }

        .sapi-binding-prop-item{
            position: relative;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            height: 34px;
            line-height: 34px;
            box-sizing: border-box;
            cursor: pointer;
            padding: 0 5px;
            &:hover {
                background-color: @--background-color-base;
            }
        }
    }


</style>