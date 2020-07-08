<template>
    <div class="test">
        <zs-button type="cancel" @click="$store.dispatch('addfn')">+</zs-button>
        <zs-button type="cancel" @click="$store.dispatch('reductfn')">-</zs-button>
        {{this.$store.state.count}}
        {{this.$store.getters.getStateCount}}
        <zs-input type="text" placeholder="请输入"></zs-input>
        <br>
        <br>
        <zs-select v-model="aaa">
            <zs-option value="123" label="234"></zs-option>
            <zs-option value="12343" label="2234"></zs-option>
            <zs-option value="13423" label="234324"></zs-option>
            <zs-option value="134hj23" label="234234"></zs-option>
        </zs-select>
        <br>
        <br>
        <br>
        <zs-table
                :data="datas"
                :columns="columns"
                :context="context"
                :no-data-colspan="3"
                no-data-text="暂无匹配数据"
                border>
        </zs-table>
        <br>
        <br>
        <div class="pagination">
            <zs-pagination
                    class="page"
                    :total="totalPage"
                    :current="currPage"
                    show-total
                    show-elevator
                    @on-change="handlePageChange"
                    @on-page-size-change="handlePageSizeChange"
            ></zs-pagination>
        </div>
        <br>
        <br>
        <zs-radio-group v-model="aaaa">
            <zs-radio label="2">1111</zs-radio>
            <zs-radio label="3">2222</zs-radio>
        </zs-radio-group>
        <br>
        <br>
        <zs-checkbox-group v-model="aaaaa">
            <zs-checkbox true-label="0" false-label="">11111</zs-checkbox>
            <zs-checkbox true-label="1" false-label="">22222</zs-checkbox>
        </zs-checkbox-group>
        <br>
        <br>
        <zs-button type="primary" @click="aaaaaa=true">按钮</zs-button>
        <zs-button type="primary" @click="handleComit">提示弹窗</zs-button>
        <br>
        <br>
        <zs-dialog v-model="aaaaaa" title="核查备注">
            <div>
                werqwer
            </div>
            <div slot="footer" class="dialog-footer">
                <zs-button type="cancel" @click="aaaaaa=false">取消</zs-button>
                <zs-button type="primary" @click="aaaaaa=false">确定</zs-button>
            </div>
        </zs-dialog>
        <br>
        <date-picker
                v-model="aaa"
                :value="aaa"
                :disabledDate="-1"
                placeholder="请选择时间"
                @on-change="handleSetStartTime"
        ></date-picker>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                aaa: '',
                aaaa: '',
                aaaaa: '',
                aaaaaa: false,

                context: this,
                datas: [{
                    createTime: 45445
                },{
                    createTime: 45445
                }],
                columns: [
                    {
                        title: '编号',
                        key: 'id',
                        align: 'center',
                    },
                    {
                        title: '日期',
                        key: 'createTime',
                        align: 'center',
                    },
                    {
                        title: '状态',
                        key: 'recordStateDes',
                        align: 'center',
                    },
                ],

                totalPage: 50,
                currPage: 1,
                pageSize: 10,
            }
        },
        methods:{
            handlePageChange(currPage){
                this.currPage = currPage;
            },
            handlePageSizeChange(pageSize){
                this.currPage = 1;
                this.pageSize = pageSize;
            },
            handleSetStartTime(){

            },

            handleComit(){
                this.$confirm({
                    title: '删除菜单',
                    message: '确认删除该公众号菜单？'
                }).then(() => {

                }).catch(() => {
                });
            }
        },
        created(){

        }
    };
</script>
<style lang="less">
    .test{
        width: 800px;
        margin:  auto;
        padding: 20px;
        background: #fff;
    }
    .pagination{
        text-align: center;
        .page{
            display: inline-block;
        }
    }
    .dialog-footer{
        text-align: center;
        .zs-button{
            width: 100px;
        }
    }
</style>