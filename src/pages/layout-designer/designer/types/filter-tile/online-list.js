import Base from './base.js'
const Type = Object.create(Base)

Type['online-list'] = {
    create (opts, parentVnode, context) {
        const defaultOpts = {
            guid: 'filterTile_' + Vue.$utils.guid(8),
            type: 'filterTile',
            model: '',
            // 绑定字段：开始日期
            fieldId: null,
            // 文本
            label: '排列选择：',
            attrs: {
            },
            dataSourceType: 'custom',
            // 多选项
            options: [],
            api: null, // {url: '请求地址', params: '参数', labelField: '', valueField: '', dataProp: '${vnode.fieldId}_options'}
            optionsProp: null
        }

        return Object.assign(defaultOpts, opts || {})
    },
    parseVnode (vnode, parentVnode, context) {
        const options = `${vnode.guid}_options`
        context.data[options] = []
        if (!context.data[vnode.model]) {
            context.data[vnode.model] = {}
        }
        context.data[vnode.model][vnode.fieldId] = null
        const api = vnode.api
        this.parseApi(vnode, options, context)
        context.methods.moreFilterChange = {
            name: 'moreFilterChange',
            args: 'key, item, label, _key',
            content: `
            var _this = this;
            var _label = label + ' ' + item.label
            if (!item[_key]) {
                _label = ''
            }
            this.addFilterRecord({
                key: key,
                label: _label,
                remove() {
                    _this.params[key] = null;
                }
            });

            this.loadData();
            `
        }

        let props = `{label: '${api && api.label || 'label'}', value: '${api && api.value || 'value'}'${vnode.dataSourceType === 'api' && api && api.isTreeData ? `, children: '${api && api.children}'` : ''}}`

        return `<sapi-filter-item label="${vnode.label}">
            <sapi-tile-filter v-model="${vnode.model}${vnode.fieldId ? `.${vnode.fieldId}` : ''}"
                @change="moreFilterChange('${vnode.fieldId}', $event, '${vnode.label}', '${api && api.value || 'value'}')"
                :props="${props}"
                :data="${options}"></sapi-tile-filter>
        </sapi-filter-item>`
    },
    parseApi (vnode, optionsProp, context) {
        if (context.locked) {
            return
        }

        if (vnode.dataSourceType === 'custom') {
            context.data[optionsProp] = vnode.options || []
        } else if (vnode.dataSourceType === 'api') {
            context.data[optionsProp] = []
            if (Vue.$utils.isObject(vnode.api)) {
                const api = vnode.api
                const { paramsStr, pathStr } = Type.parseParamValueSource(api.params)
                const method = `get${vnode.guid}_options`
                const forChildren = `forEach${vnode.guid}_children`
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
                            res = res || []
                            res.unshift({
                                ${api.label}: '全部',
                                ${api.value}: ''
                            })
                            ${api.isTreeData ? `
                            _this.${forChildren}(res)
                            ` : ''}
                            _this.${optionsProp} = res
                        })
                    `
                }

                if (api.isTreeData) {
                    context.methods[forChildren] = {
                        name: forChildren,
                        args: 'data',
                        content: `
                            var _this = this
                            data.forEach(function (item, i) {
                                if (item.children && item.children.length > 0) {
                                    item.children.unshift({
                                        ${api.label}: '全部',
                                        ${api.value}: ''
                                    })
                                    _this.${forChildren}(item.children)
                                }
                            })
                        `
                    }
                }

                context.created += `
                    this.${method}()
                `
            }
        }
    }
}

export default Type
