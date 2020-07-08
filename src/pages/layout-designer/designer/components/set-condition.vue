<template>
    <sapi-popover 
        v-model="visible"
        :width="800"
        title="条件设置"
        :reference="reference"
        @confirm="saveCondition">

		<div class="condition-setting-body">
			<div class="condition-setting-sum-equation">
				<div>
					最终公式<span>*</span></div>
				<div>{{expressionText}}</div>
			</div>
			<div style="height:400px">
				<el-scrollbar class="page-component__scroll" noresize>
					<div style="width: 100%;height:100px;">
						<div style="width: 100%;">
							<div class="condition-setting-equations">
								<div class="condition-setting-equations-title">
									<div>运算符</div>
									<div>条件类型</div>
									<div>条件字段</div>
									<div>运算符</div>
									<div>判断值</div>
									<div>操作</div>
								</div>
								<div v-for="(condition, i) in conditions" :key="i" class="condition-setting-equa">
									<div style="display: flex;">
										<div style="position: relative;">
											<div class="condition-setting-child-logic">
												<select v-if="i !== 0" v-model="condition.logic" class="condition-setting-child-logic-sel">
													<option value="AND">并且</option>
													<option value="OR">或者</option>
												</select>
											</div>
											<div class="condition-line"></div>
										</div>
										<div style="width: calc(100% - 70px);">
											<div class="condition-setting-equa-element">
												<div>
													<el-select
														v-model="condition.type" 
														@change="conditionTypeChange($event, condition)">
														<el-option v-for="item in conditionTypeFilter" :key="item.value" :label="item.label" :value="item.value">
														</el-option>
													</el-select>
												</div>

												<div>
													<el-select
														v-model="condition.prop"
														@change="conditionPropChange($event, condition)">
														<el-option v-for="item in (condition.type === 'field' ? propsOptions : modeOptions)" 
															:key="item.value" :label="item.label" :value="item.value">
														</el-option>
													</el-select>
												</div>

												<div>
													<el-select v-model="condition.operation"
														@change="operationChange($event, condition)">
														<el-option v-for="item in ((condition.valueType === 'int' || condition.valueType === 'float') ? numberOperationOptions: ((condition.valueType === 'text' || condition.valueType === 'textarea') ? stringOperationOptions : operationOptions ))" 
															:key="item.value" :label="item.label" :value="item.value">
														</el-option>
													</el-select>
												</div>

												<div>
													<el-select v-model="condition.value"
														v-if="condition.type === 'formMode'">
														<el-option v-for="item in modeValueOptions" :key="item.value" :label="item.label" :value="item.value">
														</el-option>
													</el-select>
													<el-input :id="`cond_${i}_0`" 
														v-if="condition.type !== 'formMode' && (condition.valueType === 'text' || condition.valueType === 'textarea')" 
														v-model="condition.value" placeholder="请输入内容"></el-input>
													<sapi-number :id="`cond_${i}_0`" 
														v-if="condition.valueType === 'int' || condition.valueType === 'float'" type="int" 
														v-model="condition.value" :min="1" :max="9999999999" placeholder="请输入数字"></sapi-number>
													<el-date-picker :id="`cond_${i}_0`"
														v-if="condition.valueType === 'date'"
														v-model="condition.value"
														value-format="yyyy-MM-dd"
														type="date" placeholder="选择日期" :picker-options="pickerOptions"
														></el-date-picker>
												</div>

												<div class="condition-child-setting-bnt">
													<i class="icon-deleter f-16 color-blue" @click="delCondition(i)"></i>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div class="condition-setting-add-condition" @click="addCondition">+ 新增条件</div>
							</div>
						</div>
					</div>
				</el-scrollbar>
			</div>
		</div>

 	</sapi-popover>
</template>

