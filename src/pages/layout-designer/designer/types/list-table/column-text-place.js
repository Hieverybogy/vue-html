
export default {
    props: {
        vnode: Object
    },
    render (createElement) {
        const text = this.getColumnVnodeText()
        if (this.vnode.isLink) {
            return createElement('a', {
                attrs: {
                    href: 'javascript:void(0)'
                },
                domProps: {
                    innerHTML: text
                }
            })
        } else {
            return createElement('span', text)
        }
    },
    methods: {
        getColumnVnodeText () {
            const cvnode = this.vnode
            if (cvnode.dataType === 'text' || cvnode.dataType === 'textarea') {
                return cvnode.label || '请设置表头名称'
            } else if (cvnode.dataType === 'int' || cvnode.dataType === 'float') {
                return this.formatNumber(cvnode)
            } else if (cvnode.dataType === 'date') {
                return this.formatDate(cvnode)
            }
        },
        formatDate (cvnode) {
            return this.$utils.formatDate(new Date(), cvnode.format)
        },
        formatNumber (cvnode) {
            if (cvnode.dataType === 'int') {
                if (cvnode.format === 'normal') {
                    return 10000
                } else {
                    return this.$utils.toThousands(10000, 0)
                }
            } else {
                if (cvnode.format === 'normal') {
                    return parseFloat(10000).toFixed(cvnode.place)
                } else {
                    return this.$utils.toThousands(10000, cvnode.place)
                }
            }
        }
    }
}
