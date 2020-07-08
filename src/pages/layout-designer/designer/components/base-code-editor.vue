<template>
    <div></div>
</template>

<script>
// 需引入monaco.html模板
import monaco from 'monaco'
import { parse } from '@babel/parser'
import beautifier from 'beautifier'
import BeautifierConf from './beautifier-conf'

/**
 * 代码编辑器 由monaco实现
 */
export default {
    props: {
        /**
         * 编辑器内容
         */
        value: {
            type: String,
            required: true,
            default: ''
        },
        /**
         * 代码语言：javascript/css/html
         */
        language: {
            type: String,
            required: true,
            default: 'javascript'
        },
        /**
         * 主题
         */
        theme: {
            type: String,
            // vs-dark/vs/hc-black 
            default: 'vs'
        },
        readonly: {
            type: Boolean,
            default: false
        },
        /**
         * monaco第二个参数
         */
        options: {
            type: Object,
            default () {
                return {}
            }
        },
        // 格式化类型：js/html/css，赋值时美化代码
        beautifier: String,
        manualRender: {
            type: Boolean,
            default: false
        },
        automaticLayout: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        theme () {
            this.setTheme()
        },
        value () {
            if (!this.manualRender || 
                this.isRendered && this.manualRender ) {
                this.render()
            }
        }
    },
    methods: {
        render () {
            if (!this.$el) {
                return
            }
            this.isRendered = true

            if (!this.codeEditor) {
                this.codeEditor = monaco.editor.create(this.$el, {
                    automaticLayout: this.automaticLayout,
                    ...this.options,
                    model: null,
                    readOnly: this.readonly,
                    theme: this.theme
                })

                this.codeEditor.onDidChangeModelContent(() => {
                    const newValue = this.codeEditor.getValue()
                    this.$emit('input', newValue)
                })
            }

            var oldModel = this.codeEditor.getModel()
            var value = this.value
            if (this.beautifier) {
                value = beautifier[this.beautifier](this.value, BeautifierConf[this.beautifier])
            }

            var newModel = monaco.editor.createModel(value, this.language)
            this.codeEditor.setModel(newModel)

            if (oldModel) {
                oldModel.dispose()
            }
        },
        dispose () {
            if (this.codeEditor) {
				if (this.codeEditor.getModel()) {
					this.codeEditor.getModel().dispose()
				}
				this.codeEditor.dispose()
				this.codeEditor = null
			}
        },
        setTheme (theme) {
            if (!this.codeEditor) {
                this.$nextTick(() => {
                    this.setTheme()
                })
            } else {
                this.codeEditor.setTheme(theme)
            }
        },
        getValue () {
            if (this.codeEditor) {
                return this.codeEditor.getValue()
            }

            return this.value
        },
        insertContent (text) {
            if (this.codeEditor) {
                let selection = this.codeEditor.getSelection()
                let range = new monaco.Range(selection.startLineNumber, selection.startColumn, selection.endLineNumber, selection.endColumn)
                let id = { major: 1, minor: 1 }
                let op = {identifier: id, range: range, text: text, forceMoveMarkers: true}
                this.codeEditor.executeEdits(this.getValue(), [op])
                this.codeEditor.focus()
            }
        },
        focus () {
            if (this.codeEditor) {
                this.codeEditor.focus()
            }
        },
        focusEnd () {
            if (this.codeEditor) {
                const model = this.codeEditor.getModel()
                const range = model.getFullModelRange()
                this.codeEditor.setPosition(new monaco.Position(range.endColumn, range.endLineNumber))
                this.codeEditor.focus()
            }
        },
        findAndSelectRange (text) {
            if (this.codeEditor) {
                const model = this.codeEditor.getModel()
                const rst = model.findNextMatch(text, new monaco.Position(1, 1), false, false, null, false)
                if (rst) {
                    this.codeEditor.setSelection(rst.range)
                }
            }
        }
    },
    mounted () {
        // monaco实例对象
        this.codeEditor = null
        this.isRendered = false
        if (!this.manualRender) {
            this.render()
        }
    },
    beforeDestory () {
        this.dispose()
    }
}
</script>
