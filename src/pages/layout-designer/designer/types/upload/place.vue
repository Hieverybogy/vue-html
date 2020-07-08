<template>
    <sapi-upload 
        :type="vnode.attrs.type" 
        :size="vnode.attrs.size" 
        :count="vnode.attrs.count"
        :readonly="vnode.attrs.readonly">
    </sapi-upload>
</template>

<script>
    import SapiUpload from '@/components/sapi-upload'
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
        },
        components: {
            SapiUpload
        }
    }
</script>
