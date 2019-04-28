'use strict';
(function(window) {
	var comFn = {
		//获取url参数
		getParam: function(name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
			var r = ('?' + (window.location.href).split('?')[1]).substr(1).match(reg);
			if(r != null) return unescape(r[2]);
			return null;
		},
		//判断运行环境
		userAgent: function() {
			var u = window.navigator.userAgent,
				isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
				isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1,
				isWeixin = u.toLowerCase().indexOf('micromessenger') > -1
			var result = {
				"isIOS": isIOS,
				"isAndroid": isAndroid,
				"isWeixin": isWeixin
			}
			return result;
		},
		//获取地理位置
		getLocation: function(success, fail) {
			comFn.showLoading();
			if(navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(position) {
					if(position.coords) {
						comFn.hideLoading();
						if(success) {
							success(position.coords.longitude, position.coords.latitude);
						}
					} else {
						comFn.hideLoading();
						comFn.showToast('定位出错');
						setTimeout(function() {
							if(fail) {
								fail();
							}
						}, 1000);
					}
				}, function(error) {
					var msg = '未知错误';
					switch(error.code) {
						case 1:
							msg = '定位被拒绝';
							break;
						case 2:
							msg = '定位失败';
							break;
						case 3:
							msg = '定位超时';
							break;
					}
					comFn.hideLoading();
					comFn.showToast(msg);
					setTimeout(function() {
						if(fail) {
							fail();
						}
					}, 1000);
				});
			} else {
				comFn.hideLoading();
				comFn.showToast('当前设备不支持定位');
				setTimeout(function() {
					if(fail) {
						fail();
					}
				}, 1000);
			}
		},
		//去除字符串两端空格
		trimStr: function(str) {
			return str.replace(/(^\s*)|(\s*$)/g, "");
		},
		//开启滚动条监听，滚动到底后执行回调
		onSlide: function(callback) {
			var that = this;
			$(window).on('scroll', function() {
				if(document.body.scrollHeight - window.scrollY <= (window.innerHeight + 20)) {
					that.offSlide();
					callback();
				}
			});
		},
		//关闭滚动条监听
		offSlide: function() {
			$(window).off('scroll');
		},
		//ajax
		ajax: function(params) {
            var csrftoken = '';
            try {
                csrftoken = document.cookie.split('csrfToken=')[1].split(';')[0];
            } catch(e) {}
            function csrfSafeMethod(method) {
                return(/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
            }

            let _data = {};
            if(params.data){
               params.data.lang = localStorage.lang || 'en';
                _data = params.data;
            }else {
                _data = {
                	lang: localStorage.lang || 'en'
				}
			}
			$.ajax({
				type: 'post',
				url: process.env.API_HOST + params.url,
				data: _data,
                //跨域请求
                xhrFields: {
                    withCredentials: process.env.NODE_ENV == 'development' ? true : false
                },
                crossDomain: process.env.NODE_ENV == 'development' ? true : false,
                beforeSend(xhr, settings) {
                    if(!csrfSafeMethod(settings.type)) {
                        xhr.setRequestHeader('x-csrf-token', csrftoken);
                    }
                    if(params.beforeSend) {
                        params.beforeSend();
                    }
                },
				success(res) {
					params.success(res);
				},
				error(err) {
					if(err.status == 302) {
                        params.self.$message({
                            duration: 1500,
                            message:  params.self.$t('menu.unLogin')
                            // message: err ? (JSON.parse(err.responseText).value || JSON.parse(err.responseText).error || '用户未登陆' : '用户未登陆'
                        });
                        setTimeout(()=>{
                            window.location.href = '/open/login.html';
						},500);
					}else {
						if(params.url != '/admin/loginAdmin'){
							params.self.$message({
								duration: 1500,
								message: err ? (JSON.parse(err.responseText).value || JSON.parse(err.responseText).error || this.$t('message.errorInfo')) : this.$t('message.errorInfo')
							});
						}

						params.error(err);
					}
				},
				complete() {
				}
			});
		},
        //upload
        upload: function(params) {
            var csrftoken = '';
            try {
                csrftoken = document.cookie.split('csrfToken=')[1].split(';')[0];
            } catch(e) {}
            function csrfSafeMethod(method) {
                return(/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
            }
            $.ajax({
                type: 'post',
                url: process.env.API_HOST + '/public/uploadImg',
                cache: false,
                processData: false,
                contentType: false,
                data: params.data,
                //跨域请求
                xhrFields: {
                    withCredentials: process.env.NODE_ENV == 'development' ? true : false
                },
                crossDomain: process.env.NODE_ENV == 'development' ? true : false,
                beforeSend(xhr, settings) {
                    if(!csrfSafeMethod(settings.type)) {
                        xhr.setRequestHeader('x-csrf-token', csrftoken);
                    }
                    if(params.beforeSend) {
                        params.beforeSend();
                    }
                },
                success(res) {
                    if(params.success) {
                        params.success(res)
                    }
                },
                error(err) {
                    if(err.status == 302) {
                        params.self.$message({
                            duration: 1500,
                            message:  params.self.$t('menu.unLogin')
                            // message: err ? (JSON.parse(err.responseText).value || JSON.parse(err.responseText).error || '用户未登陆' : '用户未登陆'
                        });
                        setTimeout(()=>{
                            window.location.href = '/open/login.html';
                        },500);
                    }else {
                        params.self.$message({
                            duration: 1500,
                            message: err ? (JSON.parse(err.responseText).value || JSON.parse(err.responseText).error || params.self.$t('message.errorInfo')) : params.self.$t('message.errorInfo')
                        });
                        if(params.error) {
                            params.error(res)
                        }
                    }
                },
                complete(msg) {
                    if(params.complete) {
                        params.complete(msg)
                    }
                }
            });
        }
	}
	window.comFn = comFn;
})(window)