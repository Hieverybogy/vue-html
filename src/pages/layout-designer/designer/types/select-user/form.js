import Base from './base.js'
import Config from '../../config.js'
const Type = Object.create(Base)

Type.form = {
    create (opts, parentVnode, context) {
        if (parentVnode && parentVnode.type === 'detail') {
            return Type.detail.create(opts, parentVnode, context)
        }

        const defaultOpts = {
            guid: Vue.$utils.guid(),
            type: 'selectUser',
            model: '',
            // 绑定字段
            fieldId: null,
            subFieldId: null,
            // 文本
            label: '选择用户',
            attrs: {
                title: '选择用户',
                multiple: true,
                data: [],
                height: 34,
                cookieName: 'cookie_select_users',
                hasImg: false,
                readonly: false,
                placeholder: '选择用户',
                hasMore: true,
                type: false,
                format: ['AliasName'],  //'CorpName', 'DeptName', 'StationName', 'AliasName'
                isCustomFormat: false,   //是否自定义展示规则
                formatTxt: '${CorpName}/${DeptName}/${StationName} (${AliasName})'
            },
            // 是否必填
            required: false,
            // 必填验证失败提示信息
            requiredErrorMsg: '请选择用户',
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
        if (!context.components['sapi-user']) {
            // 加入组件依赖
            context.components['sapi-user'] = Config.components['sapi-user']
        }
        if (!context.components['sapi-select-btn']) {
            // 加入组件依赖
            context.components['sapi-select-btn'] = Config.components['sapi-select-btn']
        }

        if (context.mode === 'Add' || context.mode === 'Edit') {
            return this.parseVnodeForEdit(vnode, parentVnode, context)
        } else {
            return this.parseVnodeForView(vnode, parentVnode, context)
        }
    },
    parseVnodeForEdit (vnode, parentVnode, context) {
        // 不存在父节点：表示节点不在明细表中
        if (!parentVnode || parentVnode.type === 'collapseItem') {
            let rules
            if (vnode.required) {
                rules = [{
                    required: true, message: vnode.requiredErrorMsg, trigger: 'change'
                }]
            }

            if (vnode.validator) {
                context.methods[vnode.fieldId + '_validator'] = {
                    name: vnode.fieldId + '_validator',
                    args: 'rule,value,callback',
                    content: vnode.validator
                }

                if (rules) {
                    rules.push({
                        validator: `this.${vnode.fieldId}_validator`
                    })
                } else {
                    rules = [{
                        validator: `this.${vnode.fieldId}_validator`
                    }]
                }
            }

            if (rules) {
                context.data.rules[vnode.fieldId + (vnode.subFieldId ? '.' + vnode.subFieldId : '')] = rules
            }
        }

        // 添加项目的的方法
        this.addMethod(vnode, parentVnode, context)

        return `<div>
            <sapi-select-btn 
                v-model="userItems"
                :format="format" 
                @select="userSelectBtnClick" 
                ${vnode.attrs.placeholder ? `placeholder="${vnode.attrs.placeholder}"` : ''}
                ${vnode.attrs.height ? `height="${vnode.attrs.height}px"` : ''}
                ${vnode.attrs.hasMore ? `:hasMore="${vnode.attrs.hasMore}"` : `:hasMore="false"`}
                ${vnode.attrs.readonly ? `:readonly="${vnode.attrs.readonly}"` : ''}
            ></sapi-select-btn>
            <sapi-user
                v-model="userSelectvisible"
                ${vnode.attrs.title ? `title="${vnode.attrs.title}"` : ''}
                ${vnode.attrs.multiple ? `:multiple="${vnode.attrs.multiple}"` : `:multiple="false"`}
                :data.sync="${vnode.model ? vnode.model + '.' : ''}${vnode.fieldId}${vnode.subFieldId ? '.' + vnode.subFieldId : ''}"
                ${vnode.attrs.cookieName ? `cookieName="${vnode.attrs.cookieName}"` : ''}
                ${vnode.attrs.hasImg ? `:hasImg="${vnode.attrs.hasImg}"` : `:hasImg="false"`}
                ${vnode.attrs.type ? 'type="select-station"' : ''}
                @callback="userSelectCallback"
            ></sapi-user>
        </div>`
    },
    parseVnodeForView (vnode, parentVnode, context) {
        // 添加项目的的方法
        this.addMethod(vnode, parentVnode, context)

        return `<div>
            <sapi-select-btn 
                v-model="userItems"
                :format="format" 
                @select="userSelectBtnClick" 
                ${vnode.attrs.placeholder ? `placeholder="${vnode.attrs.placeholder}"` : ''}
                ${vnode.attrs.height ? `height="${vnode.attrs.height}px"` : ''}
                ${vnode.attrs.hasMore ? `hasMore="${vnode.attrs.hasMore}"` : `hasMore="false"`}
                readonly
            ></sapi-select-btn>
            <sapi-user
                v-model="userSelectvisible"
                ${vnode.attrs.title ? `title="${vnode.attrs.title}"` : ''}
                ${vnode.attrs.multiple ? `multiple="${vnode.attrs.multiple}"` : false}
                :data.sync="userDatas"
                ${vnode.attrs.cookieName ? `cookieName="${vnode.attrs.cookieName}"` : ''}
                ${vnode.attrs.hasImg ? `hasImg="${vnode.attrs.hasImg}"` : `hasImg="false"`}
                ${vnode.attrs.type ? 'type="select-station"' : ''}
                @callback="userSelectCallback"
            ></sapi-user>
        </div>`
    },
    addMethod (vnode, parentVnode, context) {
        //*********** methods ***********/
        // userSelectCallback
        let strCallback = ''
        if (!vnode.attrs.multiple) {
            strCallback = `this.userItems = [data]`
        } else {
            strCallback = `this.userItems = data`
        }
        context.methods.userSelectCallback = {name: 'userSelectCallback', content: strCallback, args: 'data'}

        // format
        if (vnode.attrs.isCustomFormat) {
            let str = vnode.attrs.formatTxt
            let arr = []
            if (str) {
                let arr1 = str.split('${')
                for (let i = 0; i < arr1.length; i++) {
                    let arrStr1 = arr1[i].replace(/(^\s*)|(\s*$)/g, "")
                    let arr2 = arrStr1 ? arrStr1.split('}') : ''
                    if (arr2[0] && arr2[0].replace(/(^\s*)|(\s*$)/g, "")) {
                        arr.push('${item.' + arr2.join('}'))
                    }
                }
                
                str = '`' + arr.join('') + '`'
                context.methods.format = {name: 'format', content: `return ${eval(str)};`, args: 'item'}
            } else {
                context.methods.format = {name: 'format', content: `return ''`, args: 'item'}
            }
        } else {
            let strFormat = ''
            strFormat = `(${vnode.attrs.format.indexOf('CorpName')>-1 ? 'item.CorpName +' : ''}
                ${vnode.attrs.format.indexOf('DeptName')>-1 ? '/ + item.DeptName +' : ''}
                ${vnode.attrs.format.indexOf('StationName')>-1 ? '/ + item.StationName +' : ''}
                item.AliasName ? "（"+item.AliasName+")" : "（未关联员工）"
            )`
            strFormat = strFormat && strFormat.replace(/(^\s*)|(\s*$)/g, "")[0] === '/' ? strFormat.replace(/(^\s*)|(\s*$)/g, "").substring(1) : strFormat
            context.methods.format = {name: 'format', content: `return ${strFormat};`, args: 'item'}
        }
       
        // btnClick
        context.methods.userSelectBtnClick = {name: 'userSelectBtnClick', content: 'this.userSelectvisible = true'}
        
        // 处理model数据
        let strInit = `
            let data = this.${vnode.model ? vnode.model + '.' : ''}${vnode.fieldId}${vnode.subFieldId ? '.' + vnode.subFieldId : ''};
            if (data instanceof Array) {
                this.userDatas = data
                if (this.multiple) {
                    this.userItems = data
                } else {
                    this.userItems = data[0]
                }
            } else if ($.isPlainObject(data) && !this.multiple) {
                this.userDatas = data
                if (this.multiple) {
                    this.userItems = [data]
                } else {
                    this.userItems = data
                }
            }
        `
        context.methods.init = {name: 'init', content: strInit}

        /*********** data ***********/
        context.data.userSelectvisible = false
        context.data.userItems = []
        context.data.userDatas = []
        context.data.multiple = vnode.attrs.multiple

        /*********** created ***********/
        context.created += `this.init();`
    }
}

Type.detail = {
    create (opts, parentVnode, context) {
        const defaultOpts = {
            guid: Vue.$utils.guid(),
            type: 'selectUser',
            model: '',
            // 绑定字段
            fieldId: null,
            // 文本
            label: '选择用户',
            attrs: {
                title: '选择用户',
                multiple: true,
                data: [],
                height: 34,
                cookieName: 'cookie_select_users',
                hasImg: false,
                readonly: false,
                placeholder: '选择用户',
                hasMore: true,
                type: false,
                format: ['AliasName'],  //'CorpName', 'DeptName', 'StationName', 'AliasName'
                isCustomFormat: false,   //是否自定义展示规则
                formatTxt: '${CorpName}/${DeptName}/${StationName} (${AliasName})'
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
    }
}

export default Type
