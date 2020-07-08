import Base from './base.js'
import { getExtendMixins } from '../../config.js'
const Type = Object.create(Base)

Type.list = {
    create (opts) {
        const defaultOpts = {
            guid: Vue.$utils.guid(),
            type: 'listTable',
            model: '',
            // 绑定字段
            fieldId: 'dataTable',
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
            pagination: true,
            resizeable: true,
            checkAll: true
        }

        return Object.assign(defaultOpts, opts || {})
    },
    parseVnode (vnode, parentVnode, context) {
        const columnsHtml = []
        this.parseColumnHtml(vnode, context, columnsHtml)

        let sortChangeMethod = ''
        if (vnode.sortable) {
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
            @selection-change="rowSelect" :height="maxBodyHeight">${columnsHtml.join('')}
        </el-table>`
    },
    parseColumnHtml (vnode, context, columnsHtml) {
        columnsHtml.push(`<el-table-column type="selection" width="45"></el-table-column>`)

        vnode.sortable = false
        vnode.columns.forEach((column) => {
            if (column.sortable && !vnode.sortable) {
                vnode.sortable = true
            }

            columnsHtml.push(`
            <el-table-column 
                label="${column.label}" 
                ${column.width ? `width="${column.width}px"` : ''}
                ${column.sortable ? `sortable="custom"` : ''}
                prop="${column.fieldId}"
                ${column.fixed ? `fixed="${column.fixed}"` : ''}
                :show-overflow-tooltip="${column.useTips}">
                <template slot-scope='props'>${this.parseColumnVnode(column, vnode, context)}</template>
            </el-table-column>`)
        })
    },
    parseColumnVnode (column, parentVnode, context) {
        let txt = ''
        if ((column.dataType === 'text' || column.dataType === 'int') &&
            column.useMatch !== 'none') {
            if (column.useMatch === 'method') {
                txt = this.parseMatchMethod(column, parentVnode, context)
            } else {
                txt = this.parseMatchOptions(column, parentVnode, context)
            }
        } else {
            txt = this.parseDataType(column, parentVnode, context)
        }

        if (column.isLink) {
            if (column.linkType === 'detail') {
                if (!context.methods.openViewDialog) {
                    context.methods['openViewDialog'] = {
                        name: 'openViewDialog',
                        args: 'row',
                        content: `this.view = "cmpView"
                        this.visible = true
                        this.option = row`
                    }
                }
                if (!context.components.cmpView) {
                    context.components['cmpView'] = {
                        name: 'cmpView',
                        immediately: false,
                        path: './view.vue'
                    }
                }
                return `<a href="javascript:void(0)" @click="openViewDialog(props.row)">${txt}</a>`
            } else {
                if (!context.methods.openOtherViewDialog) {
                    context.methods['openOtherViewDialog'] = {
                        name: 'openOtherViewDialog',
                        args: 'row, fieldId',
                        content: `this.view = fieldId + "View"
                        this.visible = true
                        this.option = row`
                    }
                }

                let name = column.fieldId + 'View'
                if (!context.components[name]) {
                    context.components[name] = {
                        name: name,
                        immediately: false,
                        path: column.path
                    }
                }

                return `<a href="javascript:void(0)" @click="openOtherViewDialog(props.row, '${column.fieldId}')">${txt}</a>`
            }
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
    parseMatchMethod (column, parentVnode, context) {
        const mixinConfig = getExtendMixins()
        let mixin = mixinConfig[column.matchMethod]
        if (mixin) {
            context.mixins[column.matchMethod] = mixin

            return `{{${mixin.method}(props.row.${column.fieldId}, props.row)}}`
        }

        return `${column.matchMethod}匹配方法未找到`
    },
    parseMatchOptions (column, parentVnode, context) {
        let obj = {}
        column.matchOptions.forEach(item => {
            obj[item.value] = item.label
        })
        let id = column.fieldId.replace(/^\w/, word => word.toLowerCase())
        let key = id + '_resource'
        context.data[key] = obj
        return `{{${key}[props.row.${column.fieldId}]}}`
    }
}

export default Type
