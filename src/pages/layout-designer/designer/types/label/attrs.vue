<template>
    <div class="drag-option">
        <div class="item">
            <div class="title">是否使用绑定字段</div>
            <div class="value">
                <el-checkbox v-model="isBindFieldId" @change="addRecord">绑定字段</el-checkbox>
            </div>
        </div>
        <div v-if="!vnode.isNoNeedFieldId">
            <div v-if="!inTableColumn" class="item">
                <div class="title">绑定字段</div>
                <div class="value" v-if="inListLayout">
                    <el-input v-model="vnode.fieldId" @change="addRecord"></el-input>
                </div>
                <div class="value" v-else>
                    <el-select v-model="vnode.fieldId" @change="setChild">
                        <!-- :disabled="field.MarkCount > 0" -->
                        <el-option
                            v-for="(field,index) in dataModel"
                            :key="index"
                            :label="field.FieldName"
                            :value="field.FieldId"
                        ></el-option>
                    </el-select>
                </div>
            </div>
            <div v-if="!inTableColumn && !inListLayout && subDataModelVisible" class="item">
                <div class="title">绑定子字段</div>
                <div class="value">
                    <el-select v-model="vnode.subFieldId" @change="subChangeOther">
                        <el-option
                            v-for="(field, index) in subDataModel"
                            :key="index"
                            :label="field.FieldName"
                            :value="field.FieldId"
                        ></el-option>
                    </el-select>
                </div>
            </div>
        </div>

        <div v-if="!inTableColumn && !vnode.isInTable" class="item" ref="displayTitle">
            <div class="title">显示标题 <i v-if="!vnode.isInTable" class="icon-edit sapi-code-icon" title="编辑代码" @click="showPopover('displayTitle', 'sapi-form-item', 'label')"></i></div>
            <div class="value">
                <el-input v-model="vnode.label" @change="addRecord"></el-input>
            </div>
        </div>

        <div class="item" v-if="vnode.isInTable">
            <div class="title">对齐方式</div>
            <div class="value">
                <el-radio-group v-model="vnode.attrs.align" @change="addRecord">
                    <div style="margin: 4px 0">
                        <el-radio label="left">left</el-radio>
                    </div>
                    <div style="margin: 4px 0">
                        <el-radio label="center">center</el-radio>
                    </div>
                    <div style="margin: 4px 0">
                        <el-radio label="right">right</el-radio>
                    </div>
                </el-radio-group>
            </div>
        </div>
        <div class="item" v-if="vnode.isInTable">
            <div class="title">展示方式</div>
            <div class="value">
                <el-radio-group v-model="vnode.attrs.type" @change="addRecord">
                    <el-radio :label="1">默认</el-radio>
                    <el-radio :label="2">标题</el-radio>
                </el-radio-group>
            </div>
        </div>

        <div class="item" v-if="!vnode.isNoNeedFieldId">
            <div class="title">默认值</div>
            <div class="value">
                <el-input v-model="vnode.attrs.defaultVal" @change="addRecord"></el-input>
            </div>
        </div>

        <div class="item" v-if="!vnode.isNoNeedFieldId">
            <div class="title">控件类型</div>
            <div class="value">
                <el-select v-model="vnode.attrs.controlType" @change="addRecord">
                    <el-option label="常规" value=""></el-option>
                    <el-option label="整数" :value="1"></el-option>
                    <el-option label="小数" :value="2"></el-option>
                </el-select>
            </div>
        </div>

        <template v-if="!vnode.isNoNeedFieldId && (vnode.attrs.controlType === 1 || vnode.attrs.controlType === 2)">
            <div class="item">
                <div class="title">格式</div>
                <div class="value">
                    <el-select v-model="vnode.attrs.format" @change="addRecord">
                        <el-option label="常规" value="normal"></el-option>
                        <el-option label="会计格式" value="thousand"></el-option>
                    </el-select>
                </div>
            </div>
            <div class="item" v-if="vnode.attrs.controlType === 2">
                <div class="title">小数位数</div>
                <div class="value">
                    <el-input v-model="vnode.attrs.place" @change="addRecord"></el-input>
                </div>
            </div>
            <div class="item">
                <div class="title">单位</div>
                <div class="value">
                    <el-input v-model="vnode.attrs.unit" @change="addRecord"></el-input>
                </div>
            </div>
        </template>

        <template v-if="!vnode.isNoNeedFieldId && !vnode.attrs.controlType">
            <div class="item">
                <div class="title">数据匹配</div>
                <el-radio-group v-model="vnode.attrs.useMatch" @change="matchChange">
                    <div class="value">
                        <el-radio label="none">不启用</el-radio>
                    </div>
                    <div class="value">
                        <el-radio label="dataSource">匹配数据源</el-radio>
                    </div>
                </el-radio-group>
            </div>
            <div class="item" v-if="vnode.attrs.useMatch === 'dataSource'">
                <div class="title must-star">匹配数据源</div>
                <div class="value" ref="matchOptions">
                    <el-button size="small" @click="addResource">添加</el-button>
                </div>
            </div>
        </template>

        <div class="item" v-if="!inListLayout">
            <div class="title" ref="conditionTitle">显示条件 <i v-if="!vnode.isInTable" class="icon-edit sapi-code-icon" title="编辑代码" @click="showPopover('conditionTitle', 'sapi-form-item', 'v-if')"></i></div>
            <div class="value" ref="conditionBtn">
                <el-button @click="setCondition('conditionBtn', 'v-if')" size="small" style="width:100%">设置条件</el-button>
            </div>
        </div>

        <div v-transfer-dom>
            <component :is="view" 
                v-model="settingVisible"
                :option="currentOption" 
                @callback="callback"></component>
        </div>
    </div>
