<template>
    <div class="drag-option" @click.stop>
        <template v-if="!curColum || !curColum.openMenu">
            <div v-if="!inTableColumn" class="item">
                <div class="title must-star">绑定字段</div>
                <div class="value">
                    <el-select v-model="vnode.fieldId" @change="setChild">
                        <el-option
                            :disabled="field.Relationship === 1 || field.Children.length === 0"
                            v-for="(field,index) in dataModel"
                            :key="index"
                            :label="field.FieldName"
                            :value="field.FieldId"
                        ></el-option>
                    </el-select>
                </div>
            </div>
            <div v-if="!inTableColumn && !inListLayout && subDataModelVisible" class="item">
                <div class="title must-star">绑定子字段</div>
                <div class="value">
                    <el-select v-model="vnode.subFieldId" @change="subChangeOther">
                        <el-option
                            :disabled="field.Children.length === 0"
                            v-for="(field, index) in subDataModel"
                            :key="index"
                            :label="field.FieldName"
                            :value="field.FieldId"
                        ></el-option>
                    </el-select>
                </div>
            </div>
            <div v-if="!inTableColumn && !vnode.isInTable" class="item" ref="displayTitle">
                <div class="title">显示标题 <i v-if="!vnode.isInTable" class="icon-edit sapi-code-icon" title="编辑代码" @click="showPopover('displayTitle', 'sapi-form-item', 'label')"></i></div>
                <div class="value">
                    <el-input v-model="vnode.label" @change="addRecord"></el-input>
                </div>
            </div>
            <div class="item">
                <div class="title">表格外层边框显示方式</div>
                <div class="value">
                    <el-select v-model="vnode.attrs.frame" @change="addRecord">
                        <el-option
                            v-for="(item, index) in frameOption"
                            :key="index"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </div>
            </div>
            <div class="item">
                <div class="title">单元格边框显示方式</div>
                <div class="value">
                    <el-select v-model="vnode.attrs.rules" @change="addRecord">
                        <el-option
                            v-for="(item, index) in rulesOption"
                            :key="index"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </div>
            </div>
        </template>
        <template v-else>
            <div class="item">
                <div class="title">宽度：</div>
                <div class="value">
                    <el-input v-model="curColum.width" @change="addRecord"></el-input>
                </div>
            </div>
            <div class="item">
                <div class="title">绑定字段：</div>
                <div class="value">
                    <el-select size="mini" @change="keyChange" v-model="curColum.key">
                        <el-option
                            :disabled="handleKeyDisabled(item.FieldId)"
                            v-for="(item,index) in vnode.columns"
                            :key="index"
                            :label="item.FieldName"
                            :value="item.FieldId"
                        ></el-option>
                    </el-select>
                </div>
            </div>

            <div class="item inline-block" v-if="curColum._key === 'title'">
                <div class="title">是否链接</div>
                <div class="value">
                    <el-checkbox v-model="curColum.isLink"></el-checkbox>
                </div>
            </div>

            <div class="item" v-if="curColum.isLink">
                <div class="title">链接类型</div>
                <div class="value linkRadio">
                    <el-radio-group v-model="curColum.linkType">
                        <el-radio label="normal">默认</el-radio>
                        <el-radio label="link">指定链接</el-radio>
                        <el-radio label="method">匹配方法</el-radio>
                    </el-radio-group>
                </div>
            </div>

            <div class="item" v-if="curColum.isLink && curColum.linkType === 'link'">
                <div class="title must-star">链接全路径</div>
                <div class="value" ref="linkPath">
                    <el-input v-model="curColum.linkPath"></el-input>
                </div>
            </div>

            <div class="item" v-if="curColum.isLink && curColum.linkType === 'method'">
                <div class="title must-star">匹配方法</div>
                <div class="value">
                    <el-select v-model="curColum.linkMethod">
                        <el-option
                            v-for="(item, index) in methodsOption"
                            :key="index"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </div>
            </div>

            <div class="item" v-if="curColum._key !== 'time' && curColum._key !== 'size'">
                <div class="title">数据匹配</div>
                <el-radio-group v-model="curColum.useMatch">
                    <div class="value">
                        <el-radio label="none">不启用</el-radio>
                    </div>
                    <div class="value">
                        <el-radio label="dataSource">匹配数据源</el-radio>
                    </div>
                </el-radio-group>
            </div>
            <div class="item" v-if="curColum.useMatch === 'dataSource'">
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

        <div v-transfer-dom @click.stop>
            <component
                :is="view"
                v-model="settingVisible"
                :option="currentOption"
                @callback="callback"
            ></component>
        </div>
    </div>
