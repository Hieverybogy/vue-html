import Base from '../base'
const base = Object.create(Base)

Object.assign(base, {
    type: 'btn',
    label: '按钮',
    // 分类
    category: '',
    // 可使用的布局
    user: ['online-form', 'online-list'],
    index: 999,
    create (opts, parentVnode, context) {
        const defaultOpts = {
            guid: 'btn_' + Vue.$utils.guid(8),
            type: 'btn',
            // 是否自定义按钮
            isCustom: false,
            // 按钮主题
            btnType: '',
            text: '按钮',
            useable: true,
            clickEvent: '',
            // 是否提交按钮
            isSubmit: false,
            clickEventArgs: '',
            'v-if-expression': '',
            // 自定义方法
            usage: 'custom',
            openUrl: '',
            openWay: '_blank', // '_seft'
            openUrlParams: [
            ],
            execution: false,
            apiServer: '',
            apiType: '',
            apiUrl: '',
            apiParams: [],
            useConfirm: false,
            confirmMsg: '',
            apiSuccessMsg: '',
            apiSuccess: '',
            apiFail: ''
        }

        return Object.assign(defaultOpts, opts || {})
    },
    parseVnode (vnode, parentVnode, context) {
        if (!vnode.useable) {
            return ''
        }

        if (vnode.usage === 'openPage') {
            this.parseOpenPageBtn(vnode, parentVnode, context)
        } else if (vnode.usage === 'ajax') {
            this.parseAjaxBtn(vnode, parentVnode, context)
        }

        if (vnode.isSubmit) {
            context.data.disabled = false
        }

        const permission = vnode['v-if-expression'] ? `v-if="${vnode['v-if-expression']}"` : ''
        const clickFn = `@click="${vnode.clickEvent}${vnode.execution ? `(${vnode.clickEventArgs})` : ''}"`

        // 列表操作列的按钮设置
        if (parentVnode && parentVnode.type === 'listTable') {
            return `
                <a ${vnode['v-if-expression'] ? `v-if="${vnode['v-if-expression']}"` : ''}
                    class="table-btn"
                    href="javascript:void(0)"
                    @click.stop="${vnode.clickEvent}${vnode.execution ? `(${vnode.clickEventArgs})` : ''}">
                    ${vnode.text}
                </a>
            `
        }

        return `<el-button size="small" ${permission} 
            ${vnode.btnType ? `type="${vnode.btnType}"` : ''}
            ${clickFn}
            ${vnode.isSubmit ? ':disabled="disabled"' : ''}>${vnode.text}</el-button>`
    },
    parseOpenPageBtn (vnode, parentVnode, context) {
        const { paramsStr, pathStr } = Base.parseParamValueSource(vnode.openUrlParams)
        const method = `${vnode.guid}_click`
        const isInListTable = parentVnode && parentVnode.type === 'listTable' || false
        vnode.clickEvent = method
        vnode.execution = isInListTable
        vnode.clickEventArgs = isInListTable ? 'props.row, props.$index' : ''

        context.methods[method] = {
            name: method,
            args: isInListTable ? 'row, index' : '',
            content: `
                var url = '${vnode.openUrl}'
                var pathParams = {
                    ${pathStr}
                }
                var params = {
                    ${paramsStr}
                }

                url = this.$utils.replacePathParams(url, pathParams)
                url = this.$utils.setQueryString(params, url)

                this.$utils.${vnode.openWay === '_blank' ? 'innerOpen' : 'innerRedirect'}(url)
            `
        }
    },
    parseAjaxBtn (vnode, parentVnode, context) {
        const isInListTable = parentVnode && parentVnode.type === 'listTable' || false
        const { paramsStr, pathStr, bodyStr } = Base.parseParamValueSource(vnode.apiParams)
        const method = `${vnode.guid}_click`
        vnode.clickEvent = method
        vnode.execution = isInListTable
        vnode.clickEventArgs = isInListTable ? 'props.row, props.$index' : ''

        const requestStr = `
            _this.$${vnode.apiType}(url, ${bodyStr ? 'body, ' : ''} function (res) {
                ${vnode.apiSuccess ? `_this.${vnode.apiSuccess}(res)` : ''}
                ${vnode.apiSuccessMsg ? `Vue.successMsg('${vnode.apiSuccessMsg}')` : ''}
            }, function (error) {
                ${vnode.apiFail ? `_this.${vnode.apiFail}(error)` : ''}
            })
        `
        context.methods[method] = {
            name: method,
            args: isInListTable ? 'row, index' : '',
            content: `
                var _this = this
                var url = this.$${vnode.apiServer}Url + '${vnode.apiUrl.indexOf('/') === 0 ? vnode.apiUrl : ('/' + vnode.apiUrl)}'
                ${pathStr ? `
                var pathParams = {
                    ${pathStr}
                }
                url = this.$utils.replacePathParams(url, pathParams)
                ` : ''}
                ${paramsStr ? `
                var params = {
                    ${paramsStr}
                }
                url = this.$utils.setQueryString(params, url)
                ` : ''}
                ${bodyStr ? `
                var body = {
                    ${bodyStr}
                }
                ` : ''}

                ${vnode.useConfirm ? `
                this.$confirmTips('${vnode.confirmMsg}', function () {
                    ${requestStr}
                }, null, ['取 消', '确 定'])
                ` : requestStr}
            `
        }
    }
})

export default base
