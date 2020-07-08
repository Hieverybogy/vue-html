
import Base from '../base'
const base = Object.create(Base)

Object.assign(base, {
    type: 'struTree',
    label: '树形菜单',
    // 分类
    category: 'base',
    // 可使用的布局
    user: ['tree-list'],
    getValidator (vnode) {
        return function (rule, value, callback) {
            let errorMsg = ''

            if (!vnode.fieldId) {
                errorMsg += '未设置绑定参数字段；'
            }

            if (!vnode.api) {
                errorMsg += '未设置数据源；'
            }

            if (errorMsg) {
                callback(new Error(errorMsg))
            } else {
                callback()
            }
        }
    },
    parseApi (vnode, optionsProp, context) {
        context.data[optionsProp] = []
        const api = vnode.api
        let paramHtml = `
            let params = {}`

        api.params && api.params.forEach(param => {
            paramHtml += `
            params.${param.key} = '${param.value || param.key}'`
        })
        let methodName = `get${vnode.fieldId}Data`
        context.methods[methodName] = {
            name: methodName,
            content: `${paramHtml}
                this.$get('${api.path}', params, res => {
                    this.${optionsProp} = res
                })`
        }
        context.created += `
        this.${methodName}()
        `
    }
})

export default base
