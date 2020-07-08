<template>
    <div class="drag-module">
        <dl>
            <dt>筛选字段</dt>
            <dd>
                <draggable
                    :list="category.base"
                    :sort="false"
                    ghost-class="ghost"
                    chosen-class="chosen"
                    :group="{name: 'widget', pull: 'clone', put: false}">
                    <div class="draggable-type"
                        :class="'type-' + t.type"
                        :key="t.type"
                        v-for="(t, i) in category.base">
                        <a href="javascript:void(0)">{{t.label}}</a>
                    </div>
                    <div class="draggable-type"
                        :class="'type-' + t.type"
                        :key="t.type"
                        v-for="(t, i) in category.enhance">
                        <a href="javascript:void(0)">{{t.label}}</a>
                    </div>
                </draggable>
            </dd>
        </dl>
    </div>
</template>

<script>
    import draggable from '../../components/draggable.js'
    import Types from './types.js'
    export default {
        components: {
            draggable
        },
        props: {
            types: Object
        },
        computed: {
            category () {
                const types = {
                    layout: [],
                    base: [],
                    enhance: []
                }

                for (let type in Types) {
                    const t = Types[type]
                    let user = t.user
                    if (user && types.hasOwnProperty(t.category) &&
                        user.indexOf('list') > -1) {
                        types['base'].push(t)
                    }
                }

                return types
            }
        },
        methods: {
            moveFun (evt) {
                if (evt.related &&
                    evt.related.className.indexOf('collapses-draggable-wrap') > -1) {
                    return false
                }
            }
        }
    }
</script>

<style lang="less">
    .draggable-type{
        display: inline-block;
        width: 95px;
        height: 30px;
        margin-right: 5px;
        margin-bottom: 5px;
        text-align: center;
        line-height: 30px;
        background-color: #f4f6fc;
        border: 1px dotted #f4f6fc;
        border-radius: 2px;
        cursor: move;

        a {
            cursor: move;
        }

        &:hover{
            color: #458aff;
            border: 1px dashed #458aff;
        }
    }
</style>