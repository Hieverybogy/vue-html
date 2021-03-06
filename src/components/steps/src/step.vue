<template>
    <div
            class="zs-step"
            :style="[style,  isLast ? '' : { marginRight: - $parent.stepOffset + 'px' }]"
            :class="['is-' + $parent.direction]">
        <div
                ref="step"
                class="zs-step__head"
                :class="['is-' + currentStatus, { 'is-text': !icon }]">
            <div
                    class="zs-step__line"
                    :class="[
                        'is-' + $parent.direction,
                        {
                            'is-icon': icon ,
                            'is-first' : isFirst
                        }
                        ]"
                    v-if="isFirst">
                <i class="zs-step__line-inner" :style="lineStyle"></i>
            </div>
            <div
                    class="zs-step__line"
                    :style="isLast ? '' : { marginRight: $parent.stepOffset + 'px' }"
                    :class="['is-' + $parent.direction, { 'is-icon': icon }]">
                <i class="zs-step__line-inner" :style="lineStyle"></i>
            </div>

            <span class="zs-step__icon">
        <slot
                v-if="currentStatus !== 'success' && currentStatus !== 'error'"
                name="icon">
          <i v-if="icon" :class="['zs-icon-' + icon]"></i>
          <div v-else>{{ index + 1 }}</div>
        </slot>
        <i
                v-else
                :class="['zs-icon-' + (currentStatus === 'success' ? 'check' : 'close')]">
        </i>
      </span>
        </div>
        <div
                class="zs-step__main"
                :style="{ marginLeft: mainOffset }">
            <div
                    class="zs-step__title"
                    ref="title"
                    :class="['is-' + currentStatus]">
                <slot name="title">{{ title }}</slot>
            </div>
            <div
                    class="zs-step__description"
                    :class="['is-' + currentStatus]">
                <slot name="description">{{ description }}</slot>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name : 'ZsStep',

        props : {
            title : String,
            icon : String,
            description : String,
            status : {
                type : String,
                default : 'wait'
            }
        },

        data() {
            return {
                index : -1,
                style : {},
                lineStyle : {},
                mainOffset : 0,
                isLast : false,
                isFirst : false,
                currentStatus : this.status
            };
        },

        beforeCreate() {
            this.$parent.steps.push(this);
        },

        methods : {
            updateStatus(val) {
                const prevChild = this.$parent.$children[this.index];
                if (val > this.index) {
                    this.currentStatus = this.$parent.finishStatus;
                } else if (val === this.index) {
                    this.currentStatus = this.$parent.processStatus;
                } else {
                    this.currentStatus = 'wait';
                }

                if (prevChild) prevChild.calcProgress(this.currentStatus);
            },

            calcProgress(status) {
                let step = 100;
                const style = {};

//                style.transitionDelay = 150 * this.index + 'ms';
                if (status === this.$parent.processStatus) {
                    step = 50;
                } else if (status === 'wait') {
                    step = 0;
//                    style.transitionDelay = (-150 * this.index) + 'ms';
                }
                this.$parent.direction === 'vertical'
                    ? style.height = step + '%'
                    : style.width = step + '%';

                this.lineStyle = style;
            },

            adjustPosition() {
                this.style = {};
                this.$parent.stepOffset = this.$el.getBoundingClientRect().width / (this.$parent.steps.length - 1);
            }
        },

        mounted() {
            const parent = this.$parent;
            const isCenter = parent.center;
            const len = parent.steps.length;
            const isLast = this.isLast = parent.steps[parent.steps.length - 1] === this;
            const isFirst = this.isFirst = parent.steps[0] === this;
            const space = typeof parent.space === 'number'
                ? parent.space + 'px'
                : parent.space
                    ? parent.space
                    : 100 / (isCenter ? len - 1 : len) + '%';

            if (parent.direction === 'horizontal') {
                this.style = {width : space};
                if (parent.alignCenter) {
                    this.mainOffset = -this.$refs.title.getBoundingClientRect().width / 2 + 16 + 'px';
                }
                isCenter && isLast && this.adjustPosition();
            } else {
                if (!isLast) {
                    this.style = {height : space};
                }
            }

            const unwatch = this.$watch('index', val =>{
                this.$watch('$parent.active', this.updateStatus, {immediate : true});
                unwatch();
            });
        }
    };
</script>
