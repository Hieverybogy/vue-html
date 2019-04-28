<template>
    <zs-dialog v-model="dialog" title="选择区域" class="city-dialog">
        <div>
            <zs-checkbox-group v-model="currProv">
                <div class="province" v-for="(item,index) in provOpts" :key="index" :class="[{'cho' : item.onOff}]">
                    <zs-checkbox :label="item.code" @change="handleFather(index)">{{item.name}}</zs-checkbox>
                    <i class="add-city" @click="item.onOff=!item.onOff"></i>
                    <span class="add-sum" v-if="item.child && item.child.length>0">({{item.child.length}})</span>
                    <div class="city-detail" v-show="item.onOff">
                        <zs-checkbox-group v-model="item.child" @change="handleChild(index)">
                            <div class="child-city" v-for="(o2,i2) in item.childRen" :key="i2">
                                <zs-checkbox :label="o2.code">{{o2.name}}</zs-checkbox>
                            </div>
                        </zs-checkbox-group>
                        <div class="close-city"><i @click="item.onOff=false">关闭</i></div>
                    </div>
                </div>
            </zs-checkbox-group>
        </div>
        <div slot="footer" class="dialog-footer">
            <zs-button type="cancel" @click="handleClose">取消</zs-button>
            <zs-button type="primary" @click="handleDealData">确定</zs-button>
        </div>
    </zs-dialog>
</template>

<script>
    import areaData from './v6jUni'

    export default {
        name: 'citySelect',
        props: {
            value: Boolean,
            city: Array,
        },
        data() {
            return {
                dialog: false,
                currProv: [],
                provOpts: areaData,

                oldCurrProv: [],
                oldprovOpts: areaData,
            };
        },
        watch: {
            value(val) {
                this.dialog = val;
            },
            dialog(val) {
                this.$emit('input', val);
            },
            city(val){
                for (let i = 0; i < this.provOpts.length; i++) {
                    this.$set(this.provOpts[i], 'onOff', false);
                    this.$set(this.provOpts[i], 'child', []);
                }
                this.currProv = [];
                if(val.length>0){
                    let datas = [...val];
                    let choAll = [];
                    datas.forEach((o1, i1) => {
                        choAll.push(parseInt(o1.code))
                        this.$set(o1,'child',[]);
                        o1.childrens.forEach((o2,i2)=>{
                            o1.child.push(parseInt(o2.code));
                        })
                    });

                    this.provOpts.forEach((o1,i1)=>{
                        if(choAll.indexOf(o1.code)>-1){
                            o1.child = datas[choAll.indexOf(o1.code)].child;
                            if(o1.child.length === o1.childRen.length){
                                this.currProv.push(o1.code);
                            }
                        }
                    });
                }
            }
        },
        computed: {},
        methods: {
            /* 点击取消 */
            handleClose() {
                this.$emit('input', false);
                this.currProv = [];
                this.provOpts = areaData;
                this.$emit('getReset');
            },
            /* 省份选择事件 */
            handleFather(index) {
                if (this.currProv.indexOf(this.provOpts[index].code) > -1) {
                    this.$set(this.provOpts[index], 'child', []);
                    for (let i = 0; i < this.provOpts[index].childRen.length; i++) {
                        this.provOpts[index].child.push(this.provOpts[index].childRen[i].code);
                    }
                } else {
                    this.$set(this.provOpts[index], 'child', []);
                }
            },
            /* 城市选择事件 */
            handleChild(index) {
                if (this.provOpts[index].child.length === this.provOpts[index].childRen.length) {
                    this.currProv.push(this.provOpts[index].code);
                } else {
                    if (this.currProv.indexOf(this.provOpts[index].code) > -1) {
                        this.currProv.splice(this.currProv.indexOf(this.provOpts[index].code), 1);
                    }
                }
            },
            /* 确认添加 */
            handleDealData() {
                let allArr = [];
                let choMsg = [];
                this.provOpts.forEach((o1, i1) => {
                    if (o1.child.length > 0) {
                        for (var i in o1.child) {
                            allArr.push(o1.child[i]);
                        }
                    }
                });
                this.provOpts.forEach((o1, i1) => {
                    if(o1.child.length>0){
                        choMsg.push({
                            childrens: [],
                            code: o1.code,
                            name: o1.name
                        })
                    }
                    o1.childRen.forEach((o2, i2) => {
                        if (allArr.indexOf(o2.code) > -1) {
                            choMsg[choMsg.length-1].childrens.push({
                                code: o2.code,
                                name: o2.name
                            });
                        }
                    })
                });
                console.log(choMsg);
                this.$emit('input', false);
                this.$emit('getData',choMsg);
            },
        },
        created() {
            if (this.value) {
                this.dialog = true;
            }
        },
        mounted() {
            for (let i = 0; i < this.provOpts.length; i++) {
                this.$set(this.provOpts[i], 'onOff', false);
                this.$set(this.provOpts[i], 'child', []);
            }
        }
    };
</script>
<style lang="less">
    @import './style.less';
</style>