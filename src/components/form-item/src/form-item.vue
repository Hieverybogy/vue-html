<template>
    <div class="zs-form-item clr" :class="[{
        'is-error': validateState === 'error',
        'is-validating': validateState === 'validating',
        'is-required': isRequired || required
      }]">
        <label :for="prop" class="zs-form-item__label" :style="labelStyle" v-if="label">
            {{label + form.labelSuffix}}
        </label>
        <div class="zs-form-item__content" :style="contentStyle">
            <slot></slot>
            <transition name="zs-zoom-in-top" v-if="!errorTarget">
                <div class="zs-form-item__error" v-if="validateState === 'error' && showMessage && form.showMessage">
                    {{validateMessage}}
                </div>
            </transition>
        </div>
    </div>
</template>
<script>
    import AsyncValidator from 'async-validator';
    import emitter from '../../src/utils/emitter';

    function noop(){
    }

    function getPropByPath(obj, path){
        let tempObj = obj;
        path = path.replace(/\[(\w+)\]/g, '.$1');
        path = path.replace(/^\./, '');

        let keyArr = path.split('.');
        let i = 0;

        for (let len = keyArr.length; i < len - 1; ++i) {
            let key = keyArr[i];
            if (key in tempObj) {
                tempObj = tempObj[key];
            } else {
                throw new Error('please transfer a valid prop path to form item!');
            }
        }
        return {
            o : tempObj,
            k : keyArr[i],
            v : tempObj[keyArr[i]]
        };
    }

    export default {
        name : 'ZsFormItem',

        componentName : 'ZsFormItem',

        mixins : [emitter],

        props : {
            label : String,
            labelWidth : String,
            prop : String,
            required : Boolean,
            rules : [Object, Array],
            error : String,
            validateStatus : String,
            showMessage : {
                type : Boolean,
                default : true
            },
            errorTarget : String
        },
        watch : {
            error(value) {
                this.validateMessage = value;
                this.validateState = value ? 'error' : '';
            },
            validateStatus(value) {
                this.validateState = value;
            },
            validateMessage(value){
                if (!this.errorTarget) return;
                let target = document.getElementById(this.errorTarget);
                target.style.position = "relative";
                if (this.validateState === 'error' && this.showMessage && this.form.showMessage) {
                    let errorBlock = document.createElement('div');
                    errorBlock.className = "zs-form-item__error";
                    errorBlock.style.position = "static";
                    errorBlock.innerHTML = value;
                    target.innerHTML = errorBlock.outerHTML;
                } else {
                    target.innerHTML = '';
                }
            }
        },
        computed : {
            labelStyle() {
                var ret = {};
                if (this.form.labelPosition === 'top') return ret;
                var labelWidth = this.labelWidth || this.form.labelWidth;
                if (labelWidth) {
                    ret.width = labelWidth;
                }
                return ret;
            },
            contentStyle() {
                let ret = {};
                const labelWidth = this.labelWidth || this.form.labelWidth;
                const form = this.form;
                if (form.labelPosition === 'top' || form.inline) return ret;
                if (labelWidth) ret.marginLeft = labelWidth;
                return ret;
            },
            form() {
                var parent = this.$parent;
                while (parent.$options.componentName !== 'ZsForm') {
                    parent = parent.$parent;
                }
                return parent;
            },
            fieldValue : {
                cache : false,
                get() {
                    var model = this.form.model;
                    if (!model || !this.prop) return;

                    var path = this.prop;
                    if (path.indexOf(':') !== -1) {
                        path = path.replace(/:/, '.');
                    }
                    return getPropByPath(model, path).v;
                }
            }
        },
        data() {
            return {
                validateState : '',
                validateMessage : '',
                validateDisabled : false,
                validator : {},
                isRequired : false
            };
        },
        methods : {
            validate(trigger, callback = noop) {

                var rules = this.getFilteredRule(trigger);
                if (!rules || rules.length === 0) {
                    callback();
                    return true;
                }

                this.validateState = 'validating';

                var descriptor = {};
                descriptor[this.prop] = rules;

                var validator = new AsyncValidator(descriptor);
                var model = {};

                model[this.prop] = this.fieldValue;
                validator.validate(model, {firstFields : true}, (errors, fields) =>{
                    this.validateState = !errors ? 'success' : 'error';
                    this.validateMessage = errors ? errors[0].message : '';

                    callback(this.validateMessage);
                });
            },
            resetField() {
                this.validateState = '';
                this.validateMessage = '';
                let model = this.form.model;
                let value = this.fieldValue;
                let path = this.prop;
                if (path.indexOf(':') !== -1) {
                    path = path.replace(/:/, '.');
                }

                let prop = getPropByPath(model, path);

                if (Array.isArray(value) && value.length > 0) {
                    this.validateDisabled = true;
                    prop.o[prop.k] = [];
                } else if (value) {
                    this.validateDisabled = true;
//                    prop.o[prop.k] = this.initialValue;
                }
            },
            getRules() {
                var formRules = this.form.rules;
                var selfRuels = this.rules;

                formRules = formRules ? formRules[this.prop] : [];

                return [].concat(selfRuels || formRules || []);
            },
            getFilteredRule(trigger) {
                var rules = this.getRules();

                return rules.filter(rule =>{
                    return !rule.trigger || rule.trigger.indexOf(trigger) !== -1;
                });
            },
            onFieldBlur() {
                this.validate('blur');
            },
            onFieldInput(){
                this.validate('input');
            },
            onFieldChange(val) {
                if (this.validateDisabled) {
                    this.validateDisabled = false;
                    return;
                }
                this.validate('change');
            }
        },
        mounted() {
            if (this.prop) {
                this.dispatch('ZsForm', 'el.form.addField', [this]);

                Object.defineProperty(this, 'initialValue', {
                    value : this.fieldValue
                });

                let rules = this.getRules();

                if (rules.length) {
                    rules.every(rule =>{
                        if (rule.required) {
                            this.isRequired = true;
                            return false;
                        }
                    });
                    this.$on('el.form.blur', this.onFieldBlur);
                    this.$on('el.form.change', this.onFieldChange);
                    this.$on('el.form.input', this.onFieldInput);
                }
            }
        },
        beforeDestroy() {
            this.dispatch('ZsForm', 'el.form.removeField', [this]);
        }
    };
</script>
