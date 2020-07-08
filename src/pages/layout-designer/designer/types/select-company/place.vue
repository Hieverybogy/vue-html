<template>
    <component :is="view" 
        ref="selectStru"
        v-model="corpId" 
        :withDept="vnode.selectType === 'compnay' ? false : true"
        :clearable="vnode.attrs ? vnode.attrs.clearable : null"
        :readonly="vnode.attrs ? vnode.attrs.readonly : null"
        :companyWithClick="vnode.selectType === 'dept' ? false : true"
        :activeHasChild="!vnode.onlyLeafActive"></component>
</template>

<script>
    import PlaceMixin from '../place-mixin'
    export default {
        mixins: [PlaceMixin],
        components: {
            'select-stru': () => import("@/components/selectStru")
        },
        props: {
            vnode: {
                type: Object,
                default() {
                    return {
                        attrs: {}
                    }
                }
            },
            list: []
        },
        data() {
            return {
                view: '',
                corpId: ''
            }
        },
        watch: {
            'vnode.selectType' (val) {
                this.view = ''
                this.corpId = ''
                this.$nextTick(function() {
                    this.view = 'select-stru'
                })
            },
            'vnode.onlyLeafActive' () {
                this.view = ''
                this.corpId = ''
                this.$nextTick(function() {
                    this.view = 'select-stru'
                })
            }
        },
        created() {
            this.view = 'select-stru'
        }
    }
</script>