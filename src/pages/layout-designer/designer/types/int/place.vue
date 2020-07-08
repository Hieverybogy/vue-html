<template>
    <sapi-number 
        :type="vnode.attrs.format === 'thousand' ? 'thousand' : vnode.type" 
        :value="vnode.attrs.value"
        :min="vnode.attrs.min" 
        :readonly="vnode.attrs.readonly"
        :placeholder="vnode.attrs.placeholder"
        :max="vnode.attrs.max">
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
