<template>
    <div class="ifram-page" @click="language=false;updialog=false">
        <!-- 左侧导航菜单 -->
        <div class="ifram-nav">
            <img class="logo" src="./assets/logo_guoji.png" alt="国际商城总运营后台">

            <ul class="nav-ul1" id="nav-ul">
                <li v-for="(item,index1) in navList" :key="index1" :id="item.id" v-show="powerModules.indexOf(item.id)>-1">
                    <div :class="lang==='cn'?'father-title': 'father-title english'"   @click="handleTurnPage(item.link,index1)" :title="item.title">
                        <i class="icon-prev" :style="{backgroundImage: `url(${item.img})`}"></i>
                        {{item.title}}
                        <i class="icon-up" :class="[{'icon-down' : slideBtn[index1].slide}]"></i>
                    </div>
                    <ul class="son-ul" v-if="item.children.length>0"
                        :style="currentF === index1 ? 'display: block' : ''">
                        <li v-for="(it,index2) in item.children" :key="index2" @click="handleTurnPage(it.link)" v-show="power.indexOf(it.powerLink)>-1"
                            :class="[{'son-cho' : currentF === index1 && currentS===index2}] " :title="it.title">{{it.title}}
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <!-- 头部 -->
        <div class="ifram-head">
            <div class="breadcrumb" v-if="currentF!==-1 || currentS!==-1">
                <i class="icon-pre"></i>
                <span class="sp1" >{{navList[currentF].title}} / </span><span class="sp2">{{navList[currentF].children[currentS].title}}</span>
            </div>
            <!-- <div class="info-msg">
                <div class="msg-list">
                    <ul class="msg-ul" id="msg-ul">
                        <li v-for="(item,index) in messageList"><i class="msg-img"></i> {{item}}</li>
                    </ul>
                </div>
            </div> -->
            <div class="head-right">
                <div class="user-msg" @click.stop="updialog=!updialog;language=false;">
                    <div class="user-img" :style="userMsg.logo ? { backgroundImage: `url(${userMsg.logo})`} : ''"></div>
                    {{userMsg.account || '--'}}
                    &nbsp;&nbsp;
                    <i class="i-up" :class="[{'rotato' : updialog}]"></i>
                    <ul class="up-sl" v-show="updialog" @click.stop="" style="width: 98%;">
                        <li @click="handleOpenDialogO"> {{$t("menu.basic")}}</li>
                        <li @click="oldPwd='';newPwd='';newPwdAgain='';pwdDialog=true"> {{$t("menu.loginPwd")}}</li>
                        <li @click="handleLoginOut"> {{$t("menu.logout")}}</li>
                    </ul>
                </div>
                <div class="user-msg lang" @click.stop="language=!language;updialog=false;">
                    <i class="lang-icon"></i>
                    {{lang==='cn' ? '中文-简体' : 'English'}}
                    &nbsp;&nbsp;
                    <i class="i-up" :class="[{'rotato' : language}]"></i>
                    <ul class="up-sl" v-show="language" @click.stop="">
                        <li @click="handleChangeLang(1)">中文(简体)</li>
                        <li @click="handleChangeLang(2)">English</li>
                    </ul>
                </div>
                <div class="notice" @click="handleTurnMessage">
                    <i class="img"></i>
                    {{$t("menu.notice")}}
                    <span class="new-msg" v-if="unReadCount!==''">{{unReadCount}}</span>
                </div>
            </div>
        </div>
        <!-- 内容区域 -->
        <div class="ifram-body">
            <slot></slot>
        </div>

        <!-- 基本信息 -->
        <zs-dialog class="dialog_add_ifram" v-model="infoDialog" :title="$t('menu.dialog1Title')">
            <ul class="inner__ul">
                <li class="li-ti_sta">
                    <span class="li-ti"><em>*</em> {{$t('menu.dialog1Ti1')}}</span>
                    <div class="li-ri">
                        <upload-photo id="headImg"
                                      :max="1"
                                      :images="headImage"
                                      @change="handlHeadImageChange"
                                      @delete="handleDelHeadImg"
                        ></upload-photo>
                    </div>
                </li>
                <li>
                    <span class="li-ti"><em>*</em> {{$t('menu.dialog1Ti2')}}</span>
                    <div class="li-ri">
                        {{userMsg.account}}
                    </div>
                </li>
                <li>
                    <span class="li-ti"><em>*</em> {{$t('menu.dialog1Ti3')}}</span>
                    <div class="li-ri">
                        <zs-input :placeholder="$t('menu.dialog1Ti3placeholder')" v-model="nickName"  @change="handleDelErrItem('nickName')"
                                  :class="[{'error-input' : errorItem.indexOf('nickName')>-1}]"></zs-input>
                        <p class="error-msg1" v-if="errorItem.indexOf('nickName')>-1"><i class="err-icon"></i>{{$t('menu.nickNameErr')}}
                        </p>
                    </div>
                </li>
                <li>
                    <span class="li-ti"><em>*</em> {{$t('menu.dialog1Ti4')}}</span>
                    <div class="li-ri">
                        <zs-input :placeholder="$t('menu.dialog1Ti4placeholder')" v-model="realNameAdd"   @change="handleDelErrItem('realNameAdd')"
                                  :class="[{'error-input' : errorItem.indexOf('realNameAdd')>-1}]"></zs-input>
                        <p class="error-msg1" v-if="errorItem.indexOf('realNameAdd')>-1"><i class="err-icon"></i>{{$t('menu.realNameAddErr')}}
                        </p>
                    </div>
                </li>
                <li>
                    <span class="li-ti"><em>*</em> {{$t('menu.dialog1Ti5')}}</span>
                    <div class="li-ri">
                        <zs-input :placeholder="$t('menu.dialog1Ti5placeholder')" v-model="email"  @change="handleDelErrItem('email')"
                                  :class="[{'error-input' : errorItem.indexOf('email')>-1}]"></zs-input>
                        <p class="error-msg1" v-if="errorItem.indexOf('email')>-1"><i class="err-icon"></i>{{$t('menu.emailErr')}}
                        </p>
                    </div>
                </li>
            </ul>
            <div slot="footer" class="dialog-footer">
                <zs-button type="cancel" @click="infoDialog=false">{{$t('menu.cancel')}}</zs-button>
                <zs-button type="primary" @click="updateInfo">{{$t('menu.submit')}}</zs-button>
            </div>
        </zs-dialog>
        <!-- 修改密码 -->
        <zs-dialog class="dialog_add_ifram" v-model="pwdDialog" :title="$t('menu.dialog2Title')">
            <ul class="inner__ul">
                <li>
                    <span class="li-ti"><em>*</em> {{$t('menu.dialog2Ti1')}}</span>
                    <div class="li-ri">
                        <zs-input class="pwd-input" :placeholder="$t('menu.dialog2Ti1placeholder')" v-model="oldPwd"  @change="handleDelErrItem('oldPwd')"
                                  :class="[{'error-input' : errorItem.indexOf('oldPwd')>-1}]"></zs-input>
                        <p class="error-msg1" v-if="errorItem.indexOf('oldPwd')>-1"><i class="err-icon"></i>{{$t('menu.oldPwdErr')}}
                        </p>
                    </div>
                </li>
                <li>
                    <span class="li-ti"><em>*</em> {{$t('menu.dialog2Ti2')}}</span>
                    <div class="li-ri">
                        <zs-input class="pwd-input" :placeholder="$t('menu.dialog2Ti2placeholder')" v-model="newPwd" @change="handleDelErrItem(['newPwd','pwdErr'])"
                                  :class="[{'error-input' : errorItem.indexOf('newPwd')>-1 || errorItem.indexOf('pwdErr')>-1}]"></zs-input>
                        <p class="error-msg1" v-if="errorItem.indexOf('newPwd')>-1"><i class="err-icon"></i>{{$t('menu.newPwdErr')}}</p>
                        <p class="error-msg1" v-if="errorItem.indexOf('pwdErr')>-1"><i class="err-icon"></i>{{$t('menu.pwdErr')}}</p>
                    </div>
                </li>
                <li>
                    <span class="li-ti"><em>*</em> {{$t('menu.dialog2Ti3')}}</span>
                    <div class="li-ri">
                        <zs-input class="pwd-input" :placeholder="$t('menu.dialog2Ti3placeholder')" v-model="newPwdAgain" @change="handleDelErrItem(['newPwdAgain','diffErr','pwdErr'])"
                                  :class="[{'error-input' : errorItem.indexOf('newPwdAgain')>-1 || errorItem.indexOf('diffErr')>-1 || errorItem.indexOf('pwdErr')>-1}]"></zs-input>
                        <p class="error-msg1" v-if="errorItem.indexOf('newPwdAgain')>-1"><i class="err-icon"></i>{{$t('menu.newPwdAgainErr')}}</p>
                        <p class="error-msg1" v-if="errorItem.indexOf('diffErr')>-1"><i class="err-icon"></i>{{$t('menu.diffErr')}}</p>
                        <p class="error-msg1" v-if="errorItem.indexOf('pwdErr')>-1"><i class="err-icon"></i>{{$t('menu.pwdErr')}}</p>
                    </div>
                </li>
            </ul>
            <div slot="footer" class="dialog-footer">
                <zs-button type="default" @click="pwdDialog=false">{{$t('menu.cancel')}}</zs-button>
                <zs-button type="primary" @click="updatePwd">{{$t('menu.submit')}}</zs-button>
            </div>
        </zs-dialog>

        <audio preload="none" crossorigin="anonumous" id="audio0" style="display: none;">
            <source src="/static/apushSound.mp3">
        </audio>
    </div>