<script>
	import SapiPopover from './sapi-popover'
	export default {
		components: {
			SapiPopover
		},
		inject: ['ueditor'],
        props: {
			value: {
				type: Boolean,
				required: true
			},
			option: {
				type: Object,
				required: true
			},
			dataModel: {
				type: Array,
				required: true
			},
			// popover弹窗指向的元素对象
			reference: {
				validator: function (el) {
					if (el && el.nodeType === 1) {
						return true
					}
					return false
				},
				required: true
			}
		},
		data() {
			return {
				disabled: false,
				visible: false,
				conditionVisible: true,
				conditions: null,
				conditionTypeOptions: [{
					value: 'field',
					label: '表单字段'
				}, {
					value: 'formMode',
					label: '表单模式'
				}],
                modeOptions: [
                    { value: 'mode', label: '表单类型', valueType: 'text' }
				],
				modeValueOptions: [
					{value: 'Add', label: '表单新增'},
					{value: 'Edit', label: '表单修改'},
					{value: 'Adjust', label: '表单调整'},
                    {value: 'View', label: '表单查看'}
				],
				operationOptions: [{
					value: '==',
					label: '='
				}, {
					value: '>',
					label: '>'
				}, {
					value: '>=',
					label: '≥'
				}, {
					value: '<',
					label: '<'
				}, {
					value: '<=',
					label: '≤'
				}, {
					value: '!=',
					label: '≠'
				}],
				pickerOptions: {
					disabledDate (time) {
						//return time.getTime() > Date.now();
					}
                },
			}
        },
        computed: {
            propsOptions () {
				const rst = []
				this.dataModel.forEach((m) => {
					rst.push({
						value: m.FieldId,
						label: m.FieldName,
						valueType: m.FieldType
					})
				})

				return rst
			},
			expressionText () {
				if (!this.conditions || this.conditions.length === 0) {
					return
				}

				let txt = ''
				this.conditions.forEach((cond, i) => {
					let valTxt = ''
					if (cond.type === 'formMode') {
						const opt = this.modeValueOptions.filter((item) => {
							if (item.value === cond.value) {
								return true
							}

							return false
						})
						valTxt = opt[0].label
					} else {
						valTxt = cond.value || ''
					}
					txt += `${(i > 0 ? ` ${cond.logic === 'AND' ? '并且' : '或者'} ` : '')}${cond.propName}${cond.operationName}${valTxt}`
				})

				return txt
			},
			numberOperationOptions () {
				let opts = this.operationOptions.slice(0)
				opts = opts.concat([
					{ value: 'in', label: '包含于'},
					{ value: 'not in', label: '不包含于'}
				])
				return opts
			},
			stringOperationOptions () {
				let opts = this.operationOptions.slice(0)
				opts = opts.concat([
					{ value: 'in', label: '包含于'},
					{ value: 'not in', label: '不包含于'},
					{ value: 'like', label: '包含' },
					{ value: 'not like', label: '不包含' }
				])
				return opts
            },
            conditionTypeFilter () {
                const newArr = this.conditionTypeOptions.filter(item => {
                    if (!this.isFlowForm) {
                        return true
                    }

                    return item.value === 'field'
                })

                return newArr || []
            }
        },
		watch: {
			visible (val) {
				this.$emit('input', val)
			},
			value: {
				handler (val) {
					this.visible = val;
					if (this.visible) {
						this.open()
					}
				},
				immediate: true
			}
		},
		methods: {
			close() {
				this.$emit('input', false)
			},
			open() {
				this.parseCondition()
            },
            parseCondition () {
                this.vnode = this.option.vnode
                this.conditionProp = this.option.conditionProp

                // 标志是否是流程表单
                this.isFlowForm = false
                this.vnode.layoutType && this.vnode.layoutType === 'flow-form' && (this.isFlowForm = true)

				let conds
				
				if (this.vnode && this.vnode.conditions && 
                    this.vnode.conditions.hasOwnProperty(this.conditionProp)) {
					conds = (this.vnode.conditions[this.conditionProp] || []).slice(0)
				}
				
				if (!conds) {
					conds = []
				}

				// 默认加一条
				if (conds.length === 0) {
					conds.push(this.createNewCondition())
				}

				this.conditions = conds
				// this.conditionsText = this.vnode.attrs[`${this.$utils.camelCase(this.conditionProp)}ExpressionText`]
			},
			createNewCondition () {
				const options = this.propsOptions
				const cond = {
					type: 'field', // field/mode/data 分别表示业务字段、表单模式、绑定字段
					logic: 'AND', // AND/OR 逻辑运算符，向前的逻辑运算符，所以第一项无效
					operation: '==', // 操作符
					operationName: '=', // 操作符
					prop: '', // 条件字段
					propName: '', // 条件名称
					value: null, // 判断值
					valueType: 'text', // 值类型：数字、日期、文本
				}

				// 默认选中第一条选项
				if (options && options.length > 0) {
					cond.prop = options[0].value
					cond.propName = options[0].label
					cond.valueType = options[0].valueType
				}

				return cond
			},
			conditionTypeChange (type, condition) {
				const options = type === 'field' ? this.propsOptions: (type === 'formMode' ? this.modeOptions : this.bindingOptions)
				if (options && options.length > 0) {
					condition.prop = options[0].value
					// 类型不同重置值
					if (condition.valueType !== options[0].valueType) {
						condition.value = null
						condition.valueType = options[0].valueType
					}

					if (type === 'formMode') {
						condition.value = 'Add'
					}
					
					condition.propName = options[0].label
				}
			},
			conditionPropChange (prop, condition) {
				const type = condition.type
				const options = type === 'field' ? this.propsOptions: (type === 'formMode' ? this.modeOptions : this.bindingOptions)
				
				const selectItem = options.filter(function (opt) {
					if (opt.value === prop) {
						return true
					}

					return false
				})

				// 类型不同重置值
				if (condition.valueType !== selectItem[0].valueType) {
					condition.value = null
					condition.valueType = selectItem[0].valueType
				}
				
				condition.propName = selectItem[0].label
			},
			operationChange (oper, condition) {
				this.operationOptions.forEach((opt) => {
					if (opt.value === oper) {
						condition.operationName = opt.label
						return
					}
				})
			},
			addCondition () {
				this.conditions.push(this.createNewCondition())
			},
			getParserExpression () {
				let exp = ''
				this.conditions.forEach((cond, i) => {
					const logicTxt = i > 0 ? (cond.logic === 'AND' ? ' && ' : ' || ') : ''

					// 包含和未包含：只对数字和字符串有效
					if (cond.operation === 'in' || cond.operation === 'not in') {
						let valueTxt
						if (cond.valueType === 'int' || cond.valueType === 'float') {
							valueTxt = `[${(cond.value || '')}]`
						} else {
							valueTxt = `['${(cond.value || '').split(/\s*[,，]\s*/g).join('\', \'')}']`
						}
						exp += `${logicTxt}${valueTxt}.indexOf(${cond.prop}) ${cond.operation === 'in' ? '!==' : '==='} -1`
					} else if (cond.operation === 'like' || cond.operation === 'not like') {
						// 只对字符串有效
						exp += `${logicTxt}(${cond.prop}).indexOf('${cond.value}') ${cond.operation === 'like' ? '!==' : '==='} -1`
					} else {
						exp += `${logicTxt}${cond.type !== 'formMode' ? 'model.' : ''}${cond.prop} ${cond.operation} '${cond.value}'`
					}
				})

				return exp
			},
            saveCondition () {
				if (!this.vnode.conditions) {
					this.vnode.conditions = {}
				}
				this.vnode.conditions[this.conditionProp] = this.conditions.slice(0)
				this.vnode.attrs[`${this.conditionProp}-expression`] = this.getParserExpression()
				this.$emit('input', false)
				this.ueditor.addRecord()
			},
			delCondition (index) {
				this.conditions.splice(index, 1)
			}
		}
	}
