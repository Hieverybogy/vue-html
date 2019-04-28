const menuLang = {
    en: {
        menu1: 'Quick Action',
        menu1_1: 'Data View',
        menu1_2: 'Sign Log',
        menu1_3: 'Operating Log',
        menu2: 'Product Manage',
        menu2_1: 'Product List',
        menu2_2: 'Product Evaluate ',
        menu3: 'Order Manage',
        menu3_1: 'Order List',
        menu4: 'Fund Record',
        menu4_1: 'Deal  Record',
        menu5: 'Pay Channel',
        menu5_1: 'Tonglian Pay',
        menu6: 'User Manage',
        menu6_1: 'User List',
        menu6_2: 'User Collect',
        menu6_3: 'Delivery Address',
        menu7: 'Product Parameter',
        menu7_1: 'Product Category',
        menu7_2: 'Reclassify Category',
        menu7_3: 'Product Property',
        menu7_4: 'Classify Property',
        menu7_5: 'Specification Stype',
        menu8: 'System Manage',
        menu8_1: 'AD List',
        menu8_2: 'Admin List',
        menu8_3: 'Role Manage',

        basic: 'Basic Info',
        loginPwd: 'Login Password',
        logout: 'Sign Out',
        notice: 'Notice',

        //基本信息dialog
        dialog1Title: 'Basic Information',
        dialog1Ti1: 'My Photo',
        dialog1Ti2: 'UserName',
        dialog1Ti3: 'NickName',
        dialog1Ti4: 'RealName',
        dialog1Ti5: 'Email',
        dialog1Info1: 'Upload only one picture, size no more than 1M, recommended specification: 100*100',
        dialog1Ti3placeholder: 'Please enter UserName',
        dialog1Ti4placeholder: 'Please ente NickName',
        dialog1Ti5placeholder: 'Please ente Mobile Phone',

        //修改密码dialog
        dialog2Title: 'Change Password',
        dialog2Ti1: 'Old Password',
        dialog2Ti2: 'New Password',
        dialog2Ti3: 'Confirm your Password',
        dialog2Ti1placeholder: 'Please enter Old Password',
        dialog2Ti2placeholder: '6-16 characters(letters or numbers only)',
        dialog2Ti3placeholder: 'Enter Password again',

        //弹窗按钮
        cancel: 'Cancel',
        submit: 'Submit',

        //错误信息提示
        nickNameErr: 'Nicknames cannot be empty',
        realNameAddErr: 'The full name cannot be empty',
        emailErr: 'Email cannot be empty',
        oldPwdErr: 'The original password cannot be empty',
        newPwdErr: 'The new password cannot be empty',
        newPwdAgainErr: 'Enter password again',
        diffErr: 'Entered passwords differ',
        pwdErr: '6-16 characters(letters or numbers only)',

        success: 'Success',

        //退出登录
        logoutTi: 'Logout',
        logoutInfo: 'Sure sign out？\n',
        sureBtn: 'Sure',
        cancelBtn: 'Cancel',


        //没有权限
        unPower: '~~Sorry, you do not have access to this page, please contact the administrator~~',


        //ajax提示
        unLogin: 'User not logged in',
        errorInfo: 'Network error',
    },
    cn: {
        menu1: '快捷操作',
        menu1_1: '数据概览',
        menu1_2: '登录日志',
        menu1_3: '操作日志',
        menu2: '商品管理',
        menu2_1: '商品列表',
        menu2_2: '商品评价',
        menu3: '订单管理',
        menu3_1: '订单列表',
        menu4: '资金管理',
        menu4_1: '交易流水',
        menu5: '支付通道管理',
        menu5_1: '通联支付',
        menu6: '用户管理',
        menu6_1: '用户列表',
        menu6_2: '用户收藏',
        menu6_3: '收货地址',
        menu7: '商品参数管理',
        menu7_1: '商品类别',
        menu7_2: '商品二级分类',
        menu7_3: '商品属性',
        menu7_4: '分类属性',
        menu7_5: '规格种类',
        menu8: '系统管理',
        menu8_1: '广告管理',
        menu8_2: '管理员管理',
        menu8_3: '角色管理',

        basic: '基本信息',
        loginPwd: '登录密码',
        logout: '退出登录',
        notice: '通知',

        //基本信息dialog
        dialog1Title: '基础信息',
        dialog1Ti1: '头像',
        dialog1Ti2: '用户名',
        dialog1Ti3: '昵称',
        dialog1Ti4: '真实姓名',
        dialog1Ti5: '邮箱',
        dialog1Info1: '建议尺寸：100*100像素图片，最多上传1张',
        dialog1Ti3placeholder: '请输入昵称',
        dialog1Ti4placeholder: '请输入真实姓名',
        dialog1Ti5placeholder: '请输入手机号码',

        //修改密码dialog
        dialog2Title: '修改密码',
        dialog2Ti1: '原密码',
        dialog2Ti2: '新密码',
        dialog2Ti3: '确认新密码',
        dialog2Ti1placeholder: '请输入原登录密码',
        dialog2Ti2placeholder: '请设置密码，6-16位数字、字母或下划线',
        dialog2Ti3placeholder: '请再次确认新密码',

        //弹窗按钮
        cancel: '取消',
        submit: '确认',

        //错误信息提示
        nickNameErr: '昵称不能为空',
        realNameAddErr: '真实姓名不能为空',
        emailErr: '邮箱不能为空',
        oldPwdErr: '原密码不能为空',
        newPwdErr: '新密码不能为空',
        newPwdAgainErr: '请再次输入新密码',
        diffErr: '您两次输入的密码不一致',
        pwdErr: '6-16位数字、字母或下划线',

        success: '修改成功',

        //退出登录
        logoutTi: '退出登录',
        logoutInfo: '您确认要退出登录吗？',
        sureBtn: '确定',
        cancelBtn: '取消',


        //没有权限
        unPower: '~~抱歉，您没有权限访问该页面，请联系管理员~~',


        //ajax提示
        unLogin: '用户未登录',
        errorInfo: '网络错误',
    }
};

module.exports = menuLang;