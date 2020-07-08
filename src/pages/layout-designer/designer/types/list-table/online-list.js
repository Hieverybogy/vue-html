import Base from './base.js'
const Type = Object.create(Base)

Type['online-list'] = {
    create (opts, parentVnode, context, ueditor, layout) {
        const defaultOpts = {
            guid: 'listTable_' + Vue.$utils.guid(),
            type: 'listTable',
            model: '',
            // 绑定字段
            fieldId: 'dataTable',
            attrs: {},
            customListApi: false,
            apiConfig: {
                server: 'formServer',
                api: '/{appcode}/{formId}/values/page',
                params: [
                    { paramId: 'appcode', paramType: 'path', paramValueSource: 'urlParam', paramValue: 'appCode' },
                    { paramId: 'formId', paramType: 'path', paramValueSource: 'dataProp', paramValue: 'formId' },
                    { paramId: 'searchValue', paramType: 'query', paramValueSource: 'filterField', paramValue: 'searchValue' },
                    { paramId: 'pageNum', paramType: 'query', paramValueSource: 'filterField', paramValue: 'pageNum' },
                    { paramId: 'pageSize', paramType: 'query', paramValueSource: 'filterField', paramValue: 'pageSize' },
                    { paramId: 'sortName', paramType: 'query', paramValueSource: 'filterField', paramValue: 'sortName' },
                    { paramId: 'sortType', paramType: 'query', paramValueSource: 'filterField', paramValue: 'sortType' },
                    { paramId: 'searchKey', paramType: 'query', paramValueSource: 'dataProp', paramValue: 'searchKey' }
                ],
                resListToProps: 'list'
            },
            // 自定义api配置
            customApiConfig: {
                server: '',
                api: '',
                params: [
                ],
                resListToProps: 'list',
                resListFields: []
            },
            columns: [
                // {
                //     fieldId: '列id',
                //     label: '列名称',
                //     type: 'listTableColumn',
                //     dataType: 'text/int/float/date/textarea',
                //     width: '',
                //     useTips: false/true,
                //     sortable: false/true,
                //     fixed: ''/'left'/'right'
                //     // 格式化：日期、数字、文本
                //     format: '',
                //     place: '2' // 小数位
                //     isLink: false,
                //     linkType: 'detail/custom',
                //     pageUrl: '',
                //     routerPath: '',
                //     useMatch: 'none/method/dataSource' // 使用匹配
                //     matchMethod: '',
                //     matchOptions: []
                // }
            ],
            useOperationColumn: true,
            operationColumnConfig: {
                label: '操作',
                width: '100',
                'v-if-expression': '',
                btns: [
                    layout.Types['btn'].create({
                        text: '修改',
                        clickEventArgs: 'props.row, props.$index',
                        'v-if-expression': layout.isFlowEnabled ? 'props.row.status === 1 && permissions.UPDATE' : 'permissions.UPDATE',
                        usage: 'openPage',
                        openUrl: '/online.html#/form/{formId}?embed=true&nav=true&mode=Edit',
                        openWay: '_blank', // '_seft'
                        openUrlParams: [
                            { guid: Vue.$utils.guid(8), paramId: 'formId', paramType: 'path', paramValueSource: 'dataProp', paramValue: 'relativeFormId' },
                            { guid: Vue.$utils.guid(8), paramId: 'appCode', paramType: 'query', paramValueSource: 'dataProp', paramValue: 'appCode' }
                        ],
                        execution: true
                    }),
                    layout.Types['btn'].create({
                        text: '删除',
                        clickEvent: 'deleteRowData',
                        clickEventArgs: 'props.row, props.$index',
                        'v-if-expression': layout.isFlowEnabled ? 'props.row.status === 1 && permissions.UPDATE' : 'permissions.UPDATE',
                        usage: 'ajax',
                        execution: true,
                        apiServer: 'formServer',
                        apiType: 'delete',
                        apiUrl: '/{appcode}/{formId}/values',
                        apiParams: [
                            { guid: Vue.$utils.guid(8), paramId: 'formId', paramType: 'path', paramValueSource: 'dataProp', paramValue: 'relativeFormId' },
                            { guid: Vue.$utils.guid(8), paramId: 'appcode', paramType: 'path', paramValueSource: 'dataProp', paramValue: 'appCode' }
                        ],
                        useConfirm: true,
                        confirmMsg: '确认要删除这条信息吗？',
                        apiSuccessMsg: '删除成功',
                        apiSuccess: 'loadData'
                    })
                ]
            },
            pagination: true,
            resizeable: true,
            checkAll: true,
            // 可关键查询的列
            searchKey: [],
            defaultSortName: '',
            defaultSortType: 'descending'
        }

        // 注入编辑页面主键参数
        if (ueditor) {
            if (layout && layout.isFlowEnabled) {
                defaultOpts.operationColumnConfig.btns.push(
                    layout.Types['btn'].create({
                        text: '调整',
                        clickEventArgs: 'props.row, props.$index',
                        'v-if-expression': 'props.row.status === 3 && permissions.UPDATE',
                        usage: 'openPage',
                        openUrl: '/online.html#/form/{formId}?embed=true&nav=true&mode=Adjust',
                        openWay: '_blank', // '_seft'
                        openUrlParams: [
                            { guid: Vue.$utils.guid(8), paramId: 'formId', paramType: 'path', paramValueSource: 'dataProp', paramValue: 'relativeFormId' },
                            { guid: Vue.$utils.guid(8), paramId: 'appCode', paramType: 'query', paramValueSource: 'dataProp', paramValue: 'appCode' }
                        ],
                        execution: true
                    }))
            }

            ueditor.onDataModelReady(function () {
                ueditor.primaryKeys.forEach((key) => {
                    // 修改按钮添加主键参数
                    defaultOpts.operationColumnConfig.btns[0].openUrlParams.push({
                        guid: Vue.$utils.guid(8), paramId: key, paramType: 'query', paramValueSource: 'rowProp', paramValue: key
                    })

                    // 删除按钮添加主键参数
                    const bodyGuid = Vue.$utils.guid(8)
                    defaultOpts.operationColumnConfig.btns[1].apiParams.push({
                        guid: bodyGuid, paramId: 'bizIds', paramType: 'body', paramValueSource: 'customObj', paramValue: key
                    })
                    defaultOpts.operationColumnConfig.btns[1].apiParams.push({
                        guid: Vue.$utils.guid(8), paramId: key, paramType: 'bodyProp', paramValueSource: 'rowProp', paramValue: key, parentGuid: bodyGuid
                    })

                    if (defaultOpts.operationColumnConfig.btns[2]) {
                        defaultOpts.operationColumnConfig.btns[2].openUrlParams.push({
                            guid: Vue.$utils.guid(8), paramId: key, paramType: 'query', paramValueSource: 'rowProp', paramValue: key
                        })
                    }
                })
            })
        }

        return Object.assign(defaultOpts, opts || {})
    },
    parseVnode (vnode, parentVnode, context) {
        const columnsHtml = []
        this.parseColumnHtml(vnode, context, columnsHtml)
        this.parseListApi(vnode, parentVnode, context)

        let sortChangeMethod = ''
        if (vnode.sortable) {
            context.data.params = context.data.params || {}
            context.data.params.sortName = vnode.defaultSortName || ''
            context.data.params.sortType = vnode.defaultSortName && vnode.defaultSortType || ''

            sortChangeMethod = '@sort-change="sortChange"'
            let methodStr = `this.params.sortName = obj.prop
                this.params.sortType = obj.order
                this.pageCurrentChange(1)`
            context.methods.sortChange = {name: 'sortChange', content: methodStr, args: 'obj'}
        }

        context.data.deleteDatas = []
        let methodStr = `this.deleteDatas = [].concat(datas)`
        context.methods.rowSelect = {name: 'rowSelect', content: methodStr, args: 'datas'}

        return `
        <el-table :data="tableData" ref="bodyTable" ${sortChangeMethod} 
            ${vnode.defaultSortName ? `:default-sort = "{prop: '${vnode.defaultSortName}', order: '${vnode.defaultSortType}'}"` : ''}
            @selection-change="rowSelect" :height="maxBodyHeight" v-fixed-eltable-header>${columnsHtml.join('')}
        </el-table>`
    },
    parseColumnHtml (vnode, context, columnsHtml) {
        columnsHtml.push(`<el-table-column type="selection" width="45"></el-table-column>`)

        vnode.sortable = false
        vnode.columns.forEach((column) => {
            if (column.sortable && !vnode.sortable) {
                vnode.sortable = true
            }

            columnsHtml.push(context.previewCurrentVnode ? '' : context.preview.Types[column.type].parseVnode(column, vnode, context))
        })

        this.parseOperationColumn(vnode, context, columnsHtml)
    },
    parseOperationColumn (vnode, context, columnsHtml) {
        if (vnode.useOperationColumn) {
            let columnBtns = ''

            vnode.operationColumnConfig.btns.forEach((btn) => {
                columnBtns += context.preview.Types['btn'].parseVnode(btn, vnode, context)
            })

            columnsHtml.push(`
                <el-table-column label="${vnode.operationColumnConfig.label}" 
                    fixed="right" 
                    width="${vnode.operationColumnConfig.width}"
                    ${vnode.operationColumnConfig['v-if-expression'] ? `v-if="${vnode.operationColumnConfig['v-if-expression']}"` : ''}>
                    <template slot-scope="props">
                        ${columnBtns}
                    </template>
                </el-table-column>
            `)
        }
    },
    parseListApi (vnode, parentVnode, context) {
        if (context.locked) {
            return
        }
        const apiConfig = vnode.customListApi ? vnode.customApiConfig : vnode.apiConfig
        const { paramsStr, pathStr } = Type.parseParamValueSource(apiConfig.params)

        context.data.tableData = []
        context.methods['loadData'] = {
            name: 'loadData',
            args: '',
            content: `
                var url = this.$${apiConfig.server}Url + '${apiConfig.api.indexOf('/') === 0 ? apiConfig.api : ('/' + apiConfig.api)}'
                var pathParams = {
                    ${pathStr}
                }
                var params = {
                    ${paramsStr}
                }

                url = this.$utils.replacePathParams(url, pathParams)

                this.$get(url, params, function (res) {
                    this.tableData = res.list
                    this.pageTotal = res.total
                })
            `
        }

        context.created += `
            this.searchKey = '${vnode.searchKey && vnode.searchKey.join(', ') || ''}'
        `
    },
    parseOperationBtn (btn, context) {
        if (btn.usage === 'openPage') {
            this.parseOpenPageBtn(btn, context)
        } else if (btn.usage === 'ajax') {
            this.parseAjaxBtn(btn, context)
        }
    },
    parseOpenPageBtn (vnode, context) {
        const { paramsStr, pathStr } = Type.parseParamValueSource(vnode.openUrlParams)
        const method = `${vnode.guid}_click`
        vnode.clickEvent = method
        vnode.execution = true
        vnode.clickEventArgs = 'props.row, props.$index'

        context.methods[method] = {
            name: method,
            args: 'row, index',
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
    parseAjaxBtn (vnode, context) {
        const { paramsStr, pathStr, bodyStr } = Type.parseParamValueSource(vnode.apiParams)
        const method = `${vnode.guid}_click`
        vnode.clickEvent = method
        vnode.execution = true
        vnode.clickEventArgs = 'props.row, props.$index'
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
            args: 'row, index',
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
}

export default Type
