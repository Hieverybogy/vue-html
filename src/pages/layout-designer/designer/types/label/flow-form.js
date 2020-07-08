import Base from './base.js'
const Type = Object.create(Base)

Type['flow-form'] = {
    create(opts, parentVnode, context) {
        if (parentVnode && parentVnode.type === 'detail') {
            return Type.detail.create(opts, parentVnode, context)
        }

        const defaultOpts = {
            guid: 'label_' + Vue.$utils.guid(8),
            type: 'label',
            layoutType: 'flow-form',
            model: '',
            // 绑定字段
            fieldId: null,
            subFieldId: null,
            isNoNeedFieldId: true,
            // 文本
            label: '文本',
            attrs: {
                controlType: '',  // 控件类型。 默认空，空:常规/1:整数/2:小数
                format: 'normal', // 格式。 normal：常规、thousand：会计格式
                place: '',        // 小数位数
                unit: '',         // 单位
                useMatch: 'none',     // 数据匹配。 none：不启用；method: 匹配方法；dataSource：匹配数据源
                matchOptions: [],

                value: '',
                defaultVal: '', // 默认值
                type: 1,
                align: 'left',
                key: '',
                txt: '', // key 对应的label
            },
            // 是否在自定义表格中
            isInTable: false,
            // 显示条件
            conditions: {},
            // 事件
            listeners: {
                // eventName: { name: '', args: [],  execution: false }
            },
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
    parseVnode(vnode, parentVnode, context) {
        let guid = vnode.guid.split('_')[1]
        
        let output = ''
        if (!vnode.isNoNeedFieldId && (vnode.attrs.controlType === 1 || vnode.attrs.controlType === 2)) {
            let _type = vnode.attrs.format === 'thousand' ? 'thousand' : vnode.attrs.controlType === 1 ? 'int' : 'float'
            output =  `
                <sapi-number 
                    :readonly="true"
                    type="${_type}" 
                    ${vnode.attrs.controlType === 2 ? `:place="${vnode.attrs.place}"` : ''}
                    v-model="${vnode.model ? vnode.model + '.' : ''}${vnode.fieldId}${vnode.subFieldId ? ('.' + vnode.subFieldId) : ''}">
                    ${vnode.attrs.unit ? `<template slot="suffix"><div>${vnode.attrs.unit}</div></template>` : ''}
                </sapi-number>
            `
        } else {
            let valStr = `${vnode.isNoNeedFieldId ? `value="${vnode.attrs.value}"` : `:value="${vnode.model ? vnode.model + '.' : ''}${vnode.fieldId}${vnode.subFieldId ? '.' + vnode.subFieldId : ''}"`}`
            if (!vnode.isNoNeedFieldId && !vnode.attrs.controlType && vnode.attrs.useMatch === 'dataSource') {
                context.data[`LBmatchOptions_${guid}`] = vnode.attrs.matchOptions

                let matchMethod = `
                    let item = this.${`LBmatchOptions_${guid}`}.find(_o => {
                        return _o.value === val.toString()
                    })
                    return item ? item.label : val
                `
                context.methods[`handleLBmatch_${guid}`] = {
                    name: `handleLBmatch_${guid}`,
                    args: ['val'],
                    content: matchMethod
                }

                valStr = `:value="handleLBmatch_${guid}(${vnode.model ? vnode.model + '.' : ''}${vnode.fieldId}${vnode.subFieldId ? '.' + vnode.subFieldId : ''})"`
            }
            output =  `
                <el-input
                    :readonly="true"
                    ${valStr}
                ></el-input>
            `
        }

        return output
    },
}

export default Type