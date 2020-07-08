import Base from './base.js'
const Type = Object.create(Base)
Type.list = {
    create (opts, parentVnode, context) {
        const defaultOpts = {
            guid: Vue.$utils.guid(),
            type: 'date',
            model: '',
            // 绑定字段
            fieldId: null,
            fieldId2: null,
            // 文本
            label: '时间',
            attrs: {
                value: '',
                type: 'date',
                type2: 'daterange',
                format: 'yyyy-MM-dd',
                placeholder: '选择日期',
                placeholder1: '开始时间',
                placeholder2: '结束时间',
                readonly: false,
                multiType: 1
            }
        }

        return Object.assign(defaultOpts, opts || {})
    },
    parseVnode (vnode, parentVnode, context) {
        // 保存起来处理格式化问题
        context.data.dateFields.push({
            fieldId: vnode.fieldId,
            format: vnode.attrs.format,
            parentFieldId: vnode.model,
            parentFieldType: 'object'
        })

        if (vnode.attrs.multiType === 2) {
            context.data.dateTimeRange = []

            let dateRangeChange = `
                if(!val || val.length === 0) { 
                    this.${vnode.model ? vnode.model + '.' : ''}${vnode.fieldId} = '';
                    this.${vnode.model ? vnode.model + '.' : ''}${vnode.fieldId2} = '';
                } else {
                    this.${vnode.model ? vnode.model + '.' : ''}${vnode.fieldId} = val[0];
                    this.${vnode.model ? vnode.model + '.' : ''}${vnode.fieldId2} = val[1];
                }
            `
            context.methods.dateRangeChange = {name: 'dateRangeChange', content: dateRangeChange, args: 'val'}

             // 保存起来处理格式化问题
            context.data.dateFields.push({
                fieldId: vnode.fieldId2,
                format: vnode.attrs.format,
                parentFieldId: vnode.model,
                parentFieldType: 'object'
            })
        }

        return `
            <el-date-picker
                ${vnode.attrs.multiType === 2 ? ` @change="dateRangeChange"` : ''}
                type="${vnode.attrs.multiType === 1 ? vnode.attrs.type : vnode.attrs.type2}" 
                ${vnode.attrs.multiType === 1 ? `format="${vnode.attrs.format}"` : ''}
                ${vnode.attrs.multiType === 1 ? `placeholder="${vnode.attrs.placeholder}"` : ''}
                ${vnode.attrs.multiType === 2 ? `range-separator="至"` : ''}
                ${vnode.attrs.multiType === 2 ? `start-placeholder="${vnode.attrs.placeholder1}"` : ''}
                ${vnode.attrs.multiType === 2 ? `end-placeholder="${vnode.attrs.placeholder2}"` : ''}
                v-model="${vnode.attrs.multiType === 2 ? 'dateTimeRange' : `${vnode.model ? vnode.model + '.' : ''}${vnode.fieldId}`}"></el-date-picker>
            `
    }
}
export default Type
