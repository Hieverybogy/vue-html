
const base = {
    // 当前类型
    type: '',
    // 名称
    label: '',
    // 分类
    category: '',
    // 可使用的布局
    user: [],
    create (opts, parentVnode, context, ueditor) {
        if (this[context.layout]) {
            return this[context.layout].create(opts, parentVnode, context, ueditor)
        }

        throw new Error(`${this.type}未定义${context.layout}布局`)
    },
    // 自定义校验
    getValidator (vnode, parentVnode, context) {
        if (this[context.layout] && this[context.layout]['getValidator']) {
            return this[context.layout].getValidator(vnode, parentVnode, context)
        }

        return null
    },
    parseVnode (vnode, parentVnode, context) {
        if (this[context.preview.layout]) {
            return this[context.preview.layout].parseVnode(vnode, parentVnode, context)
        }

        throw new Error(`${this.type}未定义${context.preview.layout}布局`)
    },
    parseApi(vnode, optionsProp, context) {
        if (context.locked) {
            return
        }

        if (vnode.dataSourceType === 'custom') {
            context.data[optionsProp] = vnode.options || []
        } else if (vnode.dataSourceType === 'api') {
            context.data[optionsProp] = []
            if (Vue.$utils.isObject(vnode.api)) {
                const api = vnode.api
                const { paramsStr, pathStr } = base.parseParamValueSource(api.params)
                const method = `get${vnode.guid}_options`
                context.methods[method] = {
                    name: method,
                    args: '',
                    content: `
                        var _this = this
                        var url = this.$${api.server}Url + '${api.path.indexOf('/') === 0 ? api.path : ('/' + api.path)}'
                        var pathParams = {
                            ${pathStr}
                        }
                        var params = {
                            ${paramsStr}
                        }

                        url = this.$utils.replacePathParams(url, pathParams)
                        this.$get(url, params, function (res) {
                            if (!res) {
                                return
                            }

                            _this.${optionsProp} = ${api.value ? `res.map(function (item) {
                                return { label: item.${api.label}, value: item.${api.value} }
                            })` : 'res'}
                        })
                    `
                }

                context.created += `
                    this.${method}()
                `
            }
        }
    },
    parseParamValueSource (paramsConfig) {
        let paramsStr = ''
        let pathStr = ''
        let bodyStr = ''
        paramsConfig.forEach((param) => {
            let propStr = ''
            switch (param.paramValueSource) {
                case 'const':
                    propStr = `${param.paramId}: '${param.paramValue}'`
                    break
                case 'urlParam':
                    propStr = `${param.paramId}: this.$route.query['${param.paramValue}']`
                    break
                case 'filterField':
                    propStr = `${param.paramId}: this.params['${param.paramValue}']`
                    break
                case 'rowProp':
                    propStr = `${param.paramId}: row['${param.paramValue}']`
                    break
                case 'dataProp':
                    propStr = `${param.paramId}: this.${param.paramValue}`
                    break
                case 'loginInfo':
                    propStr = `${param.paramId}: this.$getBasicInfo() && this.$getBasicInfo().id`
                    break
            }

            switch(param.paramType) {
                case 'query':
                    paramsStr += (paramsStr ? ',\n' : '') + propStr
                    break
                case 'path':
                    pathStr += (pathStr ? ',\n' : '') + propStr
                    break
                case 'bodyProp':
                    bodyStr += (bodyStr ? ',\n' : '') + propStr
                    break
            }
        })

        return {
            paramsStr,
            pathStr,
            bodyStr
        }
    },
    parseDefaultValue (vnode, parentVnode, context) {
        const getLoginInfoValue = function (vnode) {
            if (vnode.defaultValue) {
                let str = 'loginInfo'
                let parentFix = str
                const arr = vnode.defaultValue.split('.')
                arr.forEach(function (prefix, i) {
                    parentFix += `.${prefix}`
                    str += ` && ${parentFix}`
                })

                str += ` || ''`

                return str
            }

            return ''
        }
        if (context.locked || !vnode.defaultValueType || vnode.defaultValueType === 'none') {
            return
        }

        const colleciton = context.data.defaultValueCollection = context.data.defaultValueCollection || {}
        switch (vnode.defaultValueType) {
            case 'loginInfo':
                colleciton.loginInfo = colleciton.loginInfo || []
                colleciton.loginInfo.push(`this.${vnode.model}${vnode.fieldId ? `.${vnode.fieldId}` : ''} = ${getLoginInfoValue(vnode)}`)
                break
            case 'now':
                colleciton.now = colleciton.now || []
                colleciton.now.push(`this.${vnode.model}${vnode.fieldId ? `.${vnode.fieldId}` : ''} = this.$utils.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')`)
                break
            case 'const':
                colleciton.const = colleciton.const || []
                colleciton.const.push(`this.${vnode.model}${vnode.fieldId ? `.${vnode.fieldId}` : ''} = '${vnode.attrs.value || ''}'`)
                break
        }
    },
    parseListeners (vnode) {
        const listeners = vnode.listeners
        let listenersStr = ''
        if (listeners) {
            Object.keys(listeners).forEach(function (eventName) {
                // name: '', args: [] || '',  execution: false
                const mOption = listeners[eventName]
                listenersStr += `@${eventName}="${mOption['name'] + (mOption.execution ? `(${typeof mOption.args === 'string' ? mOption.args : mOption.args.join(', ')})` : '')}"\n`
            })
        }

        return listenersStr
    }
}

export default base
