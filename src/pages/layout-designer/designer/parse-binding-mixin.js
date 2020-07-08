import { parse } from '@babel/parser'

export default {
    data () {
        return {
            // 用于给组件绑定方法的集合
            bindingMethodsOption: null,
            // 用于给组件绑定data的集合
            bindingDataOption: null
        }
    },
    computed: {
        attrsCode () {
            return (this.layoutAttrs && this.layoutAttrs.mixinCode || '') + (this.layoutAttrs && this.layoutAttrs.code || '')
        }
    },
    watch: {
        attrsCode () {
            this.bindingMixinCodeProps = this.parseBindingProps(this.layoutAttrs.mixinCode)
            this.bindingCodeProps = this.parseBindingProps(this.layoutAttrs.code)
            this.bindingMethodsOption = Object.assign({}, this.bindingMixinCodeProps.methods, this.bindingCodeProps.methods)
            this.bindingDataOption = Object.assign({}, this.bindingMixinCodeProps.data, this.bindingCodeProps.data)
        }
    },
    methods: {
        // 解析可绑定的方法和属性
        parseBindingProps (vueOptionsCode) {
            let bindingProps = {
                data: {},
                methods: {}
            }

            try {
                const ast = parse(`export default ${vueOptionsCode || '{}'}`, { sourceType: 'module' })

                bindingProps = this.parseBindingPropsByAst(ast)
            } catch (err) {
                Vue.errorMsg(`js解析错误：${err}`)
            }

            return bindingProps
        },
        parseBindingPropsByAst (ast) {
            const bindingProps = {
                data: {},
                methods: {}
            }

            // 解析可绑定的属性和方法
            const propParser = {
                'data': function (node, parentKeyName) {
                    if (node.type === 'ObjectExpression') {
                        node.properties.forEach((n) => {
                            if (n.type === 'ObjectProperty') {
                                const keyName = (parentKeyName && (parentKeyName + '.') || '') + (n.key.type === 'StringLiteral' ? n.key.value : n.key.name)
                                bindingProps.data[keyName] = keyName

                                if (n.value.type === 'ObjectExpression') {
                                    propParser.data(n.value, keyName)
                                }
                            }
                        })
                    } else if (node.type === 'FunctionExpression' && !parentKeyName) {
                        const bodys = node.body && node.body.body
                        if (!bodys) {
                            return
                        }

                        bodys.forEach((b) => {
                            if (b.type === 'ReturnStatement' && b.argument.type === 'ObjectExpression') {
                                propParser.data(b.argument)
                            }
                        })
                    }
                },
                'computed': function (node) {
                    if (node.type === 'ObjectExpression') {
                        node.properties.forEach((n) => {
                            const keyName = n.key.type === 'StringLiteral' ? n.key.value : n.key.name
                            bindingProps.data[keyName] = keyName
                        })
                    }
                },
                'methods': function (node) {
                    if (node.type === 'ObjectExpression') {
                        node.properties.forEach((n) => {
                            if (n.value.type === 'FunctionExpression') {
                                bindingProps.methods[n.key.name] = `${n.key.name}(${n.value.params.map(function (p) { return p.name }).join(',')})`
                            }
                        })
                    }
                }
            }

            if (ast.program.body[0] && ast.program.body[0].type === 'ExportDefaultDeclaration' &&
                ast.program.body[0].declaration.type === 'ObjectExpression') {
                const props = ast.program.body[0].declaration.properties
                props.forEach((node) => {
                    if (propParser[node.key.name]) {
                        propParser[node.key.name](node.value)
                    }
                })
            }

            return bindingProps
        }
    }
}
