<template>
    <span class="zs-breadcrumb__item">
        <span class="zs-breadcrumb__item-inner" ref="link">
            <slot></slot>
        </span>
        <span class="zs-breadcrumb__separator" v-html="separator"></span>
    </span>
</template>
<script>
    export default {
        name : 'ZsBreadcrumbItem',
        props : {
            to : {},
            replace : Boolean
        },
        data() {
            return {
                separator : ''
            };
        },
        mounted() {
            this.separator = this.$parent.separator;
            var self = this;
            if (this.to) {
                let link = this.$refs.link;
                link.addEventListener('click', _ =>{
                    window.location = this.to;
                });
            }
        }
    };
</script>
