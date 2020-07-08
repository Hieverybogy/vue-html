import Base from './base.js'
const Type = Object.create(Base)

Type['online-list'] = {
    create (opts, parentVnode, context, ueditor) {
        const guid = 'listTableColumn_' + Vue.$utils.guid(8)
        const defaultOpts = {
            guid: guid,
            type: 'listTableColumn',
            fieldId: '',
            fieldName: '',
            dataType: 'text',
            label: '',
            width: '',
            useTips: true,
            sortable: false,
            fixed: '',
            headerAlign: 'left',
            align: 'left',
            format: '',
            place: 2,
            isLink: false,
            clickEvent: `${guid}_click`,
            clickEventArgs: 'props.row, props.$index',
            'v-if-expression': '',
            linkParams: [
                { paramId: 'formId', paramType: 'path', paramValueSource: 'dataProp', paramValue: 'relativeFormId' },
                { paramId: 'appCode', paramType: 'query', paramValueSource: 'dataProp', paramValue: 'appCode' }
            ],
            linkUrl: '/online.html#/form/{formId}?embed=true&nav=true&mode=View',
            useMatch: 'none',
            matchOptions: null,
            primaryKey: false
        }

        // 注入编辑页面主键参数
        ueditor && ueditor.onDataModelReady(function () {
            ueditor.primaryKeys.forEach((key) => {
                defaultOpts.linkParams.push({
                    paramId: key, paramType: 'query', paramValueSource: 'rowProp', paramValue: key
                })
            })
        })

        return Object.assign(defaultOpts, opts || {})
    },
    parseVnode (vnode, parentVnode, context) {
        return `
        <el-table-column 
            label="${vnode.label}" 
            ${vnode.width ? `width="${vnode.width}px"` : ''}
            ${vnode.sortable ? `sortable="custom"` : ''}
            prop="${vnode.fieldId}"
            align="${vnode.align || 'left'}"
            header-align="${vnode.headerAlign || 'left'}"
            ${vnode.fixed ? `fixed="${vnode.fixed}"` : ''}
            ${vnode.useTips ? 'show-overflow-tooltip' : ''}>
            <template slot-scope='props'>${this.parseColumnVnode(vnode, parentVnode, context)}</template>
        </el-table-column>`
    },
    parseColumnVnode (column, parentVnode, context) {
        let txt = ''
        if ((column.dataType === 'text' || column.dataType === 'int') &&
            column.useMatch !== 'none') {
            txt = this.parseMatchOptions(column, parentVnode, context)
        } else {
            txt = this.parseDataType(column, parentVnode, context)
        }

        if (column.isLink) {
            if (column.clickEvent === `${column.guid}_click`) {
                const { paramsStr, pathStr } = Type.parseParamValueSource(column.linkParams)
                context.methods[`${column.guid}_click`] = {
                    name: `${column.guid}_click`,
                    args: 'row, index',
                    content: `
                        var url = '${column.linkUrl}'
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
        
                        this.$utils.innerOpen(url)
                    `
                }
            }

            return `<a href="javascript:void(0)" @click="${column.clickEvent}(${column.clickEventArgs})">${txt}</a>`
        } else {
            return txt
        }
    },
    parseDataType (column, parentVnode, context) {
        switch (column.dataType) {
            case 'text':
            case 'textarea':
                return `{{props.row.${column.fieldId}}}`
            case 'date':
                return `{{$dateFormat('${column.format}', props.row.${column.fieldId})}}`
            case 'int':
            case 'float':
                if (column.format === 'thousand') {
                    return `{{$utils.toThousands(props.row.${column.fieldId}, ${column.place})}}`
                } else if (column.dataType === 'float') {
                    return `{{$utils.parseDecimal(props.row.${column.fieldId}, ${column.place})}}`
                } else {
                    return `{{$utils.parseInt(props.row.${column.fieldId})}}`
                }
        }

        return ''
    },
    parseMatchOptions (column, parentVnode, context) {
        let obj = {}
        column.matchOptions.forEach(item => {
            obj[item.value] = item.label
        })
        let key = `${column.guid}_options`
        context.data[key] = obj
        return `{{${key}[props.row.${column.fieldId}]}}`
    }
}

export default Type
