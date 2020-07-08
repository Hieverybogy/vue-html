<template>
    <div class="drag-module">
        <dl>
            <dt>基础字段</dt>
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
                </draggable>
            </dd>

            <dt>增强字段</dt>
            <dd>
                <draggable
                    :list="category.enhance"
                    :sort="false"
                    ghost-class="ghost"
                    :group="{name: 'widget', pull: 'clone', put: false}">
                    <div class="draggable-type"
                        :class="'type-' + t.type"
                        :key="t.type" 
                        v-for="(t, i) in category.enhance">
                        <a href="javascript:void(0)">{{t.label}}</a>
                    </div>
                </draggable>
            </dd>

            <dt>布局</dt>
            <dd>
                <draggable
                    :list="category.layout"
                    :sort="false"
                    ghost-class="ghost"
                    :move="moveFun"
                    :group="{name: 'widget', pull: 'clone', put: false}">
                     <div class="draggable-type"
                        :class="'type-' + t.type"
                        :key="t.type" 
                        v-for="(t, i) in category.layout">
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
            layout: String
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
                        user.indexOf('form') > -1) {
                        types[t.category].push(t)
                    }
                }

                return types
            }
        },
        methods: {
            moveFun (evt) {
                if (evt.related &&
                    evt.related.className.indexOf('collapses-draggable-wrap') > -1 ||
                    evt.to && evt.to.className.indexOf('collapses-draggable-wrap') > -1) {
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