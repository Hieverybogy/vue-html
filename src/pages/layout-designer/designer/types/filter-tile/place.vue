<template>
    <sapi-tile-filter v-model="value"
        @change="filterChange('classId', $event, vnode.label)"
        :props="{label: 'className', value: 'id', children: 'children'}"
        :data="classIdOptions"></sapi-tile-filter>
</template>

<script>
    import SapiTileFilter from "@/pages/components/sapi-tile-filter.vue";
    import PlaceMixin from '../place-mixin'
    export default {
        mixins: [PlaceMixin],
        components: {
            SapiTileFilter
        },
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
        data() {
            return {
                value: '',
                classIdOptions: []
            }
        },
        methods: {
            filterChange () {
            }
        }
    }
</script>
