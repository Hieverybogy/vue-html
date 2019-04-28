"use strict";
(function (window) {
    var client = null;
    var userId = null;
    var comApush = {
        init() {
            // 设置Apush的js包的日志级别,调试用
            // Apush._loglevel = "info";

            var self = this;
            this.config(data => {
                client = this.createClient(data);
            });
        },
        createClient(data) {
            return Apush.createClient(data.longUrl, this.appMsgHandler);
        },
        getClient() {
            if (!client) {
                console.log("noclient");
                this.init();
            }
            return client;
        },
        config(handler, errorHandler) {
            $.ajax({
                type: "post",
                url: process.env.API_HOST + "/apush/getApushConfig",
                data: {},
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                beforeSend() {
                },
                success(data) {
                    handler(data);
                },
                error(err) {
                },
                complete() {
                }
            });
        },
        appMsgHandler(msg) {
            // console.log("msgHandler:", msg);
            var self = this;
            if (msg.msgType == "tokenExpired") {
                if (msg.topic) {
                    subscribeTopicMsg(msg.topic, data => {
                        client.subscribeTopicMsg(
                            msg.app,
                            msg.topic,
                            data.data.result,
                            this.appMsgHandler
                        );
                    });
                } else {
                    this.subscribeUserMsg(data => {
                        client.subscribeUserMsg(
                            msg.app,
                            data.data.result,
                            this.appMsgHandler
                        );
                    });
                }
            } else if (msg.msgType == "subscribed") {
                client.reqUnReadMsg(client.getMainAppId(), 1000);
            } else if (msg.msgType == "reqUnReadMsgCount") {
                console.log(msg.arg);
            }
        },
        subscribeTopicMsg(topic, handler) {
            var self = this;
            $.ajax({
                type: "post",
                url: process.env.API_HOST + "/apush/getTopicToken",
                data: {
                    topIc: topic
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                beforeSend() {
                },
                success(data) {
                    try {
                        self
                            .getClient()
                            .subscribeTopicMsg(self.getMainAppId(), topic, data, function (
                                msg
                            ) {
                                self.appMsgHandler(msg);
                                handler(msg);
                            });
                    } catch (error) {
                        console.log(error);
                    }
                },
                error(err) {
                    console.log(err);
                },
                complete() {
                }
            });
        },
        subscribeUserMsg(handler) {
            var self = this;
            $.ajax({
                type: "post",
                url: process.env.API_HOST + "/apush/getToken",
                data: {},
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                beforeSend() {
                },
                success(data) {
                    try {
                        self
                            .getClient()
                            .subscribeUserMsg(self.getMainAppId(), data, function (msg) {
                                self.appMsgHandler(msg);
                                handler(msg);
                            });
                    } catch (error) {
                        console.log(error);
                    }
                },
                error(err) {
                    console.log(err);
                },
                complete() {
                }
            });
        },
        getMainAppId() {
            if (client == null) {
                console.log("noclient");
                return null;
            }
            return client.getMainAppId();
        }
    };
    window.comApush = comApush;
    window.apushClient = client;
})(window);
