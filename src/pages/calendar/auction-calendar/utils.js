const Type = {}
// 默认工作日
const workDays = [1, 2, 3, 4, 5]
function isType (type) {
    if (!Type[type]) {
        Type[type] = function (obj) {
            return Object.prototype.toString.call(obj) === '[object ' + type + ']'
        }
    }

    return Type[type]
}

const utils = {
    /**
     * 返回判定基本数据类型的函数
     * @method isType
     * @param type {string} 可选值：Object/String/Boolean/Function/Date/Number/Array
     * @return {function}
     */
    isType: function (type) {
        return isType(type)
    },
    /**
     * 判定是否数组
     * @method isArray
     * @param obj {any}
     * @return {boolean}
     */
    isArray: function (obj) {
        return isType('Array')(obj)
    },
    /**
     * 判断是否字符串
     * @method isString
     * @param obj {any}
     * @return {boolean}
     */
    isString: function (obj) {
        return isType('String')(obj)
    },
    /**
     * 判断是否boolean类型
     * @method isBoolean
     * @param obj {any}
     * @return {boolean}
     */
    isBoolean: function (obj) {
        return isType('Boolean')(obj)
    },
    /**
     * 判定是否函数
     * @method isFunction
     * @param obj {any}
     * @return {boolean}
     */
    isFunction: function (obj) {
        return isType('Function')(obj)
    },
    /**
     * 判定是日期类型
     * @method isDate
     * @param obj {any}
     * @return {boolean}
     */
    isDate: function (obj) {
        return isType('Date')(obj)
    },
    /**
     * 判定是否数字类型
     * @method isNumber
     * @param obj {any}
     * @return {boolean}
     */
    isNumber: function (obj) {
        return isType('Number')(obj)
    },
    /**
     * 判定是否整数
     * @method isInt
     * @param obj {any}
     * @return {boolean}
     */
    isInt: function (obj) {
        return utils.isNumeric(obj) && (String(obj).indexOf('.') === -1)
    },
    /**
     * 判定是否Null值
     * @method isNull
     * @param obj {any}
     * @return {boolean}
     */
    isNull: function (obj) {
        return obj === null
    },
    /**
     * 判定是否undefined
     * @method isUndefined
     * @param obj {any}
     * @return {boolean}
     */
    isUndefined: function (obj) {
        return obj === void 0
    },
    /**
     * 判定是否null或者undefined值
     * @method isNullOrUndefined
     * @param obj {any}
     * @return {boolean}
     */
    isNullOrUndefined: function (obj) {
        return utils.isNull(obj) || utils.isUndefined(obj)
    },
    /**
     * 判定是否数值型数据，包含字符串数据
     * @method isNumeric
     * @param obj {any}
     * @return {boolean}
     */
    isNumeric: function (obj) {
        return obj - parseFloat(obj) >= 0
    },
    /**
     * 判定是否普通对象
     * @method isPlainObject
     * @param obj {any}
     * @return {boolean}
     */
    isPlainObject: function (obj) {
        return obj && typeof obj === 'object' && Object.getPrototypeOf(obj) === Object.prototype || false
    },
    /**
     * 方便用于数据模型验证添加
     * @method isObject 与 isPlainObject相同
     * @param obj {any}
     * @return {boolean}
     */
    isObject: function (obj) {
        return utils.isPlainObject(obj)
    },
    /**
     * 判定是否为空值（null/undefined/''）
     * @method isEmpty
     * @param obj {any}
     * @return {boolean}
     */
    isEmpty: function (obj) {
        return utils.isNull(obj) || utils.isUndefined(obj) || utils.isString(obj) && obj === ''
    },
    /**
     * 获取html元素，返回一个，不存在返回null
     * @method query
     * @param el {string} 合法的CSS选择语法
     * @return {dom|null}
     */
    query: function (el, dom = document) {
        if (utils.isString(el)) {
            var selected = dom.querySelector(el)

            return selected
        } else {
            return el
        }
    },
    /**
     * 获取html元素，可返回多个，不存在返回null
     * @method query
     * @param el {string} 合法的CSS选择语法
     * @return {doms|null}
     */
    queryAll: function (el, dom = document) {
        if (utils.isString(el)) {
            var selected = dom.querySelectorAll(el)

            return selected
        } else {
            return el
        }
    },
    /**
     * 判断是否dom元素
     * @method isDom
     * @param el {htmlelement}
     * @return {boolean}
     */
    isDom: function (el) {
        var d = document.createElement('div')
        try {
            d.appendChild(el.cloneNode(true))
            return el.nodeType === 1
        } catch (e) {
            return el === window || el === document
        }
    },
    transformToDom: function (html) {
        let wrap = document.createElement('div')
        let fragment = document.createDocumentFragment()

        wrap.innerHTML = html
        fragment.appendChild(wrap)

        return fragment.firstChild
    },
    // dom
    /**
     * 监听事件
     * @method on
     * @param el {htmlElement} 需绑定元素
     * @param event {string} 绑定事件名称
     * @param handler {function} 事件执行函数
     */
    on: function (el, event, handler) {
        if (utils.isDom(el) && utils.isString(event) && utils.isFunction(handler)) {
            el.addEventListener(event, handler, false)
            return handler
        } else {
            utils.warn(`utils.on 参数错误：el不是html元素、event非字符串、handler不是函数`, arguments)
        }
    },
    /**
     * 取消监听事件
     * @method off
     * @param el {htmlElement} 需绑定元素
     * @param event {stirng} 绑定事件名称
     * @param handler {function} 事件执行函数
     */
    off: function (el, event, handler) {
        if (utils.isDom(el) && utils.isString(event)) {
            el.removeEventListener(event, handler, false)
        } else {
            utils.warn(`utils.off 参数错误：el不是html元素或event非字符串`, arguments)
        }
    },
    /**
     * 只绑定一次监听事件
     * @method once
     * @param el {htmlElement} 需绑定元素
     * @param event {string} 绑定事件名称
     * @param handler {function} 事件执行函数
     */
    once: function (el, event, handler) {
        if (!utils.isDom(el) || !utils.isString(event) || !utils.isFunction(handler)) {
            return utils.warn(`utils.once 参数错误：el不是html元素或event非字符串或handler不是函数`, arguments)
        }

        var listener = function () {
            if (handler) {
                handler.apply(this, arguments)
            }
            utils.off(el, event, listener)
        }
        utils.on(el, event, listener)
    },
    /**
     * 判断元素是否有className
     * @method hasClass
     * @param el {htmlElement} 元素
     * @param cls {string} 判断类名称
     * @return {boolean}
     */
    hasClass: function (el, cls) {
        if (!utils.isDom(el) || !utils.isString(cls)) {
            utils.warn('utils.hasClass 参数错误：el不是html元素或cls非字符串', arguments)
            return false
        }

        if (cls.indexOf(' ') !== -1) {
            utils.warn('utils.hasClass 参数cls 不能包含空格', arguments)
        }
        if (el.classList) {
            return el.classList.contains(cls)
        } else {
            return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1
        }
    },
    /**
     * 给元素添加className
     * @method addClass
     * @param el {htmlElement} 元素
     * @param cls {string} 类名称
     */
    addClass: function (el, cls) {
        if (!utils.isDom(el)) {
            utils.warn('utils.addClass 参数el非html元素', arguments)
            return
        }
        var curClass = el.className
        var classes = (cls || '').split(' ')

        for (var i = 0, j = classes.length; i < j; i++) {
            var clsName = classes[i]
            if (!clsName) continue

            if (el.classList) {
                el.classList.add(clsName)
            } else {
                if (!utils.hasClass(el, clsName)) {
                    curClass += ' ' + clsName
                }
            }
        }
        if (!el.classList) {
            el.className = curClass
        }
    },
    /**
     * 移除元素className
     * @method removeClass
     * @param el {htmlElement}
     * @param cls {string}
     */
    removeClass: function (el, cls) {
        if (!utils.isDom(el) || !utils.isString(cls)) {
            utils.warn('utils.addClass 参数el非html元素或者cls非字符串', arguments)
            return
        }
        var classes = cls.split(' ')
        var curClass = ' ' + el.className + ' '

        for (var i = 0, j = classes.length; i < j; i++) {
            var clsName = classes[i]
            if (!clsName) continue

            if (el.classList) {
                el.classList.remove(clsName)
            } else {
                if (utils.hasClass(el, clsName)) {
                    curClass = curClass.replace(' ' + clsName + ' ', ' ')
                }
            }
        }
        if (!el.classList) {
            el.className = utils.trim(curClass)
        }
    },
    /**
     * 获取元素某个样式
     * @method getStyle
     * @param el {htmlElement}
     * @param sytleName {string} 样式名称
     * @param defaultVal {any} 报错或者不存在样式时返回默认值，默认为null
     * @return {string|number|null}
     */
    getStyle: function (el, styleName, defaultVal) {
        defaultVal = arguments.length > 2 ? defaultVal : null
        if (!utils.isDom(el) || !utils.isString(styleName)) {
            utils.warn('utils.getStyle 参数el不是html元素或者styleName非字符串', arguments)
            return defaultVal
        }
        styleName = utils.camelCase(styleName)
        if (styleName === 'float') {
            styleName = 'cssFloat'
        }
        try {
            var computed = document.defaultView.getComputedStyle(el, '')
            return el.style[styleName] || computed ? computed[styleName] : defaultVal
        } catch (e) {
            return el.style[styleName]
        }
    },
    /**
     * 设置元素某个样式
     * @method setStyle
     * @param el {htmlelement}
     * @param styleName {string} 样式名称
     * @param value {any} 设置值
     */
    setStyle: function (el, styleName, value) {
        if (!utils.isDom(el) || (!utils.isString(styleName) && !utils.isPlainObject(styleName))) {
            utils.warn('utils.setStyle 参数el不是html元素或者styleName非字符串和对象', arguments)
            return
        }

        if (typeof styleName === 'object') {
            for (var prop in styleName) {
                if (styleName.hasOwnProperty(prop)) {
                    utils.setStyle(el, prop, styleName[prop])
                }
            }
        } else {
            styleName = utils.camelCase(styleName)
            el.style[styleName] = value
        }
    },
    /**
     * 清除字符串两边空格
     * @method trim
     * @param string {string}
     * @return {string|undefined}
     */
    trim: function (string) {
        if (!utils.isString(string)) {
            utils.warn('utils.trim 参数string非字符串类型')
        }
        return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '')
    },
    /**
     * 转换首字母大写
     * @method capitalize
     * @param letter {string}
     * @return {string}
     * @example
     * var result = utils.capitalize('abc') // 'Abc'
     */
    capitalize: function (letter) {
        if (!utils.isString(letter)) {
            utils.warn('utils.capitalize参数letter不是字符串', letter)
        }

        if (letter === '') {
            return letter
        }

        return letter.charAt(0).toUpperCase() + letter.substring(1).toLowerCase()
    },
    /**
     * 转换数据类型名称
     * @method capitalizeTypeName
     * @param type {string|function}
     * @return {string}
     * @example
     * var result = utils.capitalizeTypeName(Object) // 'Object'
     */
    capitalizeTypeName: function (type) {
        if (utils.isString(type) && type !== '') {
            return utils.capitalize(type)
        } else if (utils.isFunction(type)) {
            var result = type.toString().match(/^function\s*?(\w+)\(/)
            if (utils.isArray(result)) {
                return utils.capitalize(result[1])
            }
        }

        return ''
    },
    /**
     * 字符串转camel格式
     * @method camelCase
     * @param name {string}
     * @return {string}
     */
    camelCase: function (name) {
        if (!utils.isString(name)) {
            utils.warn('utils.camelCase 参数name非字符串', arguments)
        }

        return name.replace(/([:\-_]+(.))/g, function (_, separator, letter, offset) {
            return offset ? letter.toUpperCase() : letter
        })
    },
    /**
     * 转换汉字大写金额
     * @method amountToChinese
     * @param amount {number}
     * @return {string}
     * @example
     * var result = utils.amountToChinese(100) // '壹百元整'
     */
    amountToChinese: function (amount) {
        if (!utils.isNumeric(amount)) {
            utils.warn('utils.amountToChinese 参数amount不是数字格式', amount)
            return ''
        }
        let unit = '京亿万仟佰拾兆万仟佰拾亿仟佰拾万仟佰拾元角分'
        let str = ''
        amount += '00'

        let i = amount.indexOf('.')
        if (i >= 0) {
            amount = amount.substring(0, i) + amount.substr(i + 1, 2)
        }

        if (unit.length < amount.length) {
            utils.warn('utils.amountToChinese 参数amount超出可转换范围', amount)
        } else {
            unit = unit.substr(unit.length - amount.length)
        }

        for (i = 0; i < amount.length; i++) {
            str += '零壹贰叁肆伍陆柒捌玖'.charAt(amount.charAt(i)) + unit.charAt(i)
        }

        return str.replace(/零角零分$/, '整')
            .replace(/零[仟佰拾]/g, '零')
            .replace(/零{2,}/g, '零')
            .replace(/零([亿|万])/g, '$1')
            .replace(/零+元/, '元')
            .replace(/亿零{0,3}万/, '亿')
            .replace(/^元/, '零元')
    },
    /**
     * 转整数，存在小数会四舍五入
     * @method parseInt
     * @param number {string|number}
     * @param defaultValue {string|number} 当number不是数字格式时返回的值，默认范围0
     * @return number
     * @example
     * var result = utils.parseInt('123') // 123
     */
    parseInt: function (number, defaultValue) {
        if (!utils.isNumeric(number)) {
            arguments.length < 2 && utils.warn('utils.parseInt 参数number不是数字格式', number)
            return arguments.length < 2 ? 0 : defaultValue
        }

        return parseInt(Math.round(parseFloat(number)), 10)
    },
    /**
     * 转换小数格式
     * @method parseDecimal
     * @param number {string|number}
     * @param places {number} 小数点位数，默认保留2位小数位
     * @param defaultValue {string|number} 当number不是数字格式时返回的值，默认为'0.00'
     * @param min {number} 最小值，可选；当number小于最小值时返回最小值
     * @param max {number} 最大值，可选；当number大于最大值时返回最大值
     * @return string
     */
    parseDecimal: function (number, places, min, max, defaultValue) {
        number = number || 0
        if (!utils.isNullOrUndefined(places)) {
            if (!utils.isInt(places) ||
                utils.isInt(places) && parseFloat(places) < 0) {
                utils.warn('utils.parseDecimal 参数places不是整数类型', arguments)
                places = 2
            }
        } else {
            places = 2
        }

        var minValue
        var maxValue
        if (!utils.isNumeric(number)) {
            arguments.length < 5 && utils.warn('utils.parseDecimal 参数number不是数字格式', arguments)
            return arguments.length < 5 ? '0.00' : defaultValue
        }

        if (!utils.isNullOrUndefined(min)) {
            if (utils.isNumeric(min)) {
                minValue = parseFloat(min)
                if (parseFloat(number) < minValue) {
                    number = parseFloat(min)
                }
            } else {
                utils.warn('utils.parseDecimal 参数min不是数字格式', arguments)
            }
        }

        if (!utils.isNullOrUndefined(max)) {
            if (utils.isNumeric(max)) {
                maxValue = parseFloat(max)
                if (parseFloat(number) > parseFloat(max)) {
                    number = parseFloat(max)
                }
            } else {
                utils.warn('utils.parseDecimal 参数max不是数字格式', arguments)
            }
        }

        if (!utils.isUndefined(minValue) && !utils.isUndefined(maxValue)) {
            if (minValue > maxValue) {
                utils.warn('utils.parseDecimal 参数min比参数max大', arguments)
            }
        }

        return parseFloat(number).toFixed(places)
    },
    /**
     * 转百分比
     * @method parsePercent
     * @param number {string|number} 数字或者数字格式字符串
     * @param places {int} 小数点位数，默认没有小数位
     * @param defaultValue 可选，当number不合法时返回的值，默认为''
     * @return string
     */
    parsePercent: function (number, places, defaultValue) {
        if (!utils.isNullOrUndefined(places) && (!utils.isInt(places) ||
            utils.isInt(places) && parseFloat(places) < 0)) {
            utils.warn('utils.parsePercent 参数places不是正整数类型', arguments)
            places = 0
        }
        if (!utils.isNumeric(number)) {
            arguments.length < 3 && utils.warn('utils.parsePercent 参数number不是数字格式', arguments)
            return arguments.length < 3 ? '' : defaultValue
        }

        return (number * 100).toFixed(places || 0) + '%'
    },
    /**
     * 数字转千分位格式
     * @method toThousands
     * @param number {number|string} 需转换的数字或者字符串数字
     * @param places {number} 小数点位数，默认不保留小数位
     * @param defaultValue {any} 参数number不符合数字格式时返回该默认值,默认为''
     * @return string
     */
    toThousands: function (number, places, defaultValue) {
        if (!utils.isNumeric(number)) {
            arguments.length < 3 && utils.warn('utils.toThousands 参数number不是数字格式', arguments)
            return arguments.length < 3 ? '' : defaultValue
        }

        if (!utils.isNullOrUndefined(places) && (!utils.isInt(places) ||
            utils.isInt(places) && parseFloat(places) < 0)) {
            utils.warn('utils.toThousands 参数places不是整数', arguments)
            places = 0
        }

        number = parseFloat(number).toFixed(places || 0)
        var decimal = ''
        var integer = ''

        if (number.indexOf('.') !== -1) {
            decimal = number.substr(number.indexOf('.') + 1)
            number = number.substr(0, number.indexOf('.'))
        }

        while (number.length > 3) {
            integer = ',' + number.slice(-3) + integer
            number = number.slice(0, number.length - 3)
        }
        if (number) {
            integer = number + integer
        }

        return integer + (decimal ? ('.' + decimal) : '')
    },
    /**
     * 数组去重：非数组类型返回空数组；对象数组，引用地址相同的对象视为重复对象
     * @method unique
     * @param arr {array} 数组
     * @return {array}
     */
    unique: function (arr) {
        if (!utils.isArray(arr)) {
            utils.warn('utils.unique 参数arr不是数组类型', arguments)
            return []
        }

        return [...new Set(arr)]
    },
    /**
     * 合并数组
     * @method merge
     * @param args[i] {array} 数组
     * @param args[args.length-1] {boolean} 可选，是否去重（最后一个参数）
     * @return {array}
     */
    merge: function (...args) {
        var result = []
        let isUnique = false

        if (args.length && utils.isBoolean(args[args.length - 1])) {
            isUnique = args[args.length - 1]
            args.splice(args.length - 1, 1)
        }

        result = Array.prototype.concat.apply(result, args)

        if (isUnique) {
            return utils.unique(result)
        }
        return result
    },
    /**
     * 数组元素互换位置/对象属性值互换
     * @method transpose
     * @param arr {array|object} 数组或者对象
     * @param index1 {number|string} 调换数组项索引或者对象属性名称
     * @param index2 {number|string} 调换数组项索引或者对象属性名称
     */
    transpose: function (arr, index1, index2) {
        if (utils.isArray(arr) || utils.isPlainObject(arr)) {
            if (!utils.hasOwn(arr, index1) || !utils.hasOwn(arr, index2)) {
                utils.warn('utils.transpose arr不存在index1或者index2属性', arguments)
                return
            }

            var temp = arr[index1]
            arr[index1] = arr[index2]
            arr[index2] = temp
        } else {
            utils.warn('utils.transpose 参数arr不是数组，也不是普通对象', arguments)
            return
        }
    },
    /**
     * 返回指定的命名空间下对象，若不存在则创建对象
     * @method namespace
     * @param namespace {string} 命名空间名称，可“.”相连接
     * @param root {object} 指定根对象
     * @return {object}
     * @example
     *   var obj = {
     *      a:{
     *          b:{
     *              c:0
     *          }
     *      }
     *   }
     *   var b = utils.namesapce('a.b', obj); // 返回obj.a.b
     */
    namespace: function (namespace, root) {
        if (!utils.isString(namespace) ||
            utils.isNullOrUndefined(root)) {
            utils.warn('调用utils.namespace()参数错误', namespace, root)
        }

        if (namespace === '') {
            return root
        }

        var names = namespace.split('.')
        names.forEach(function (name) {
            if (root.hasOwnProperty(name)) {
                root = root[name]
            } else {
                root[name] = {}
                root = root[name]
            }
        })
        return root
    },
    /**
     * @method isExistNamespace
     * @param namespace {string} 命名空间名称，可“.”相连接
     * @param root {object} 指定根对象
     * @return {boolean}
     * @example
     *  var obj = {
     *      a:{
     *          b:{
     *              c: 0
     *          }
     *      }
     *  }
     *  utils.isExistNamespace('a.b', obj) // true
     *  utils.isExistNamespace('a.c', obj) // false
     */
    isExistNamespace: function (namespace, root) {
        if (!utils.isString(namespace) || namespace === '' ||
            utils.isUndefined(root) || utils.isNull(root)) {
            utils.warn('调用utils.namespace()参数错误', namespace, root)
        }

        var names = namespace.split('.')

        for (var i = 0, len = names.length; i < len; i++) {
            if (!root.hasOwnProperty(names[i])) {
                return false
            }
            root = root[names[i]]
        }

        return true
    },
    /**
    * 遍历数组和对象属性
    * @method forEach
    * @param data {object|array}
    * @param callback {function}
    */
    forEach: function (data, callback) {
        if (!utils.isFunction(callback)) {
            utils.warn('调用utils.forEach() callback参数不是函数', callback)
            return
        }

        if (utils.isArray(data)) {
            data.forEach(callback)
        } else if (utils.isPlainObject(data)) {
            Object.keys(data).forEach(function (key) {
                callback.call(data, data[key], key)
            })
        } else {
            utils.warn('调用utils.forEach() data参数不是对象也不是数组', data)
        }
    },
    /**
     * 编码字符串中的html
     * @method escapeHtml
     * @param target {string}
     * @return {string}
     */
    escapeHtml: function (target) {
        if (!utils.isString(target)) {
            utils.warn('utils.escapeHtml 参数target不是字符串类型', target)
            return ''
        }
        return target.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
    },
    /**
     * 解码字符串中的html
     * @method escapeHtml
     * @param target {string}
     * @return {string}
     */
    unescapeHtml: function (target) {
        if (!utils.isString(target)) {
            utils.warn('utils.unescapeHtml 参数target不是字符串类型', target)
            return ''
        }
        return target.replace(/&quot;/g, '"')
            .replace(/&gt;/g, '>')
            .replace(/&lt;/g, '<')
            .replace(/&amp;/g, '&')
            .replace(/&#([\d]+);/g, function ($0, $1) {
                return String.fromCharCode(parseInt($1, 10))
            })
    },
    /**
     * 获取url上query参数，没匹配到返回null
     * @method getQueryString
     * @param name {string}
     * @param url {string} 可选，默认为当前url
     * @return string|null
     */
    getQueryString: function (name, url, isDeCode) {
        isDeCode = utils.isBoolean(isDeCode) ? isDeCode : true
        if (!utils.isString(name) || name === '') {
            utils.warn('utils.getQueryString 参数name必须为字符串且不为空', arguments)
            return ''
        }
        // if (arguments.length > 1 && (!utils.isString(url) || url === '')) {
        //     utils.warn('utils.getQueryString 参数url不能为空', arguments)
        //     return ''
        // }
        if (url) {
            if (url.indexOf('?') !== -1) {
                url = url.substr(url.indexOf('?') + 1)
            }
        }
        url = url || window && window.location.search.substr(1) || ''
        var reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`)
        var r = url.match(reg)

        if (utils.isArray(r)) {
            return isDeCode ? decodeURIComponent(r[2]) : r[2]
        } else {
            return ''
        }
    },
    /**
     * 给url设置params参数
     * @method setQueryString
     * @param params {object}
     * @param url {string} 不传默认为当前地址
     * @return string
     */
    setQueryString: function (params, url) {
        if (!utils.isPlainObject(params)) {
            utils.warn('调用utils.setUrlParam()参数不是普通对象', params)
        }

        let isEmpty = false
        if (arguments.length > 1) {
            if (!utils.isString(url)) {
                utils.warn('utils.setQueryString 参数url必须为字符串', arguments)
                url = ''
            }

            isEmpty = url === ''
        } else {
            url = window && window.location.href || ''
        }

        let noParam = true
        // url === ''时，返回key=val&key=val
        if (!isEmpty) {
            url = url.indexOf('?') === -1 ? url + '?' : url
            noParam = url.lastIndexOf('?') === url.length - 1
        }

        utils.forEach(params, function (val, key) {
            url += (noParam ? '' : '&') + key + '=' + encodeURIComponent(val)
            if (noParam) {
                noParam = false
            }
        })

        return url
    },
    /**
     * 获取query参数对象
     * @method parseQuery
     * @param url {string} 提取query的url地址
     * @param separator {string} 分隔符，默认是&
     * @return string
     */
    parseQuery: function (url, separator = '&') {
        if (!utils.isString(url)) {
            utils.warn('调用utils.parseQuery() url参数不是字符串', url)
        }

        let pairs
        let map
        let params = {}

        if (url.indexOf('?') > -1) {
            url = url.split('?')[1]
        }

        pairs = url.split(separator)
        for (var i = 0, len = pairs.length; i < len; i++) {
            map = pairs[i].split('=')
            if (map[0] in params) {
                if (utils.isArray(params[map[0]])) {
                    params[map[0]].push(map[1])
                } else {
                    params[map[0]] = [params[map[0]], map[1]]
                }
            } else {
                params[map[0]] = map[1]
            }
        }
        return params
    },
    /**
     * 字符串转换时间
     * @method parseDate
     * @param strDate {string}
     * @return date|null
     */
    parseDate: function (strDate, defaultValue) {
        if (utils.isDate(strDate)) {
            return strDate
        }

        defaultValue = arguments.length === 2 ? defaultValue : null
        if (!utils.isString(strDate) || strDate === '') {
            return defaultValue
        }

        strDate = strDate.toLowerCase()
        strDate = strDate.replace('年', '-')
                    .replace('月', '-')
                    .replace('日', ' ')
                    .replace('时', ':')
                    .replace('分', '')
                    .replace('t', ' ')
                    .replace('z', '')

        var reg = /^(\d{4})([-|/])(\d{1,2})\2(\d{1,2})(\s(\d{1,2}):(\d{1,2})(:(\d{1,2}))?)?(.\d{1,4})?$/
        var result = strDate.match(reg)
        if (utils.isNull(result)) {
            return defaultValue
        }

        result[3] = result[3] - 1
        var date = new Date(result[1], result[3], result[4], result[6] || 0, result[7] || 0, result[9] || 0)

        if (date.getFullYear() !== parseFloat(result[1]) || date.getMonth() !== parseFloat(result[3]) ||
            date.getDate() !== parseFloat(result[4]) || date.getHours() !== (result[6] && parseFloat(result[6]) || 0) ||
            date.getMinutes() !== (result[7] && parseFloat(result[7]) || 0) || date.getSeconds() !== (result[9] && parseFloat(result[9]) || 0)) {
            return defaultValue
        }
        return date
    },
    /**
     * 中国标准日期格式=> 2017-05-17 10:38:06
     * @method formatDate
     * @param date {string|date} 转换日期
     * @param fmt {string} 格式化参数
     * @returns {string}
     */
    formatDate: function (date, fmt = 'yyyy-MM-dd hh:mm:ss') {
        if (!utils.isString(date) && !utils.isDate(date)) {
            return ''
        }

        if (utils.isString(date)) {
            if (date === '') {
                return ''
            }
            date = date.replace('T', ' ')
            date = utils.parseDate(date)

            if (utils.isNull(date)) {
                return ''
            }
        }

        var o = {
            'M+': date.getMonth() + 1, // 月份
            'd+': date.getDate(), // 日
            'h+': date.getHours(), // 小时
            'm+': date.getMinutes(), // 分
            's+': date.getSeconds() // 秒
        }

        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
        }

        for (var k in o) {
            if (new RegExp('(' + k + ')').test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k])
                    : (('00' + o[k]).substr(('' + o[k]).length)))
            }
        }
        return fmt
    },
    /**
     * 获取两个时间差，不符合日期格式返回-1或者指定默认值
     * @method utils.getDateInterval
     * @param start {date|string}
     * @param end {date|string}
     * @param unit {string} 单位类型，默认是毫秒，可传值：d（日）/h（小时）/m（分钟）/s(秒)/ms(毫秒)
     * @param defaultValue {any} 当日期格式无效时返回指定的默认值
     * @return number
     */
    getDateInterval: function (start, end, unit, defaultValue) {
        if (utils.isString(start)) {
            start = utils.parseDate(start)
        }
        if (utils.isString(end)) {
            end = utils.parseDate(end)
        }
        defaultValue = arguments > 3 ? defaultValue : -1
        if (!utils.isDate(start) || !utils.isDate(end)) {
            utils.warn('utils.getDateInterval 参数start或end不是日期格式或者转换日期格式失败', start, end)
            return defaultValue
        }
        unit = arguments.length < 3 ? 'ms' : unit
        const divisorMap = {
            ms: 1,
            s: 1000,
            m: 1000 * 60,
            h: 1000 * 60 * 60,
            d: 1000 * 60 * 60 * 24
        }

        if (!divisorMap.hasOwnProperty(unit)) {
            utils.warn('utils.getDateInterval 参数unit暂只支持d/h/m/s/ms之一', start, end, unit)
            unit = 'ms'
        }

        return Math.abs(start * 1 - end * 1) / divisorMap[unit]
    },
    /**
    * 获取相隔几天后的日期
    * @method getDateByDaysApart
    * @param date {Date|string}
    * @param number {number}
    * @param defaultValue {any} 当指定date、number无效时返回指定的默认值，默认范围null
    * @return Date|null
    * @example
    *   var threeDaysLater = utils.getDateByDaysApart(new Date(), 3);
    */
    getDateByDaysApart: function (date, number, defaultValue) {
        if (utils.isString(date)) {
            date = utils.parseDate(date)
        }
        defaultValue = arguments.length > 2 ? defaultValue : null
        if (!utils.isDate(date)) {
            utils.warn('utils.getDateByDaysApart 参数date不是日期格式或者不能转换日期类型', date)
            return defaultValue
        }
        if (!utils.isNumeric(number)) {
            utils.warn('utils.getDateByDaysApart 参数number不是有效数字', number)
            return defaultValue
        }
        return new Date(date.getTime() + 60 * 60 * 1000 * 24 * number)
    },
    /**
     * @method utils.setWorkDays
     * @param days {array} 数字数组，范围：0-6
     */
    setWorkDays: function (days) {
        if (!utils.isArray(days)) {
            utils.warn('utils.setWorkDays 参数days不是数据类型', days)
            return
        }

        workDays.length = 0
        days.forEach(function (day, i) {
            if (utils.isInt(day)) {
                day = parseInt(day, 10)
                if (day < 0 || day > 6) {
                    utils.warn('utils.setWorkDays 参数days数据项数据范围必须是0-6', day, i)
                }

                if (workDays.indexOf(day) === -1) {
                    workDays.push(day)
                }
            } else {
                utils.warn('utils.setWorkDays 参数days数据项不是数字', day, i)
            }
        })
    },
    /**
     * 判断是否工作日
     * @method isWorkDay
     * @param date {string|date} 日期类型或者日期字符串
     * @return {boolean}
     */
    isWorkDay: function (date) {
        if (utils.isString(date)) {
            date = utils.parseDate(date)
        }
        if (!utils.isDate(date)) {
            utils.warn('utils.isWorkDay 参数date不是日期格式或者不能转换日期类型', date)
        }

        return workDays.indexOf(date.getDay()) !== -1
    },
    /**
     * 将obj属性并入target对象中，默认不覆盖
     * 当参数target、参数obj无效时返回target
     * @method assign
     * @param target {object} 目标对象
     * @param obj {object}
     * @param bCover {boolean} 是否覆盖
     * @param bDepth {boolean} 是否深度覆盖
     * @return {object} target
     */
    assign: function (target, obj, bCover, bDepth) {
        if (!utils.isPlainObject(target) || !utils.isPlainObject(obj)) {
            utils.warn('调用utils.assign() target或者obj参数不是普通对象', target, obj)
            return target
        }

        bCover = !!bCover
        bDepth = !!bDepth

        var props = Object.keys(obj)
        for (var i = 0, len = props.length; i < len; i++) {
            if (target.hasOwnProperty(props[i]) && !bCover) {
                continue
            }

            if (bDepth && utils.isPlainObject(obj[props[i]])) {
                target[props[i]] = {}
                utils.assign(target[props[i]], obj[props[i]], bCover, bDepth)
            } else {
                target[props[i]] = obj[props[i]]
            }
        }

        return target
    },
    /**
     * 获取单例对象
     * @method getSingleton
     * @param fn {function} 仅执行一次的函数，必须返回非false的值
     * @return {function} 通过执行返回函数保证调用同一个对象
     */
    getSingleton: function (fn) {
        var inst = null
        const self = this

        if (!utils.isFunction(fn)) {
            utils.warn('utils.getSingleton 参数fn必须为函数', fn)
            return null
        }

        return function () {
            return inst || (inst = fn.apply(self, arguments))
        }
    },
    /**
     * 判断对象是否拥有非继承的属性
     * @method hasOwn
     * @param obj
     * @param prop {string}
     * @return {boolean}
     */
    hasOwn: function (obj, prop) {
        return Object.prototype.hasOwnProperty.call(obj, prop)
    },
    /**
     * 判断对象是否拥有多个非继承属性
     * @param obj
     * @param props {array}
     * @return {boolean}
     */
    hasOwns: function (obj, props) {
        if (!utils.isArray(props)) {
            utils.warn('utils.hasOwns 参数props必须为数组')
        }

        let result = true
        props.forEach(function (prop) {
            if (!utils.hasOwn(obj, prop)) {
                result = false
                return false
            }
        })

        return result
    },
    /**
     * 延迟执行fn函数
     */
    delay: function (fn, callback, maxTime) {
        var timer = null
        var isCall = false

        return {
            start: function () {
                if (timer) {
                    clearTimeout(timer)
                }

                timer = setTimeout(function () {
                    if (typeof fn === 'function') {
                        fn()
                        isCall = true
                    }
                }, maxTime)
            },
            stop: function () {
                if (isCall) {
                    if (typeof callback === 'function') {
                        callback()
                    }
                } else {
                    clearTimeout(timer)
                }

                timer = null
                isCall = false
                fn = null
                callback = null
            }
        }
    },
    // 本地存储
    localStorage: {
        /**
         * @method localStorage.set
         * @param key {string}
         * @param value {string|object}
         * @return boolean 表示是否设置成功
         */
        set: function (key, value) {
            if (!utils.isString(key) || key === '' || utils.isNullOrUndefined(value)) {
                utils.warn('utils.localStorage.set 参数key不能为空或者value不能为undefined/null')
                return false
            }
            if (typeof value === 'object') {
                value = JSON.stringify(value)
            }

            window.localStorage.setItem(key, value)
            return true
        },
        /**
         * @method localStorage.get
         * @param key {string}
         * @param default {any}
         * @return {string|null}
         */
        get: function (key, defaultValue) {
            defaultValue = arguments.length === 2 ? defaultValue : null
            if (!utils.isString(key) || key === '') {
                arguments.length < 2 && utils.warn('utils.localStorage.get 参数key必须为字符串，且不能为空')
                return defaultValue
            }
            let val = window.localStorage.getItem(key)
            if (utils.isNull(val)) {
                return defaultValue
            } else {
                return val
            }
        },
        /**
         * @method localStorage.remove
         * @param key {string}
         * @return {boolean} 是否删除成功
         */
        remove: function (key) {
            if (!utils.isString(key) || key === '') {
                utils.warn('utils.localStorage.remove 参数key不能为空')
                return false
            }
            window.localStorage.removeItem(key)
            return true
        },
        /**
         * @method localStorage.clear
         */
        clear: function () {
            window.localStorage.clear()
        }
    },
    // 本地存储
    sessionStorage: {
        /**
         * @method sessionStorage.set
         * @param key {string}
         * @param value {string|object}
         * @return boolean 表示是否设置成功
         */
        set: function (key, value) {
            if (!utils.isString(key) || key === '' || utils.isNullOrUndefined(value)) {
                utils.warn('utils.sessionStorage.set 参数key不能为空或者value不能为undefined/null')
                return false
            }
            if (typeof value === 'object') {
                value = JSON.stringify(value)
            }

            window.sessionStorage.setItem(key, value)
            return true
        },
        /**
         * @method sessionStorage.get
         * @param key {string}
         * @param default {any}
         * @return {string|null}
         */
        get: function (key, defaultValue) {
            defaultValue = arguments.length === 2 ? defaultValue : null
            if (!utils.isString(key) || key === '') {
                arguments.length < 2 && utils.warn('utils.sessionStorage.get 参数key必须为字符串，且不能为空')
                return defaultValue
            }
            let val = window.sessionStorage.getItem(key)
            if (utils.isNull(val)) {
                return defaultValue
            } else {
                return val
            }
        },
        /**
         * @method sessionStorage.remove
         * @param key {string}
         * @return {boolean} 是否删除成功
         */
        remove: function (key) {
            if (!utils.isString(key) || key === '') {
                utils.warn('utils.sessionStorage.remove 参数key不能为空')
                return false
            }
            window.sessionStorage.removeItem(key)
            return true
        },
        /**
         * @method sessionStorage.clear
         */
        clear: function () {
            window.sessionStorage.clear()
        }
    },
    // cookie操作
    cookie: {
        /**
         * @method cookie.set
         * @param key {string}
         * @param value {string|value}
         * @param expiredays {number} 过期时间
         * @return boolean 表示是否设置成功
         */
        set: function (key, value, expiredays) {
            var date
            if (!utils.isString(key) || key === '' || utils.isNullOrUndefined(value)) {
                utils.warn('utils.cookie.set 参数key不能为空或者value不能为undefined/null')
                return false
            }
            if (utils.isInt(expiredays)) {
                date = new Date()
                date.setDate(date.getDate() + expiredays)
            }

            document.cookie = key + '=' + escape(value) + (!date ? '' : ';expires=' + date.toGMTString())
            return true
        },
        /**
         * @method cookie.get
         * @param key {string}
         * @return {string|null}
         */
        get: function (key, defaultValue) {
            defaultValue = arguments.length === 2 ? defaultValue : null
            if (!utils.isString(key) || key === '') {
                utils.warn('utils.cookie.get 参数key不能为空')
                return defaultValue
            }
            var arr = document.cookie
                .match(new RegExp('(^| )' + key + '=([^;]*)(;|$)'))

            if (utils.isArray(arr)) {
                return unescape(arr[2])
            }

            return defaultValue
        },
        /**
         * @method cookie.remove
         * @param key {string}
         * @return {boolean} 返回是移除成功
         */
        remove: function (key) {
            return utils.cookie.set(key, '', -1000)
        }
    },
    /**
    * 动画
    * @param {object} opts 配置项，属性如下：
    *  {
    *      delay：间隔多少毫秒执行一次，默认是10秒
    *      duration: 执行时长
    *      step：每部执行方法
    *      delta: 进度增量函数
    *      callback: 执行完成回调
    *  }
    */
    animate (opts) {
        var start = new Date()
        var id = window.setInterval(function () {
            var timePassed = new Date() - start
            var progress = timePassed / opts.duration
            if (progress > 1) progress = 1
            var delta = opts.delta(progress)
            opts.step(delta)
            if (progress === 1) {
                window.clearInterval(id)
                if (utils.isFunction(opts.callback)) {
                    opts.callback()
                }
            }
        }, opts.delay || 10)
    }
}

export default utils

