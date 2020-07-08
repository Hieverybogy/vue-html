import Base from './base.js'
import Config from '../../config.js'
const Type = Object.create(Base)

Type['flow-form'] = {
    create (opts, parentVnode, context) {

        const defaultOpts = {
            guid: 'tableForm_' + Vue.$utils.guid(8),
            type: 'tableForm',
            layoutType: 'flow-form',
            model: '',
            isNoNeedFieldId: true,
            // 绑定字段
            fieldId: null,
            subFieldId: null,
            // 文本
            label: '自定义表格',
            attrs: {
                row: 1,
                column: 2,
                colgroup: [{width: ''}, {width: ''}],
                isShowThead: false,
                headLabel: [
                    {title: '', align: 'left'}, 
                    {title: '', align: 'left'}
                ],
                dataForm: [{
                    tr: [{
                        slots: [],
                        colspan: 1,
                        rowspan: 1,
                        rows: 0,
                        cols: 0
                    },
                    {
                        slots: [],
                        colspan: 1,
                        rowspan: 1,
                        rows: 0,
                        cols: 1
                    }]
                }]
            },
            // 显示条件
            conditions: {},
            // 是否必填
            required: false,
            // 必填验证失败提示信息
            requiredErrorMsg: '请选择地区',
            // 是否占据整行
            fullline: false,
            // 是否单独占据一行，留一半空白
            alone: false,
            // 自定义校验规则
            validator: null
        }

        return Object.assign(defaultOpts, opts || {})
    },
    parseVnode (vnode, parentVnode, context) {
        let guid = vnode.guid.split('_')[1]

        context.data[`TFDataForm_${guid}`] = vnode.attrs.dataForm
        context.data[`TFHeadLabel_${guid}`] = vnode.attrs.headLabel
        context.data[`TFColgroup_${guid}`] = vnode.attrs.colgroup

        return [`<table-form-output  
            :modelData="model"
            :colgroup="TFColgroup_${guid}" 
            :isShowThead="${vnode.attrs.isShowThead}"
            :headLabel="TFHeadLabel_${guid}"
            :dataForm="TFDataForm_${guid}"/>`]
    }
}
export default Type
