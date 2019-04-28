<template>
    <div class="zs-input" :class="[
        customClass,
        type === 'textarea' ? 'zs-textarea' : '',
        size ? 'zs-input__' + size : '',
        {
          'is-disabled': disabled,
          'is-search' : icon === 'search',
          'zs-input-group': $slots.prepend || $slots.append,
          'zs-input-group-append': $slots.append,
          'zs-input-group-prepend': $slots.prepend,
        }
      ]">
        <template v-if="type !== 'textarea'">
            <!-- 前置元素 -->
            <div class="zs-input-group__prepend" v-if="$slots.prepend">
                <slot name="prepend"></slot>
            </div>
            <!-- 前置图标 -->
            <slot name="preIcon">
                <i class="zs-input__icon zs-input__icon-prev"
                   :class="['zs-icon-' + preIcon]"
                   v-if="preIcon">
                </i>
            </slot>
            <input
                    class="zs-input__inner"
                    :class="[{'is-focus':showFocusClass}]"
                    :id="id"
                    ref="input"
                    :type="type"
                    :name="name"
                    :placeholder="placeholder"
                    :disabled="disabled"
                    :readonly="readonly"
                    :maxlength="maxlength"
                    :minlength="minlength"
                    :autofocus="autofocus"
                    :min="min"
                    :max="max"
                    :step="step"
                    :value="currentValue"
                    @input="handleInput"
                    @focus="handleFocus"
                    @blur="handleBlur"
                    @keydown.enter="handleEnter"
                    @keydown="handleKeyDown"
            >
            <!--后置图标-->
            <slot name="icon">
                <i class="zs-input__icon"
                   :class="['zs-icon-' + icon,onIconClick ? 'is-clickable' : '']"
                   v-if="icon"
                   v-show="showReset"
                   @click="handleIconClick">
                </i>
            </slot>
            <!-- 后置元素 -->
            <div class="zs-input-group__append" v-if="$slots.append" @click="handleAppendClick">
                <slot name="append"></slot>
            </div>
        </template>
        <template v-else>
            <textarea
                    class="zs-textarea__inner"
                    ref="textarea"
                    :style="textareaStyle"
                    :value="currentValue"
                    :name="name"
                    :placeholder="placeholder"
                    :disabled="disabled"
                    :readonly="readonly"
                    :rows="rows"
                    :autofocus="autofocus"
                    :maxlength="maxlength"
                    :minlength="minlength"
                    @input="handleInput"
                    @focus="handleFocus"
                    @blur="handleBlur">
            </textarea>
            <span class="count" v-if="maxlength && count">{{ `${currentValue.length}/${maxlength}` }}</span>
        </template>
    </div>
</template>
<script>
    import calcTextareaHeight from './calcTextareaHeight';
    import merge from '../../src/utils/merge';
    import emitter from '../../src/utils/emitter';

    export default {
        name: 'zsInput',
        mixins: [emitter],
        data() {
            return {
                currentValue: this.value,
                textareaCalcStyle: {},
                showReset: true,
                isInputFocus: false
            };
        },
        props: {
            id: '',
            customClass: '',
            size: '',
            value: {
                type: [String, Number],
                defautl: ''
            },
            placeholder: String,
            readonly: Boolean,
            autofocus: Boolean,
            icon: String,
            preIcon: String,
            disabled: Boolean,
            type: {
                type: String,
                default: 'text'
            },
            name: String,
            maxlength: Number,
            minlength: Number,
            count: Boolean,
            max: {},
            min: {},
            step: {},
            onIconClick: Function,
            autosize: {
                type: [Boolean, Object],
                default: false
            },
            resize: String,
            rows: {
                type: Number,
                default: 2
            },
            validateEvent: {
                type: Boolean,
                default: true
            }
        },
        computed: {
            textareaStyle() {
                return merge({}, this.textareaCalcStyle, {resize: this.resize});
            },
            showFocusClass() {
                return this.icon === 'search' &&
                    (this.isInputFocus || (this.currentValue && this.currentValue.length > 0));
            }
        },
        watch: {
            value(val, oldVal) {
                if (val === oldVal) return;
                this.currentValue = val;
            },
            currentValue(value) {
                if (this.icon === 'circle-cross') {
                    this.isInputFocus && value.length > 0 && (this.showReset = true);
                    (!this.isInputFocus || value.length === 0) && (this.showReset = false);
                }
            }
        },
        methods: {
            handleKeyDown(e) {
                this.$emit('keydown', e);
                if (e.keyCode == 13) {
                    this.$emit('enter', e);
                }
            },
            handleEnter() {
                this.icon === 'search' && this.handleIconClick();
            },
            handleBlur(event) {
                this.$emit('blur', event);
                this.isInputFocus = false;
                if (this.validateEvent) {
                    this.dispatch('ZsFormItem', 'el.form.blur', [this.currentValue]);
                }
                if (this.icon != 'circle-cross') return;
                setTimeout(() => {
                    this.showReset = false;
                }, 150);
            },
            handleFocus(event) {
                this.$emit('focus', event);
                this.isInputFocus = true;
                if (this.icon != 'circle-cross') return;
                this.currentValue && this.currentValue.length > 0 && (this.showReset = true);

            },
            handleInput(event) {
                const value = event.target.value;

                this.$emit('input', value, event);
                this.$emit('change', value, event);
                this.setCurrentValue(value);
                if (this.validateEvent) {
                    this.dispatch('ZsFormItem', 'el.form.input', [this.currentValue]);
                }
            },
            handleIconClick(event) {
                if (this.onIconClick) {
                    this.onIconClick(event);
                }

                this.$emit('on-icon-click', this.currentValue, () => {
                    this.currentValue = '';
                });
                if (this.icon === 'circle-cross') {
                    this.$emit('input', '');
                }

            },
            resizeTextarea() {
                if (this.$isServer) return;
                var {autosize, type} = this;
                if (!autosize || type !== 'textarea') return;
                const minRows = autosize.minRows;
                const maxRows = autosize.maxRows;

                this.textareaCalcStyle = calcTextareaHeight(this.$refs.textarea, minRows, maxRows);
            },
            setCurrentValue(value) {
                if (value === this.currentValue) return;
                this.$nextTick(_ => {
                    this.resizeTextarea();
                });
                this.currentValue = value;
                if (this.validateEvent) {
                    this.dispatch('ZsFormItem', 'el.form.change', [value]);
                }
            },
            handleAppendClick() {
                this.$emit('append-click');
            }
        },
        created() {
            this.icon === 'circle-cross' && (this.showReset = false);
        },
        mounted() {
            this.resizeTextarea();
        }
    };
</script>