</script>

<style lang="less">
	@import '~@/static/css/sapi-variables.less';

	.page-component__scroll {
		height:100%;
		.el-scrollbar__wrap {
			overflow-x: hidden;
		}
	}

	.color-blue {
		color: @--color-primary;
	}

	.condition-setting-body {
    	border-top: 1px solid @--border-color-extra-light;
    	padding: 0px 10px;
	}

	.condition-setting-sum-equation {
		width: 100%;
		height: 40px;
		line-height: 40px;
	}

	.condition-setting-sum-equation>div:nth-child(1) {
		font-size: 13px;
		width: 70px;
		color: #222222;
		font-weight: 600;
	}

	.condition-setting-sum-equation>div:nth-child(1)>span {
		color: red;
	}

	.condition-setting-sum-equation>div:nth-child(2) {
		background: #f7f8f9;
		width: calc(100% - 70px);
		padding: 5px;
		min-height: 30px;
		line-height: 20px;
		margin-top: 5px;
		border-radius: 3px;
		font-size: 13px;
		font-weight: 600;
	}

	.condition-setting-sum-equation>div:nth-child(3) {
		margin: 5px auto auto 10px;
		background: @--color-primary;
		width: 80px;
		text-align: center;
		font-size: 13px;
		color: #ffffff;
		border-radius: 3px;
		height: 30px;
		line-height: 30px;
		cursor: pointer;
	}

	.condition-setting-sum-equation>div {
		float: left;
	}

	.condition-setting-equations {
		margin: 15px auto;
		width: 100%;
		background: #FFFFFF;
	}

	.condition-setting-equations-title {
		width: 100%;
		height: 40px;
		line-height: 40px;
		border: 1px solid #ececec;
		border-radius: 3px;
		box-shadow: -1px 1px 4px 1px #ececec;
		margin-bottom: 10px;
		text-align: center;
		background: #ffffff;
		display:flex;
	}

	.condition-setting-equations-title > div {
		flex: 1;
	}

	.condition-setting-equations-title > div:nth-child(1) {
		width: 70px;
		background: #b5c2ca;
		color: #ffffff;
		font-weight: 600;
		border-radius: 3px 0 0 3px;
		margin-top: -1px;
		font-size: 13px;
		flex:none;
	}
	.condition-setting-equations-title > div:last-child{
		flex:none;
		width: 50px;
	}

	.condition-child-setting-bnt .icon-deleter {
		margin-right: 8px;
		float: right;
		cursor:pointer;
	}

	.condition-setting-equa{
		margin-top: 8px;
	}

	.condition-setting-equa .condition-line {
		background: @--color-primary;
		position: absolute;
		height: 10px;
		width: 2px;
		top: -10px;
		left: 33px;
	}

	.condition-setting-equa-element {
		height: 40px;
		line-height: 40px;
		border: 1px solid #ececec;
		box-shadow: -1px 1px 4px 1px #ececec;
		background: #ffffff;
		border-radius: 3px;
		position: relative;
		display:flex;
		align-items:center;
	}

	.condition-setting-equa-element>div {
		flex: 1;
		padding: 0 3px;
	}

	.condition-setting-equa-element>div:last-child {
		flex:none;
		width: 50px;
		text-align:center;
	}

	.condition-setting-child-logic {
		width: 70px;
		height: 40px;
		line-height: 40px;
		text-align: center;
		background: #ebf0f5;
		font-weight: 600;
		color: #666666;
		font-size: 13px;
		border-radius: 3px 0 0 3px;
		margin-top: -1px;
		border: 1px solid #e6e6e6;
		z-index: 5555548;
	}

	.condition-setting-child-logic .condition-setting-child-logic-sel {
		background: rgba(1, 1, 1, 0);
		border: none;
		width: 49px;
		padding: 0;
		cursor: pointer;
	}

	.condition-setting-child-logic-sel option {
		color: #000000;
	}

	.condition-child-add-bnt {
		/*background-image: url(../images/add-condition.png);*/
		/*width: 16px;
		height: 16px;*/
		position: absolute;
		/*top: 12px;*/
		right: 40px;
		cursor: pointer;
		display: none;
	}

	.condition-setting-equa-element:hover {
		border-color: @--color-primary;
	}

	.condition-setting-equa-element:hover .condition-setting-child-logic {
		background: @--color-primary;
		border-color: @--color-primary;
	}

	.condition-setting-equa-element:hover .condition-setting-child-logic>select {
		color: #FFFFFF;
	}

	.condition-setting-add-condition {
		width: 100%;
		height: 40px;
		line-height: 40px;
		margin-top: 10px;
		text-align: center;
		background: #ffffff;
		color: @--color-primary;
		font-weight: normal;
		border: 1px solid #e2e2e2;
		box-shadow: -2px 2px 3px 1px #ececec;
		border-radius: 3px;
		cursor: pointer;
	}
</style>
