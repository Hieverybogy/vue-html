import Base from './base.js'
import Config from '../../config.js'
const Type = Object.create(Base)

Type['flow-form'] = {
    create (opts, parentVnode, context) {

        const defaultOpts = {
            guid: 'fileList_' + Vue.$utils.guid(8),
            type: 'fileList',
            layoutType: 'flow-form',
            model: '',
            // noUseFormItem: true,
            // 绑定字段
            fieldId: null,
            subFieldId: null,
            // 文本
            label: '附件',
            attrs: {
                frame: 'border',
                rules: 'all',
                dataForm: [
                    {title: '文件名称', _key:'title', align: 'left', width: '300', key: '', txt: '', useMatch: 'none', matchOptions: [], isStatic: true, isLink: true, linkType: 'normal', linkPath: '',linkMethod: ''}, 
                    {title: '上传者', align: 'left', width: '', key: '', txt: '', useMatch: 'none', matchOptions: [], isStatic: true},
                    {title: '上传时间', _key:'time', align: 'left', width: '', key: '', txt: '', useMatch: 'none', matchOptions: [], isStatic: true},
                    {title: '文件大小', _key:'size', align: 'left', width: '', key: '', txt: '', useMatch: 'none', matchOptions: [], isStatic: true}
                ],
            },
            // 是否在自定义表格中
            isInTable: false,
            // 显示条件
            conditions: {},
            // 是否必填
            required: false,
            // 必填验证失败提示信息
            requiredErrorMsg: '',
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
        context.data[`FLDataForm_${guid}`] = vnode.attrs.dataForm
        
        return [`<file-list-output
            frame="${vnode.attrs.frame}"
            rules="${vnode.attrs.rules}"
            :dataList="${vnode.model ? vnode.model + '.' : ''}${vnode.fieldId}${vnode.subFieldId ? '.' + vnode.subFieldId : ''}"
            :dataForm="FLDataForm_${guid}"/>`]
    }
}

export default Type
