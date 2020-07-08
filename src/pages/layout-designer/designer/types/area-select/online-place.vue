<template>
    <sapi-area-multiple ref="areaSelect"
        :type="vnode.attrs.type" 
        :multiple="vnode.attrs.multiple"
        :limit="vnode.attrs.limit" 
        :readonly="vnode.attrs.readonly"
        @change="filterChange"></sapi-area-multiple>
</template>

<script>
    import sapiAreaMultiple from '@/components/sapi-area-multiple.vue'
    export default {
        inject: ['list'],
        props: {
            vnode: {
                type: Object,
                default() {
                    return {
                        attrs: {}
                    }
                }
            },
            params: Object
        },
        components: {
            sapiAreaMultiple
        },
        methods: {
            filterChange (data) {
                if (!this.vnode.attrs.multiple) {  // 单选
                    this.params[this.vnode.fieldId] = data && data[0] ? data[0][`${this.vnode.attrs.type}Id`] : ''
                } else {  // 多选
                    let arr = []
                    for (let i = 0; i < data.length; i++) {
                        arr.push(data[i][`${this.vnode.attrs.type}Id`])
                    }
                    this.params[this.vnode.fieldId] = arr.join(',')
                }
               
                this.list.loadData()
            }
        }
    }
</script>