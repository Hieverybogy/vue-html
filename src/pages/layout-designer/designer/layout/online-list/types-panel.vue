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
                </draggable>
            </dd>
        </dl>
        <dl>
            <dt>更多筛选</dt>
            <dd>
                <draggable
                    :list="category.moreFilters"
                    :sort="false"
                    ghost-class="ghost"
                    chosen-class="chosen"
                    :move="moveMoreFilters"
                    :group="{name: 'widget', pull: 'clone', put: false}">
                    <div class="draggable-type"
                        :class="'type-' + t.type"
                        :key="t.type"
                        v-for="(t, i) in category.moreFilters">
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
                    enhance: [],
                    moreFilters: []
                }

                for (let type in Types) {
                    const t = Types[type]
                    let user = t.user
                    if (user && types.hasOwnProperty(t.category) &&
                        user.indexOf('online-list') > -1) {
                        if (t.category === 'moreFilters') {
                            types['moreFilters'].push(t)
                        } else {
                            types['base'].push(t)
                        }
                    }
                }

                function compare(item1, item2){
                    return item1.index > item2.index ? 1 : -1
                }

                types.layout.sort(compare)
                types.base.sort(compare)
                types.enhance.sort(compare)
                types.moreFilters.sort(compare)
                console.log(types)
                return types
            }
        },
        methods: {
            moveMoreFilters (evt) {
                console.log(evt, 'moveMoreFilters')
                if (evt.to &&
                    evt.to.className.indexOf('sapi-list-morefilters-fields-warp') > -1) {
                    return true
                }
                
                return false
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