</template>

<script>
import typeMixin from "../type-mixin.js";
export default {
    mixins: [typeMixin],
    components: {
        'set-options': () => import('../../components/set-options.vue')
    },
    data() {
        return {
            isBindFieldId: false,
            currentOption: null,
            view: '',
            settingVisible: false
        };
    },
    watch: {
        isBindFieldId(val) {
            this.vnode.isNoNeedFieldId = !val;
            if (!val) {
                this.vnode.attrs.controlType = ''
                this.vnode.attrs.format = 'normal'
                this.vnode.attrs.place = ''
                this.vnode.attrs.unit = ''
                this.vnode.attrs.defaultVal = ''
            }
        },
        "vnode.isNoNeedFieldId"(val) {
            this.isBindFieldId = !val
            // 使用绑定字段
            if (!val) {
                this.vnode.attrs.value = ""
                this.vnode.attrs.key = `${this.vnode.fieldId || ''}${this.vnode.subFieldId ? '.' + this.vnode.subFieldId : ''}`
                this.vnode.attrs.controlType = ''
            } else { // 不使用绑定字段
                this.vnode.attrs.key = ''
                this.vnode.fieldId = ''
                this.vnode.subFieldId = ''
            }
        },
        "vnode.fieldId"(val) {
            this.vnode.attrs.key = `${this.vnode.fieldId}${this.vnode.subFieldId ? '.' + this.vnode.subFieldId : ''}`
        },
        "vnode.subFieldId"(val) {
            this.vnode.attrs.key = `${this.vnode.fieldId}${this.vnode.subFieldId ? '.' + this.vnode.subFieldId : ''}`
        },
        "vnode.attrs.value"(val) {
            if (!this.vnode.isNoNeedFieldId) {
                setTimeout(() => {
                    this.vnode.attrs.value = "";
                });
            }
        },
        "vnode.attrs.controlType"(val) {
            if (val === '') {
                this.vnode.attrs.format = 'normal'
                this.vnode.attrs.place = ''
                this.vnode.attrs.unit = ''
            } else if (val === 1) {
                this.vnode.attrs.place = ''
            }
        }
    },
    methods: {
        setChild (id) {
            this.change(id);
            this.vnode.attrs.txt = ''
            if (!this.subDataModelVisible) {
                let data = this.dataModel.find(field => {
                    return field.FieldId === id;
                });
                this.vnode.attrs.txt = data.FieldName || '';
            }
        },
        subChangeOther (id) {
            this.subChange(id);

            let data = this.dataModel.find(field => {
                return field.FieldId === id;
            });
            this.vnode.attrs.txt = data.FieldName || '';
        },
        addResource () {
            this.currentOption = this.vnode.attrs.matchOptions || []
            this.view = 'set-options'
            this.settingVisible = true
        },
        callback (data) {
            this.settingVisible = false
            this.vnode.attrs.matchOptions = data
            this.doChange()
        },
        matchChange () {
            this.addRecord()
            this.doChange()
        },
        doChange () {
            this.$root.$emit('validate-preview-field', this.vnode)
        }
    },
    created() {
        this.isBindFieldId = !this.vnode.isNoNeedFieldId
    }
};
</script>
