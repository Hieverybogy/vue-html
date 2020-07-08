<template>
    <sapi-dialog v-model="visible" 
        :width="width" :top="top" 
        @on-open="open" @on-close="close"
        class="set-code">
        <span slot="title">{{title}}</span>

        <base-code-editor
            ref="editor"
            :value="code"
            :language="language"
            :readonly="readonly"
            :height="editorHeight"></base-code-editor>

        <div class="footer">
            <el-button size="small" class="cancel" @click="close">取消</el-button>
            <el-button type="primary" size="small" @click="confirm">确定</el-button>
        </div>
    </sapi-dialog>
</template>

<script>
import BaseCodeEditor from './base-code-editor'
import { parse } from '@babel/parser'
import beautifier from 'beautifier'
import BeautifierConf from './beautifier-conf'

export default {
    components: {
        BaseCodeEditor
    },
    props: {
        // 弹窗可见
        value: Boolean,
        /**
         * {
         *     title: '',
                width: '600px',
                top: '100px',
                code: '',
                language: 'javascript',
                readonly: false,
                editorHeight: '400px',
                // 是否格式化代码
                beautifier: 'js/html/css',
                // 确认回调，返回true即可关闭弹窗
                confirm: function (code, ast) {}
         * }
         */
        option: Object
    },
    data () {
        return {
            visible: false,
            title: '',
            width: '80%',
            top: '10%',
            code: '',
            language: 'javascript',
            readonly: false,
            editorHeight: '400px'
        }
    },
    watch: {
        value (val) {
            this.visible = val
        }
    },
    methods: {
        open () {
            const isBeautifier = this.option['beautifier']
            for(let prop in this.option) {
                if (prop === 'confirm' || prop === 'beautifier') {
                    continue
                }

                // 处理代码格式化
                if (prop === 'code' && isBeautifier) {
                    this[prop] = beautifier[isBeautifier](this.option.code, BeautifierConf[isBeautifier])
                    continue
                }

                this[prop] = this.option[prop]
            }
        },
        close () {
            this.$emit('input', false)
        },
        confirm () {
            const code = this.$refs.editor.getValue()
            try {
                const ast = parse(code, { sourceType: 'module' })

                if (this.$utils.isFunction(this.option.confirm)) {
                    if (this.option.confirm(code, ast)) {
                        this.$emit('input', false)
                    }
                } else {
                    this.$emit('input', false)
                }
            } catch (err) {
                Vue.errorMsg(`js错误：${err}`)
            }
        }
    },
    created () {
        this.visible = this.value
    }
}
</script>

<style lang="less">
    .set-code{
        .dialog-box-body{
            margin-bottom: 60px;
        }
    }
</style>
