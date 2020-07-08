<template>
    <sapi-number 
        :type="vnode.attrs.format === 'thousand' ? 'thousand' : vnode.type" 
        :value="vnode.attrs.value"
        :place="vnode.attrs.place"
        :readonly="vnode.attrs.readonly"
        :min="vnode.attrs.min" :max="vnode.attrs.max">
        <template slot="suffix" v-if="vnode.unit"><div>{{vnode.unit}}</div></template>
    </sapi-number>
</template>

<script>
    import PlaceMixin from '../place-mixin'
    export default {
        mixins: [PlaceMixin],
        props: {
            vnode: {
                type: Object,
                default () {
                    return {
                        attrs: {}
                    }
                }
            }
        }
    }
</script>