</template>

<script>
import typeMixin from "../type-mixin.js";
export default {
    inject: ["ueditor"],
    mixins: [typeMixin],
    components: {
        "set-options": () => import("../../components/set-options.vue")
    },
    data() {
        return {
            frameOption: [
                { value: "border", label: "显示四周的边框线" },
                { value: "void", label: "不显示任何边框" },
                { value: "above", label: "只显示上边框" },
                { value: "below", label: "只显示下边框" },
                { value: "vsides", label: "只显示左、右边框" },
                { value: "hsides", label: "只显示上、下边框" },
                { value: "lhs", label: "只显示左边框" },
                { value: "rhs", label: "只显示右边框" }
            ],
            rulesOption: [
                { value: "all", label: "显示所有单元格边框线" },
                { value: "none", label: "不显示单元格边框" },
                { value: "cols", label: "只显示纵向边框线" },
                { value: "rows", label: "只显示横向边框线" }
            ],

            curColum: null,
            choIndex: null,

            currentOption: null,
            view: "",
            settingVisible: false,

            methodsOption: []
        };
    },
    watch: {
        curColum: {
            handler(val) {
                if (this.choIndex) {
                    this.vnode.attrs.dataForm[this.choIndex] = { ...val };
                }
            },
            deep: true
        },
        "ueditor.bindingMixinCodeProps": {
            handler(val) {
                this.methodsOption = [];
                let _val = val.methods;
                for (let x in _val) {
                    this.methodsOption.push({
                        value: x,
                        label: val[x]
                    });
                }
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        setChild(id) {
            let field = this.dataModel.find(field => field.FieldId === id);

            this.change(id);
            if (field.Relationship === 1) {
                this.vnode.columns = [];
            } else if (field) {
                this.vnode.columns = field.Children;
            }

            this.vnode.attrs.dataForm.forEach(o1 => {
                o1.key = "";
            });
        },
        subChangeOther(id) {
            let data = this.subDataModel.find(field => {
                return field.FieldId === id;
            });
            this.subChange(id);
            this.vnode.columns = data.Children || [];

            this.vnode.attrs.dataForm.forEach(o1 => {
                o1.key = "";
            });
        },
        keyChange() {
            let data = this.vnode.columns.find(field => {
                return field.FieldId === this.curColum.key;
            });

            this.curColum.txt = data.FieldName;

            this.addRecord();
            this.doChange();
        },
        handleKeyDisabled(FieldId) {
            let obj = this.vnode.attrs.dataForm.find(o1 => {
                return o1.key === FieldId;
            });
            if (obj) {
                return true;
            }
            return false;
        },
        setColums(o1) {
            this.curColum = o1;
        },
        addResource() {
            this.currentOption = this.curColum.matchOptions || [];
            this.view = "set-options";
            this.settingVisible = true;
        },
        callback(data) {
            this.settingVisible = false;
            this.curColum.matchOptions = data;
            this.doChange();
        },
        doChange() {
            this.$root.$emit("validate-preview-field", this.vnode);
        }
    },
    created() {
        this.$root.$on("file-list-set-colums", this.setColums);
    },
    beforeDestroy() {
        this.$root.$off("file-list-set-colums", this.setColums);
    }
};
</script>
<style lang="less">
.input-number-other {
    width: 140px;
    display: block;
    // margin: 0 auto;
    .el-input__inner {
        text-align: center;
    }
}
.col-style {
    margin-bottom: 8px;
    .col-num {
        font-size: 12px;
        font-weight: bold;
    }
    .col-item {
        display: flex;
        .le {
            font-size: 12px;
            min-width: 60px;
        }
        .ri {
            flex: 1;
        }
    }
}
.linkRadio {
    .el-radio {
        display: block;
        margin: 5px 0;
    }
}
</style>