</template>

<script>
    import {turnToNextPage, getCookie, delCookie, setCookie, isEmpty} from '../../assets/js/utils'
    import "../../assets/jsmtop/apushParams";
    import uploadPhoto from '../upload-photo/app';

    export default {
        name: 'ifram',
        components: {uploadPhoto},
        data() {
            return {
                userMsg: {},
                power: [],
                powerModules: [],
                //消息提示
                messageList: [],
                currMsg: 0,
                timer: null,

                //消息中心
                unReadCount: '',  //该类型中未读消息个数



                updialog: false,
                power: [],

                applyStatus: '',   //ORIGINAL(0, "原始账号"),APPLYING(1, "审核中"),APPLYED(2, "审核通过"),APPLY_FAIL(3, "审核不通过");

                //基础信息
                headImage: [],
                infoDialog: false,
                logo: '',
                nickName: '',
                realNameAdd: '',
                email: '',
                //修改密码
                pwdDialog: false,
                oldPwd: '',
                newPwd: '',
                newPwdAgain: '',

                errorItem: [],     //错误项
                errorMsg: {
                    account: '沙县账号不能为空',
                    accountErr: '6-16个字符，含数字、字母、特殊符号',
                    userName: '员工姓名不能为空',
                    phone: '手机号不能为空',
                    phoneErr: '手机号有误',
                    roles: '请选择所属角色',
                    loginPwd: '登录密码不能为空',
                    loginPwdErr: '设置登录密码，6-16位数字、字母或下划线',
                },

                /* 中英文切换 */
                lang: 'cn',
                language: false,

                /* 控制左侧菜单按钮 */
                slideBtn: [
                    {slide: false},
                    {slide: false},
                    {slide: false},
                    {slide: false},
                    {slide: false},
                    {slide: false},
                    {slide: false},
                    {slide: false},
                ]
            }
        },
        props: {
            currentF: Number,
            currentS: Number,
            read: Number,
        },
        watch: {
            read(val) {
                this.selectTypeList();
            }
        },
        computed: {
            navList() {
                let navList = [
                    {
                        id: 'workbench',
                        img: require('./assets/fast_ico.png'),
                        title: this.$t("menu.menu1"),
                        link: '',
                        slide: false,
                        childrenPower: ['workbench.html'],
                        children: [{
                            link: '/home/workbench/index.html',
                            powerLink: 'workbench/index.html',
                            title: this.$t("menu.menu1_1"),
                        }, {
                            link: '/home/workbench/list_loginLog.html',
                            powerLink: 'workbench/list_loginLog.html',
                            title: this.$t("menu.menu1_2"),
                        }, {
                            link: '/home/workbench/list_doLog.html',
                            powerLink: 'workbench/list_doLog.html',
                            title: this.$t("menu.menu1_3"),
                        }]
                    }, {
                        id: 'goods',
                        img: require('./assets/commodity_ico.png'),
                        title: this.$t("menu.menu2"),
                        link: '',
                        slide: false,
                        childrenPower: ['workbench.html'],
                        children: [{
                            link: '/home/goods/list.html',
                            powerLink: 'goods/list.html',
                            title: this.$t("menu.menu2_1"),
                        }]
                    }, {
                        id: 'order',
                        img: require('./assets/order_ico.png'),
                        title: this.$t("menu.menu3"),
                        link: '',
                        slide: false,
                        childrenPower: ['workbench.html'],
                        children: [{
                            link: '/home/order/list.html',
                            powerLink: 'order/list.html',
                            title: this.$t("menu.menu3_1"),
                        }]
                    }, {
                        id: 'cash',
                        img: require('./assets/funds_ico.png'),
                        title: this.$t("menu.menu4"),
                        link: '',
                        slide: false,
                        childrenPower: ['workbench.html'],
                        children: [{
                            link: '/home/cash/list_record.html',
                            powerLink: 'cash/list_record.html',
                            title: this.$t("menu.menu4_1"),
                        }]
                    }, {
                        id: 'pay',
                        img: require('./assets/pay_ico.png'),
                        title: this.$t("menu.menu5"),
                        link: '',
                        slide: false,
                        childrenPower: ['workbench.html'],
                        children: [{
                            link: '/home/pay/list.html',
                            powerLink: 'pay/list.html',
                            title: this.$t("menu.menu5_1"),
                        }]
                    }, {
                        id: 'user',
                        img: require('./assets/yhgl.png'),
                        title: this.$t("menu.menu6"),
                        link: '',
                        slide: false,
                        childrenPower: ['workbench.html'],
                        children: [{
                            link: '/home/user/list.html',
                            powerLink: 'user/list.html',
                            title: this.$t("menu.menu6_1"),
                        }, {
                            link: '/home/user/collect.html',
                            powerLink: 'user/collect.html',
                            title: this.$t("menu.menu6_2"),
                        }, {
                            link: '/home/user/address.html',
                            powerLink: 'user/address.html',
                            title: this.$t("menu.menu6_3"),
                        }]
                    }, {
                        id: 'setting',
                        img: require('./assets/parameter_ico.png'),
                        title: this.$t("menu.menu7"),
                        link: '',
                        slide: false,
                        childrenPower: ['workbench.html'],
                        children: [{
                            link: '/home/setting/list_sort.html',
                            powerLink: 'setting/list_sort.html',
                            title: this.$t("menu.menu7_1"),
                        }, {
                            link: '/home/setting/list_classify.html',
                            powerLink: 'setting/list_classify.html',
                            title: this.$t("menu.menu7_2"),
                        }, {
                            link: '/home/setting/list_goods_prop.html',
                            powerLink: 'setting/list_goods_prop.html',
                            title: this.$t("menu.menu7_3"),
                        }, {
                            link: '/home/setting/list_classify_prop.html',
                            powerLink: 'setting/list_classify_prop.html',
                            title: this.$t("menu.menu7_4"),
                        }, {
                            link: '/home/setting/list_spec.html',
                            powerLink: 'setting/list_spec.html',
                            title: this.$t("menu.menu7_5"),
                        }]
                    }, {
                        id: 'system',
                        img: require('./assets/system_ico.png'),
                        title: this.$t("menu.menu8"),
                        link: '',
                        slide: false,
                        childrenPower: ['workbench.html'],
                        children: [{
                            link: '/home/system/list_adve.html',
                            powerLink: 'system/list_adve.html',
                            title: this.$t("menu.menu8_1"),
                        }, {
                            link: '/home/system/list_employ.html',
                            powerLink: 'system/list_employ.html',
                            title: this.$t("menu.menu8_2"),
                        }, {
                            link: '/home/system/list_roles.html',
                            powerLink: 'system/list_roles.html',
                            title: this.$t("menu.menu8_3"),
                        }]
                    }];
                return navList;
            }
        },
        methods: {
            /* ----------------------------------------------------------- insert (增) start ----------------------------------------------------------------*/

            /* ----------------------------------------------------------- insert (增) end ----------------------------------------------------------------*/

            /* ----------------------------------------------------------- delete (删) start ----------------------------------------------------------------*/

            /* ----------------------------------------------------------- delete (删) end ----------------------------------------------------------------*/

            /* ----------------------------------------------------------- update (改) start ----------------------------------------------------------------*/
            /**
             * 修改用户密码
             */
            updatePwd() {
                //校验
                this.errorItem = [];
                let _pwd = /^[A-Za-z0-9_]{6,16}$/;   //6-16位数字、字母或下划线
                let error = {
                    oldPwd: '',
                    newPwd: '',
                    newPwdAgain: '',
                };
                for (let x in error) {
                    if (isEmpty(this[x])) {
                        this.errorItem.push(x);
                    }
                }
                if (this.errorItem.length > 0) {
                    return
                }
                if(this.newPwd != this.newPwdAgain){
                    this.errorItem.push('diffErr');
                    return
                }else if(!_pwd.test(this.newPwd)){
                    this.errorItem.push('pwdErr');
                    return
                }
                //修改
                const loading = this.$loading();
                let _this = this;
                comFn.ajax({
                    self: _this,
                    url: "/admin/updatePassword",
                    data: {
                        oldPwd: _this.oldPwd,
                        newPwd: _this.newPwd,
                    },
                    success(res) {
                        loading.close();
                        _this.pwdDialog = false;
                        _this.$message({
                            message: _this.$t("menu.success"),
                            duration: 1500
                        });
                    },
                    error(res) {
                        loading && loading.close();
                    }
                })
            },
            /**
             * 修改用户基础信息
             */
            updateInfo(){
                //校验
                this.errorItem = [];
                let error = {
                    nickName: '',
                    realNameAdd: '',
                    email: '',
                };
                for (let x in error) {
                    if (isEmpty(this[x])) {
                        this.errorItem.push(x);
                    }
                }
                if (this.errorItem.length > 0) {
                    return
                }
                //修改
                const loading = this.$loading();
                let _this = this;
                comFn.ajax({
                    self: _this,
                    url: "/admin/updateBasicInfo",
                    data: {
                        logo: _this.logo,
                        nickName: _this.nickName,
                        realName: _this.realNameAdd,
                        email: _this.email,
                    },
                    success(res) {
                        _this.selectFindAdmin(()=>{
                            loading.close();
                            _this.infoDialog = false;
                            _this.$message({
                                message: _this.$t("menu.success"),
                                duration: 1500
                            });
                        },loading);
                    },
                    error(res) {
                        loading && loading.close();
                    }
                })
            },
            /* ----------------------------------------------------------- update (改) end ----------------------------------------------------------------*/

            /* ----------------------------------------------------------- select (查) start ----------------------------------------------------------------*/
            /**
             * 获取管理员信息
             * @param fn
             * @param loading
             */
            selectFindAdmin(fn, loading) {
                let _this = this;
                comFn.ajax({
                    self: _this,
                    url: "/admin/findAdmin",
                    data: {
                        id: _this.userMsg.id
                    },
                    success(res) {
                        let auths = res.auths || [];
                        let menu = [];
                        let api = [];
                        auths.forEach((o1, i1) => {
                            let arr = o1 ? o1.split('.') : [];
                            let str = arr[0]+'/'+ arr[1]+'.html';
                            menu.push(str);
                            api.push(arr[2]);//接口权限
                        });
                        _this.power = menu;
                        _this.userMsg = res || {};
                        _this.power.forEach((o1,i1)=>{
                            let str = o1 ? o1.split('/')[0]: '';
                            str && _this.powerModules.indexOf(str)===-1 && _this.powerModules.push(str);
                        });
                        // 存 localStorage
                        // localStorage.clear();
                        localStorage.menu = JSON.stringify(menu);
                        localStorage.api = JSON.stringify(api);

                        let userMsg = res ? JSON.stringify(res) : '{}';
                        // 存setCookie
                        // setCookie('menu', JSON.stringify(menu), "5h");
                        // setCookie('api', JSON.stringify(api), "5h");

                        // setCookie('userMsg', userMsg, "5h");
                        // console.log(_this.power,1,api)

                        fn && fn();
                    },
                    error(res) {
                        loading && loading.close();
                    }
                })
            },


            /**
             * 获取该标识所有类型未读消息总数
             * @param fn
             * @param loading
             */
            selectTypeList(fn, loading) {
                let _this = this;

                comFn.ajax({
                    self: _this,
                    url: "/msgNotity/getAllNuReadCountForAdmin",
                    data: {},
                    success(res) {
                        _this.unReadCount = res || 0;
                        localStorage.unReadCount = _this.unReadCount;
                        fn && fn();
                    },
                    error(res) {
                        loading && loading.close();
                    }
                });
            },
            /* ----------------------------------------------------------- select (查) end ----------------------------------------------------------------*/

            /* ----------------------------------------------------------- handle (操) start ----------------------------------------------------------------*/
            /**
             * 退出登录
             */
            handleLoginOut() {
                this.$confirm({
                    title: this.$t("menu.logoutTi"),
                    message: this.$t("menu.logoutInfo"),
                    cancelButtonText: this.$t("menu.cancelBtn"),
                    confirmButtonText: this.$t("menu.sureBtn"),
                }).then(() => {
                    let _this = this;
                    const loading = this.$loading();

                    comFn.ajax({
                        self: _this,
                        url: "/public/logout",
                        data: {},
                        success(res) {
                            localStorage.removeItem('menu');
                            localStorage.removeItem('api');
                            // setCookie('userMsg', '','0s');
                            turnToNextPage('/open/login.html');
                        },
                        error(res) {
                            loading && loading.close();
                        }
                    });
                }).catch(() => {
                });
            },
            /**
             * 页面跳转
             * @param link
             * @param index
             */
            handleTurnPage(link, index) {
                if (isEmpty(link)) {
                    let onOff = !this.slideBtn[index].slide;
                    this.$set(this.slideBtn[index], 'slide', onOff);
                } else {
                    turnToNextPage(link);
                }
            },
            /**
             * 打开基础信息修改弹窗
             */
            handleOpenDialogO(){
                this.logo = this.userMsg.logo;
                this.nickName = this.userMsg.nickName;
                this.realNameAdd = this.userMsg.realName;
                this.email = this.userMsg.email;
                this.headImage = this.userMsg.logo ? this.userMsg.logo.split(',') : [];

                this.infoDialog = true;
            },

            /**
             * 跳转消息中心
             */
            handleTurnMessage() {
                turnToNextPage('/home/message/list.html');
            },
            /**
             * 消息提示，apush
             */
            handleApush() {
                let _this = this;
                comApush.init();
                setTimeout(() => {
                    comApush.subscribeTopicMsg(
                        "yulian-merchant.apushs.topic.app." + _this.userMsg.features.merchantId,
                        function (msg) {
                            console.log(msg);
                            let data = msg.arg ? JSON.parse(msg.arg).expandParams : {};
                            let message = `${data.name}${data.phone}  ${data.action}  ${data.content}`;

                            clearInterval(_this.timer);

                            _this.messageList.push(message);
                            _this.unReadCount = parseInt(_this.unReadCount) + 1;
                            localStorage.unReadCount = _this.unReadCount;
                            document.getElementById("audio0").play();

                            _this.timer = setInterval(() => {
                                _this.currMsg++;
                                let _top = -2.24 * _this.currMsg + 'rem';
                                $("#msg-ul").animate({top: _top});
                                if (_this.currMsg + 1 === _this.messageList.length) {
                                    clearInterval(_this.timer);
                                }
                            }, 9000);
                        }
                    );

                }, 500);
            },


            /**
             * 头像图片---选择
             * @param img
             */
            handlHeadImageChange(img) {
                this.headImage.push(img);
                this.logo = img;
            },
            /**
             * 头像图片---删除
             * @param index
             */
            handleDelHeadImg(index) {
                this.$delete(this.headImage, index);
                this.logo = '';
            },
            /**
             * 菜单jq
             */
            handleNav() {
                $('#nav-ul > li').children('.father-title').click(function () {
                    $(this).next(".son-ul").slideToggle(200);
                })
            },
            /**
             * 语言选择
             * @param index
             */
            handleChangeLang(index) {
                localStorage.lang = ['', 'cn', 'en'][index];
                this.lang = ['', 'cn', 'en'][index];
                this.$i18n.locale = ['', 'cn', 'en'][index];
                this.language = false;

                const _this = this;
                comFn.ajax({
                    self: _this,
                    url: "/public/lang",
                    data: {
                        lang: this.lang
                    },
                    success(res) {
                    },
                    error(res) {
                    }
                });
            },
            /**
             * 表单校验---取消错误信息的选中
             */
            handleDelErrItem(item) {
                if(Array.isArray(item)){
                    item.forEach((o1,i1)=>{
                        if (this.errorItem.indexOf(o1) > -1) {
                            this.errorItem.splice(this.errorItem.indexOf(o1), 1);
                        }
                    })
                }else {
                    if (this.errorItem.indexOf(item) > -1) {
                        this.errorItem.splice(this.errorItem.indexOf(item), 1);
                    }
                }
            },
            /* ----------------------------------------------------------- handle (操) end ----------------------------------------------------------------*/
        },
        created() {
            //语言选择
            let sysLang = (navigator.language || navigator.userLanguage).indexOf('zh') > -1 ? 'cn' : 'en';  //判断浏览器的语言
            localStorage.lang = localStorage.lang || 'en';  //第一次默认选取浏览器语言，否则选择选取记录
            this.$i18n.locale = localStorage.lang;
            this.lang = localStorage.lang;

            this.power = localStorage.menu ? JSON.parse(localStorage.menu) : [];
            this.power.forEach((o1,i1)=>{
                let str = o1 ? o1.split('/')[0]: '';
                str && this.powerModules.indexOf(str)===-1 && this.powerModules.push(str);
            });
        },
        mounted() {
            this.selectFindAdmin(()=>{
                this.handleNav();
                if (this.currentF !== -1 || this.currentS !==-1) {
                    this.slideBtn[this.currentF].slide = true;
                }
            });
            this.selectTypeList();
            setInterval(()=>{
                this.selectTypeList();
            },60000*5);
        }
    };
</script>

<style lang="less">
    @import './style.less';
</style>