<template>
    <tree
        :data="treeNodes"
        :props="treeProps"
        :expandOnClickNode="vnode.attrs.expandOnClickNode"
        :uniqueOpened="vnode.attrs.uniqueOpened"
        @click.native.stop="setActivateVnode"
    ></tree>
</template>
<script>
import Tree from '@/components/tree'

export default {
    name: 'stru-tree',
    components: {
        Tree
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
    data () {
        return {
            treeNodes: [
                {
                    label: '0-0',
                    value: '0-0',
                    children: [
                        {
                            label: '0-0-0',
                            value: '0-0-0',
                            children: [
                                { label: '0-0-0-0', value: '0-0-0-0' },
                                { label: '0-0-0-1', value: '0-0-0-1' },
                                { label: '0-0-0-2', value: '0-0-0-2' }
                            ]
                        },
                        {
                            label: '0-0-1',
                            value: '0-0-1',
                            children: [
                                { label: '0-0-1-0', value: '0-0-1-0' },
                                { label: '0-0-1-1', value: '0-0-1-1' },
                                { label: '0-0-1-2', value: '0-0-1-2' }
                            ]
                        },
                        {
                            label: '0-0-2',
                            value: '0-0-2'
                        }
                    ]
                },
                {
                    label: '0-1',
                    value: '0-1',
                    children: [
                        { label: '0-1-0-0', value: '0-1-0-0' },
                        { label: '0-1-0-1', value: '0-1-0-1' },
                        { label: '0-1-0-2', value: '0-1-0-2' }
                    ]
                },
                {
                    label: '0-2',
                    value: '0-2'
                }
            ],
            treeProps: {
                label: 'label',
                value: 'value',
                children: 'children',
                disabled: 'disabled',
                hasChild: 'hasChild'
            }
        }
    },
    methods: {
        setActivateVnode () {
            this.$parent.setActivateVnode()
        }
    }
}
</script>

