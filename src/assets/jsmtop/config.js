'use strict';
(function(window) {
	var proConfig = {
		appKey: function() {
			var host = window.location.hostname;
			var param = '49866b21c2b238f7dad601b9892131c4';
			if(host.indexOf('h5.daily.17bxw.com') > -1) {
				param = '3ce7fc6ea4dcc0036294f3ff4a0439fa';
			} else if(host.indexOf('h5.test.17bxw.com') > -1) {
				param = '49866b21c2b238f7dad601b9892131c4';
			} else if(host.indexOf('h5.prepare.17bxw.com') > -1) {
				param = '3e7788f66049765037e21aa56ea4721b146e10968f6711c78abed680b95e1fd1';
			}
			return param
		},
		prefix: function() {
			var param = 'mtop';
			return param
		},
		subDomain: function() {
			var host = window.location.hostname;
			var param = 'online';
			if(host.indexOf('daily') > -1) {
				param = 'daily';
			} else if(host.indexOf('test') > -1) {
				param = 'test';
			} else if(host.indexOf('prepare') > -1) {
				param = 'prepare';
			} else if(host.indexOf('online') > -1) {
				param = 'online';
			}
			return param
		},
		mainDomain: function() {
			var param = '17bxw.com';
			return param
		},
		//微信appid
		appid: function() {
			var param = 'wxf5ab6e832f6c5f9b';
			return param
		},
	}
	window.proConfig = proConfig;
})(window)