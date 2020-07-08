<template>
    <sapi-drawer class="code-drawer" v-bind="$attrs" v-on="$listeners" @opened="onOpen">
      <div style="height:100%">
        <el-row style="height:100%;overflow:auto">
          <el-col :span="12" class="left-editor">
            <el-tabs v-model="activeTab" type="card">
              <el-tab-pane name="Add">
                <span slot="label">
                  <i class="el-icon-document" />
                  新增(只读)
                </span>
              </el-tab-pane>
              <el-tab-pane name="Edit">
                <span slot="label">
                  <i class="el-icon-document" />
                  修改(只读)
                </span>
              </el-tab-pane>
              <el-tab-pane v-if="isFlowEnabled" name="Adjust">
                <span slot="label">
                  <i class="el-icon-document" />
                  调整(只读)
                </span>
              </el-tab-pane>
              <el-tab-pane name="View">
                <span slot="label">
                  <i class="el-icon-document" />
                  查看(只读)
                </span>
              </el-tab-pane>
            </el-tabs>

            <base-code-editor class="tab-editor"
                :value="templateCode"
                :automatic-layout="true"
                language="html"
                beautifier="html"
                readonly></base-code-editor>
          </el-col>
          <el-col :span="12" class="right-editor">
            <div class="action-bar">
              <el-button size="mini" type="primary"
                @click="save(false)">保存</el-button>
              <el-button size="mini" type="primary"
                @click="save(true)">保存并关闭</el-button>
              <el-button size="mini"
                @click="$emit('update:visible', false)">关闭</el-button>
            </div>

            <el-tabs type="card" value="mixin">
              <el-tab-pane name="mixin">
                <span slot="label">
                  <i class="el-icon-document" />
                  mixin(可编辑)
                </span>
              </el-tab-pane>
            </el-tabs>

            <base-code-editor ref="mixinCode" class="tab-editor"
                :value="mixinCode"
                :automatic-layout="true"
                beautifier="js"
                language="javascript"></base-code-editor>
          </el-col>
        </el-row>
      </div>
    </sapi-drawer>
</template>

<script>
import SapiDrawer from '@/components/sapi-drawer'
import BaseCodeEditor from '../../components/base-code-editor'
import { parse } from '@babel/parser'

export default {
    inject: ['ueditor'],
    components: {
        BaseCodeEditor,
        SapiDrawer
    },
    props: {
        isFlowEnabled: {
          type: Boolean,
          default: false
        }
    },
    data () {
        return {
            activeTab: 'Add',
            templateCode: '',
            mixinCode: ''
        }
    },
    watch: {
        activeTab () {
            this.setTemplateCode()
        },
        isFlowEnabled () {
          console.log(this.isFlowEnabled)
        }
    },
    methods: {
        onOpen() {
            window.setTimeout(() => {
                this.mixinCode = 'export default ' + this.ueditor.layoutAttrs.mixinCode
                this.setTemplateCode() 
            })
        },
        setTemplateCode() {
            this.templateCode = [
                '<template>',
                '    ' + this.ueditor.layoutAttrs.template[this.activeTab],
                '<\/template>',
                '<script>',
                'export default ' + this.ueditor.layoutAttrs.code,
                '<\/script>'].join('\n')
        },
        save (isClose) {
            let mixinCode = this.$refs.mixinCode.getValue()
            try {
                mixinCode = mixinCode.replace(/^export default /i, '')
                // const ast = parse(mixinCode, { sourceType: 'module' })
                const newMixinProps = this.ueditor.parseBindingProps(mixinCode)
                const bindingCodeProps = this.ueditor.bindingCodeProps

                let errorMsg = ''

                for (let p in newMixinProps.data) {
                  if (bindingCodeProps.data.hasOwnProperty(p)) {
                    errorMsg += `存在重复属性${p} \n`
                  }
                }

                // 校验是否存在属性、方法的覆盖问题
                for (let p in newMixinProps.methods) {
                  if (bindingCodeProps.methods.hasOwnProperty(p)) {
                    errorMsg += `存在重复方法${p} \n`
                  }
                }

                if (errorMsg) {
                  Vue.errorMsg(`${errorMsg}`)
                  return
                }

                this.ueditor.layoutAttrs.mixinCode = mixinCode
                if (isClose) {
                  this.$emit('update:visible', false)
                }
            } catch (err) {
                Vue.errorMsg(`js解析错误：${err}`)
            }
        }
    },
    created () {
      console.log(this.isFlowEnabled)
    }
}
</script>

<style lang="less">
.code-drawer{
    z-index:10;
}
.left-editor {
  position: relative;
  height: 100%;
  overflow: hidden;
}
.tab-editor {
  position: absolute;
  top: 41px;
  bottom: 0;
  left: 0;
  right: 0;
  font-size: 14px;
}
.right-editor {
  position: relative;
  height: 100%;
  overflow: hidden;
}
.action-bar{
  position: absolute;
  right: 0px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-right: 10px;
  z-index:1;
}
</style>
