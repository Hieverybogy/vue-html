(function(exports, global) {
  /**
   * Apush namespace.
   *
   * @namespace
   */

  var Apush = exports;

  /**
   * Apush version
   *
   * @api public
   */

  Apush.version = "1.0.0";
  Apush._loglevel = "error";

  /**
   * connect.
   *
   * @param {String} url
   * @api public
   */
  Apush.createClient = function(url, eventCb) {
    if (typeof WEB_SOCKET_SWF_LOCATION === "undefined") {
      WEB_SOCKET_SWF_LOCATION =
        "http://style.aliexpress.com/flvplayer/websocketmaininsecure.swf";
    }
    var client = new Apush.Client(url);
    var appId = client.getMainAppId();
    var token = decodeURIComponent(client.getMainToken());

    client.createSocket();
    client.registerMsgHandler(appId, token, eventCb);
    if (!client.socket.isParent() && client.socket.isConnected()) {
      client.socket.send("subscribeUserMsg", {
        app: appId,
        token: token,
        isReconnected: false
      });
    }
    return client;
  };

  /**
   */
  (function(exports, global) {
    /**
     * Expose constructor.
     */

    exports.Client = Client;

    /**
     * Create a new `Socket.IO client` which can establish a persistent
     * connection with a Socket.IO enabled server.
     *
     * @api public
     */

    function Client(url) {
      this.apushUrl = url;

      this.guid = new Date().getTime();
      var paramPos = this.apushUrl.indexOf("?");
      var name = "apush";
      paramPos = this.apushUrl.indexOf("param=");
      var token = this.apushUrl.substring(paramPos + 6, paramPos + 38);
      paramPos = url.indexOf("terminalId=");
      if (paramPos < 0) {
        var ls = window.localStorage,
          terminalId;
        if (ls) {
          terminalId = ls.getItem("apushTerminalId");
          if (null == terminalId) {
            terminalId =
              "" +
              Math.round(Math.random() * 10000) +
              ("" + this.guid).substring(4);
            ls.setItem("apushTerminalId", terminalId);
          }
        } else {
          var matcher = new RegExp("(?:^|; )(apushTerminalId)=([^;]*)").exec(
            document.cookie
          );
          if (matcher) {
            terminalId = io.JSON.parse(decodeURIComponent(matcher[2]));
            var exp = new Date();
            exp.setTime(exp.getTime() + 100 * 24 * 60 * 60 * 1000);
            document.cookie =
              "apushTerminalId=" + terminalId + ";expires=" + exp.toGMTString();
          } else {
            terminalId =
              "" +
              Math.round(Math.random() * 10000) +
              ("" + this.guid).substring(4);
            var exp = new Date();
            exp.setTime(exp.getTime() + 100 * 24 * 60 * 60 * 1000);
            document.cookie =
              "apushTerminalId=" + terminalId + ";expires=" + exp.toGMTString();
          }
        }
        this.terminalId = token.substring(13) + terminalId;
        if (Apush._loglevel === "info") {
          Apush.util.info("terminalId:" + this.terminalId);
        }
        this.apushUrl = this.apushUrl + "&terminalId=" + this.terminalId;
      } else {
        var lastPost = url.indexOf("&", paramPos);
        if (lastPost > 0) {
          this.terminalId = url.substring(paramPos + 11, lastPost);
        } else {
          this.terminalId = url.substring(paramPos + 11);
        }
      }

      if (paramPos > 0) {
        this.name = name + token + this.terminalId;
      } else {
        this.name = name + token;
      }
      this.sharingKey = encodeURIComponent(this.name);

      // Keep track of our msgHandlers
      this.msgHandlers = {};
      this.msgChildHandlers = {};
      var self = this;
      io.util.on(
        global,
        "beforeunload",
        function() {
          self.close();
        },
        false
      );
    }

    /**
     * subscribeUserMsg.
     *
     * @param {String}
     *            app
     * @Param {Function}
     *            callback
     * @api public
     */
    Client.prototype.subscribeUserMsg = function(app, token, callback) {
      if (app.indexOf("_t_") > -1) {
        throw "app can not contain '_t_'";
      }
      var mainAppId = this.getMainAppId();
      if (mainAppId == app) {
        var mainToken = this.getMainToken();
        this.apushUrl = this.apushUrl.replace(
          mainToken,
          encodeURIComponent(token)
        );
      }
      var rt = this.registerMsgHandler(app, token, callback);
      if (!rt) {
        return;
      }
      if (!this.socket.isConnected() && mainAppId == app) {
        this.socket.updateToken(encodeURIComponent(token));
      } else {
        if (
          (mainAppId != app || !this.socket.isParent()) &&
          this.socket.isConnected()
        ) {
          this.socket.send("subscribeUserMsg", {
            app: app,
            token: token,
            isReconnected: false
          });
        }
      }
    };

    /**
     * unSubscribeUserMsg.
     *
     * @param {String}
     *            app
     * @Param {Function}
     *            callback
     * @api public
     */
    Client.prototype.unSubscribeUserMsg = function(app, callback) {
      var rt = this.unRegisterMsgHandler(app, callback);
      if (!rt) {
        return;
      }
      if (this.socket) {
        this.socket.send("unSubscribeUserMsg", app);
      }
    };

    /**
     * subscribeTopicMsg.
     *
     * @param {String} app
     * @param {String} topic
     * @Param {Function} callback
     * @api public
     */
    Client.prototype.subscribeTopicMsg = function(app, topic, token, callback) {
      var msgHandlerName = app + "_t_" + topic;
      var rt = this.registerMsgHandler(msgHandlerName, token, callback);
      if (!rt) {
        return;
      }
      if (this.socket.isConnected()) {
        this.socket.send("subscribeTopicMsg", {
          appTopic: msgHandlerName,
          token: token
        });
      }
    };

    /**
     * unSubscribeTopicMsg.
     *
     * @param {String} app
     * @param {String} topic
     * @Param {Function} callback
     * @api public
     */
    Client.prototype.unSubscribeTopicMsg = function(app, topic, callback) {
      var msgHandlerName = app + "_t_" + topic;
      var rt = this.unRegisterMsgHandler(msgHandlerName, callback);
      if (!rt) {
        return;
      }
      if (this.socket) {
        this.socket.send("unSubscribeTopicMsg", msgHandlerName);
      }
    };

    /**
     * reqUnReadMsgCount.
     *
     * @param {String} app
     * @api public
     */
    Client.prototype.reqUnReadMsgCount = function(app) {
      if (this.socket) {
        var arg = { reqType: "reqUnReadMsgCount", cnt: app };
        this.socket.send("upMsg", arg);
      }
    };

    /**
     * reqUnReadMsg.
     *
     * @param {String} app
     * @param {int} msgCount
     * @api public
     */
    Client.prototype.reqUnReadMsg = function(app, msgCount) {
      if (this.socket) {
        var arg = { reqType: "reqUnReadMsg", cnt: app + "," + msgCount };
        this.socket.send("upMsg", arg);
      }
    };

    /**
     * close.
     *
     * @api public
     */
    Client.prototype.close = function(msg) {
      if (this.socket) {
        this.socket.close();
      }
    };

    /**
     * getMainAppId.
     * @api private
     */
    Client.prototype.getMainAppId = function() {
      var pos = this.apushUrl.indexOf("param=");
      pos = this.apushUrl.indexOf(",", pos + 1);
      var pos2 = this.apushUrl.indexOf(",", pos + 1);
      return this.apushUrl.substring(pos + 1, pos2);
    };

    /**
     * getMainToken.
     * @api private
     */
    Client.prototype.getMainToken = function() {
      var token;
      var pos = this.apushUrl.indexOf("param=");
      pos = this.apushUrl.indexOf(",", pos + 1);
      var pos2 = this.apushUrl.indexOf(",", pos + 1);
      var endPos = this.apushUrl.indexOf("&", pos2 + 1);
      if (endPos > -1) {
        token = this.apushUrl.substring(pos2 + 1, endPos);
      } else {
        token = this.apushUrl.substring(pos2 + 1);
      }
      return token;
    };
    /**
     * dealMsg.
     *
     * @param {Object} msg
     * @api private
     */
    Client.prototype.dealMsg = function(msg) {
      var msgHandlerName = msg.app;
      if (msg.topic) {
        msgHandlerName = msg.app + "_t_" + msg.topic;
      }
      var handler = this.msgHandlers[msgHandlerName];

      if (!handler) {
        return false;
      }

      try {
        if ("tokenExpired" == msg.msgType) {
          delete this.msgHandlers[msgHandlerName];
        }
        handler.fn.call(null, msg);
      } catch (ex) {}

      return true;
    };

    /**
     * dealLocalMsg.
     *
     * @param {Object}
     *            msg
     * @api private
     */
    Client.prototype.dealLocalMsg = function(msg) {
      // TODO
    };

    /**
     * registerMsgHandler.
     *
     * @param {String} msgHandlerName
     * @Param {Function} callback
     * @api private
     */
    Client.prototype.registerMsgHandler = function(msgHandlerName, token, fn) {
      if (!this.msgHandlers[msgHandlerName]) {
        this.msgHandlers[msgHandlerName] = {
          fn: fn,
          token: token
        };
        return true;
      } else {
        this.msgHandlers[msgHandlerName] = {
          fn: fn,
          token: token
        };
        return false;
      }
    };

    /**
     * unRegisterMsgHandler.
     *
     * @param {String}
     *            msgHandlerName
     * @Param {Function}
     *            callback
     * @api private
     */
    Client.prototype.unRegisterMsgHandler = function(msgHandlerName, fn) {
      var list = this.msgHandlers[msgHandlerName];
      if (list) {
        if (list.fn === fn) {
          delete this.msgHandlers[msgHandlerName];
          return true;
        }
      }
      return false;
    };

    /**
     * onconnect.
     *
     * @api private
     */
    Client.prototype.onconnect = function(isParent) {
      var mainAppId = this.getMainAppId();
      for (msgHandlerName in this.msgHandlers) {
        if (msgHandlerName.indexOf("_t_") > 0) {
          this.socket.send("subscribeTopicMsg", {
            appTopic: msgHandlerName,
            token: this.msgHandlers[msgHandlerName].token
          });
        } else {
          if (!isParent || mainAppId != msgHandlerName) {
            this.socket.send("subscribeUserMsg", {
              app: msgHandlerName,
              token: this.msgHandlers[msgHandlerName].token,
              isReconnected: true
            });
          }
        }
      }
      if (isParent) {
        for (msgHandlerName in this.msgChildHandlers) {
          var handler = this.msgHandlers[msgHandlerName];
          if (!handler) {
            if (msgHandlerName.indexOf("_t_") > 0) {
              this.socket.send("subscribeTopicMsg", {
                appTopic: msgHandlerName,
                token: this.msgChildHandlers[msgHandlerName].token
              });
            } else {
              this.socket.send("subscribeUserMsg", {
                app: msgHandlerName,
                token: this.msgChildHandlers[msgHandlerName].token,
                isReconnected: true
              });
            }
          }
        }
      }
    };

    /**
     * createSocket.
     *
     * @api private
     */
    Client.prototype.createSocket = function() {
      var self = this;
      this.storageService = null;
      //if (this.traceTimer) {
      //	clearInterval(this.traceTimer);
      //}
      if (this.socket) {
        this.socket.close();
      }
      var localSocket = this.localConnect();
      if (localSocket != null) {
        if (localSocket.open()) {
          // Local connection.
          this.socket = {
            send: function(eventType, event) {
              localSocket.send(eventType, event);
            },
            isConnected: function() {
              return true;
            },
            isParent: function() {
              return false;
            },
            localSend: function(eventType, event) {
              localSocket.localSend(eventType, event);
            },
            close: function() {
              localSocket.close();
            }
          };
          if (Apush._loglevel === "info") {
            Apush.util.info("client use localSocket");
          }
          return;
        }
        // Wasn't local or an error occurred
        localSocket = null;
      }
      var remoteSocket = io.connect(this.apushUrl, {
        resource: "apush",
        "reconnection limit": 60000,
        "max reconnection attempts": Infinity
        //,'force new connection':true
      });
      this.shareService = this.share();
      remoteSocket.on("connect", function() {
        self.onconnect(true);
        if (self.shareService) {
          self.shareService.onconnect();
        }
      });
      remoteSocket.on("apushMsg", function(msg) {
        if (msg.msgId) {
          remoteSocket.emit("ackMsg", {
            app: msg.app,
            tm: msg.tm,
            msgId: msg.msgId
          });
        }
        self.dealMsg(msg);
        if (self.shareService) {
          if ("tokenExpired" == msg.msgType) {
            var msgHandlerName = msg.app;
            if (msg.topic) {
              msgHandlerName = msg.app + "_t_" + msg.topic;
            }
            if (self.msgChildHandlers[msgHandlerName]) {
              delete self.msgChildHandlers[msgHandlerName];
            }
          }
          self.shareService.signal(msg);
        }
      });
      remoteSocket.on("disconnect", function(reason) {
        if (self.shareService) {
          self.shareService.ondisconnect(reason);
        }
      });
      remoteSocket.on("error", function(data) {
        if (data == "401") {
          //token expired in connect
          var appId = self.getMainAppId();
          var msg = {
            app: appId,
            msgType: "tokenExpired"
          };
          self.dealMsg(msg);
        }
      });
      this.socket = {
        send: function(eventType, event) {
          remoteSocket.emit(eventType, event);
        },
        isConnected: function() {
          return remoteSocket.socket.connected;
        },
        isParent: function() {
          return true;
        },
        localSend: function(eventType, event) {
          if (self.shareService) {
            return self.shareService.localSend(eventType, event);
          }
        },
        updateToken: function(token) {
          var oldQuery = remoteSocket.socket.options.query;
          var pos = oldQuery.lastIndexOf(",");
          var endPos = oldQuery.indexOf("&", pos);

          remoteSocket.socket.options.query =
            oldQuery.substring(0, pos + 1) + token;
          if (endPos > 0) {
            remoteSocket.socket.options.query =
              remoteSocket.socket.options.query + oldQuery.substring(endPos);
          }
        },
        close: function() {
          remoteSocket.disconnect();
          if (self.shareService) {
            self.shareService.close();
          }
        }
      };
    };

    Client.prototype.localConnect = function() {
      var self = this;

      //var traceTimer;
      var trace,
        connector,
        orphan,
        connectors = {
          storage: function() {
            function onstorage(event) {
              if (event.key === self.name && event.newValue) {
                listener(event.newValue);
              }
            }

            if (!Apush.util.storage) {
              return;
            }

            var storage = window.localStorage,
              get = function(key) {
                return io.JSON.parse(storage.getItem(self.name + "-" + key));
              },
              set = function(key, value) {
                storage.setItem(
                  self.name + "-" + key,
                  io.JSON.stringify(value)
                );
              };

            return {
              init: function() {
                var children = get("children");

                var pos = -1;

                for (var i = 0, l = children.length; i < l; i++) {
                  if (children[i] == self.guid) {
                    pos = i;
                    break;
                  }
                }

                if (pos == -1) {
                  set("children", children.concat([self.guid]));
                }
                io.util.on(window, "storage", onstorage);
                //return get("opened");
                return true;
              },
              signal: function(type, data) {
                var target;
                if (type === "localMessage") {
                  target = "p&c";
                } else {
                  target = "p";
                }
                storage.setItem(
                  self.name,
                  io.JSON.stringify({
                    tt: new Date().getTime(),
                    target: target,
                    type: type,
                    data: data
                  })
                );
              },
              close: function() {
                // signal parent to unsubscribe all
                storage.setItem(
                  self.name,
                  io.JSON.stringify({
                    tt: new Date().getTime(),
                    target: "p",
                    type: "childClose",
                    data: self.guid
                  })
                );
                var children = get("children");
                if (children) {
                  if (removeFromArray(children, self.guid)) {
                    set("children", children);
                  }
                }
                Apush.util.off(window, "storage", onstorage);
              }
            };
          },
          windowref: function() {
            var win = window.open("", self.name.replace(/\W/g, ""));

            if (!win || win.closed || !win.callbacks) {
              return;
            }

            return {
              init: function() {
                win.callbacks.push(listener);
                var children = win.children;

                var pos = -1;

                for (var i = 0, l = children.length; i < l; i++) {
                  if (children[i] == self.guid) {
                    pos = i;
                    break;
                  }
                }

                if (pos == -1) {
                  win.children.push(self.guid);
                }

                return !win.closed;
              },
              signal: function(type, data) {
                try {
                  if (!win.closed && win.fire) {
                    var target;
                    if (type === "localMessage") {
                      target = "p&c";
                    } else {
                      target = "p";
                    }
                    win.fire(
                      io.JSON.stringify({
                        target: target,
                        type: type,
                        data: data
                      })
                    );
                  }
                } catch (ex) {}
              },
              close: function() {
                // Removes traces only if the parent is alive
                if (!orphan) {
                  // signal parent to unsubscribe all
                  try {
                    win.fire(
                      io.JSON.stringify({
                        target: "p",
                        type: "childClose",
                        data: self.guid
                      })
                    );
                    removeFromArray(win.callbacks, listener);
                    removeFromArray(win.children, self.guid);
                  } catch (ex) {}
                }
              }
            };
          }
        };

      function removeFromArray(array, val) {
        var i,
          length = array.length;

        for (i = 0; i < length; i++) {
          if (array[i] === val) {
            array.splice(i, 1);
          }
        }

        return length !== array.length;
      }

      // Receives open, close and message command from the parent
      function listener(string) {
        var command = io.JSON.parse(string),
          data = command.data;

        if (command.target === "c" || command.target === "p&c") {
          switch (command.type) {
            case "parentConnect":
              //setTimeout(function() {
              //			self.onconnect(false);
              //		}, 50);
              break;
            case "parentDisconnect":
              // do nothing
              break;
            case "parentClose":
              if (Apush._loglevel === "info") {
                Apush.util.info(
                  "parent close:" + data.parentId + ",heir:" + data.heir
                );
              }
              if (!trace || data.parentId == trace.parentId) {
                if (!orphan) {
                  orphan = true;
                  //clearInterval(traceTimer);
                  // Gives the heir some time to reconnect
                  if (data.heir == self.guid) {
                    self.createSocket();
                  } else {
                    setTimeout(function() {
                      self.createSocket();
                    }, 100);
                  }
                }
              }
              break;
            case "message":
              if (data.parentId == trace.parentId) {
                self.dealMsg(data.data);
              }
              break;
            case "localMessage":
              if (data.fromId != self.guid) {
                self.dealLocalMsg(data.eventType, data.data);
              }
              break;
          }
        }
      }

      function findTrace() {
        var matcher = new RegExp(
          "(?:^|; )(" + self.sharingKey + ")=([^;]*)"
        ).exec(document.cookie);
        if (matcher) {
          return io.JSON.parse(decodeURIComponent(matcher[2]));
        }
      }

      // Finds and validates the parent socket's trace from the cookie
      trace = findTrace();
      var cur = new Date().getTime();
      if (!trace || cur - trace.ts > 3000) {
        if (Apush._loglevel === "info") {
          var oldTs;
          if (trace) {
            oldTs = trace.ts;
          }
          Apush.util.info("findTrace fail,traceTime:" + oldTs + ",cur:" + cur);
        }
        return;
      }

      // Chooses a connector
      connector = connectors.storage() || connectors.windowref();
      //connector = connectors.storage() ;
      if (!connector) {
        return;
      }

      return {
        open: function() {
          var parentOpened;

          var traceTimeout = function() {
            if (connector.isClosed) {
              return;
            }
            var oldTrace = trace;
            trace = findTrace();
            if (!trace || oldTrace.ts === trace.ts) {
              // Simulates a close signal
              if (Apush._loglevel === "info") {
                var cur = new Date().getTime();
                var tracets = "undefine";
                if (trace) {
                  tracets = trace.ts;
                }
                Apush.util.info(
                  "trace fail,parent closed,oldTime:" +
                    oldTrace.ts +
                    ",newTime:" +
                    tracets +
                    ",cur:" +
                    cur
                );
              }
              listener(
                io.JSON.stringify({
                  target: "c",
                  type: "parentClose",
                  data: {
                    parentId: oldTrace.parentId,
                    reason: "error",
                    heir: oldTrace.heir
                  }
                })
              );
              return;
            } else if (oldTrace.parentId != trace.parentId) {
              if (Apush._loglevel === "info") {
                Apush.util.info("trace fail,parent changed");
              }
              if (!orphan) {
                orphan = true;
                self.createSocket();
              }
              return;
            }
            if (Apush._loglevel === "info") {
              var cur = new Date().getTime();
              Apush.util.info(
                "trace ok,oldTime:" +
                  oldTrace.ts +
                  ",newTime:" +
                  trace.ts +
                  ",cur:" +
                  cur
              );
            }
            setTimeout(traceTimeout, 3000);
          };
          // Checks the parent is alive
          setTimeout(traceTimeout, 3000);

          parentOpened = connector.init();
          if (parentOpened) {
            // Firing the open event without delay robs the user of
            // the opportunity to bind connecting event handlers
            setTimeout(function() {
              self.onconnect(false);
            }, 50);
          }
          return parentOpened;
        },
        send: function(eventType, event) {
          var eventWrap = {
            parentId: trace.parentId,
            childId: self.guid,
            eventType: eventType,
            data: event
          };
          connector.signal("send", eventWrap);
        },
        localSend: function(event) {
          var eventWrap = {
            fromId: self.guid,
            eventType: eventType,
            data: event
          };
          connector.signal("localMessage", eventWrap);
        },
        close: function() {
          //clearInterval(traceTimer);
          connector.isClosed = true;
          connector.close();
          if (Apush._loglevel === "info") {
            Apush.util.info("client closed");
          }
        }
      };
    };
    Client.prototype.share = function() {
      var self = this;
      var storageService,
        servers = {
          storage: function() {
            function onstorage(event) {
              // When a deletion, newValue initialized to null
              if (event.key === self.name && event.newValue) {
                listener(event.newValue);
              }
            }

            if (!Apush.util.storage) {
              return;
            }

            var storage = window.localStorage;

            return {
              init: function() {
                // Handles the storage event
                io.util.on(window, "storage", onstorage);
              },
              signal: function(type, data) {
                var target;
                if (type === "localMessage") {
                  target = "p&c";
                } else {
                  target = "c";
                }
                storage.setItem(
                  self.name,
                  io.JSON.stringify({
                    tt: new Date().getTime(),
                    target: target,
                    type: type,
                    data: data
                  })
                );
              },
              get: function(key) {
                return io.JSON.parse(storage.getItem(self.name + "-" + key));
              },
              set: function(key, value) {
                storage.setItem(
                  self.name + "-" + key,
                  io.JSON.stringify(value)
                );
              },
              close: function() {
                Apush.util.off(window, "storage", onstorage);
                storage.removeItem(self.name);
                //storage.removeItem(self.name + "-children");
              }
            };
          },
          // Powered by the window.open method
          // https://developer.mozilla.org/en/DOM/window.open
          windowref: function() {
            // Internet Explorer raises an invalid argument error
            // when calling the window.open method with the name containing non-word characters
            var neim = self.name.replace(/\W/g, ""),
              container = document.getElementById(neim),
              win;

            if (!container) {
              container = document.createElement("div");
              container.id = neim;
              container.style.display = "none";
              container.innerHTML = '<iframe name="' + neim + '" />';
              document.body.appendChild(container);
            }

            win = container.firstChild.contentWindow;

            return {
              init: function() {
                // Callbacks from different windows
                win.callbacks = [listener];
                // In IE 8 and less, only string argument can be
                // safely passed to the function in other window
                win.fire = function(string) {
                  var i;

                  for (i = 0; i < win.callbacks.length; i++) {
                    try {
                      win.callbacks[i](string);
                    } catch (ex) {}
                  }
                };
              },
              signal: function(type, data) {
                if (!win.closed && win.fire) {
                  var target;
                  if (type === "localMessage") {
                    target = "p&c";
                  } else {
                    target = "c";
                  }
                  win.fire(
                    io.JSON.stringify({
                      target: target,
                      type: type,
                      data: data
                    })
                  );
                }
              },
              get: function(key) {
                return !win.closed ? win[key] : null;
              },
              set: function(key, value) {
                if (!win.closed) {
                  win[key] = value;
                }
              },
              close: function() {
                // do nothing
              }
            };
          }
        };

      function registerMsgChild(msgHandlerName, token, childId) {
        if (!self.msgChildHandlers[msgHandlerName]) {
          self.msgChildHandlers[msgHandlerName] = {
            token: token,
            childIds: [childId]
          };
          return true;
        } else {
          self.msgChildHandlers[msgHandlerName].token = token;
          var list = self.msgChildHandlers[msgHandlerName].childIds;
          var pos = -1;

          for (var i = 0, l = list.length; i < l; i++) {
            if (list[i] === childId) {
              pos = i;
              break;
            }
          }

          if (pos >= 0) {
            return false;
          }
          self.msgChildHandlers[msgHandlerName].childIds.push(childId);
          return true;
        }
      }
      function unRegisterMsgChild(msgHandlerName, childId) {
        var list = self.msgChildHandlers[msgHandlerName].childIds;
        if (list) {
          var pos = -1;

          for (var i = 0, l = list.length; i < l; i++) {
            if (list[i] === childId) {
              pos = i;
              break;
            }
          }

          if (pos < 0) {
            return false;
          }

          list.splice(pos, 1);

          if (!list.length) {
            delete self.msgChildHandlers[msgHandlerName];
            return true;
          }
          return false;
        }
        return true;
      }

      function unRegisterMsgChildAll(childId) {
        for (msgHandlerName in self.msgChildHandlers) {
          var list = self.msgChildHandlers[msgHandlerName].childIds;
          if (list) {
            var pos = -1;

            for (var i = list.length - 1; i >= 0; i--) {
              if (list[i] === childId) {
                list.splice(pos, 1);
              }
            }

            if (!list.length) {
              delete self.msgChildHandlers[msgHandlerName];
              var handler = self.msgHandlers[msgHandlerName];
              if (!handler) {
                if (msgHandlerName.indexOf("_t_") > 0) {
                  self.socket.send("unSubscribeTopicMsg", msgHandlerName);
                } else {
                  self.socket.send("unSubscribeUserMsg", msgHandlerName);
                }
              }
            }
          }
        }
      }
      // Receives send and close command from the children
      function listener(string) {
        var command = io.JSON.parse(string),
          data = command.data;

        if (command.target === "p" || command.target === "p&c") {
          switch (command.type) {
            case "send":
              if (data.parentId == self.guid) {
                if (data.eventType === "subscribeUserMsg") {
                  var msgHandlerName = data.data.app;
                  var rt = registerMsgChild(
                    msgHandlerName,
                    data.data.token,
                    data.childId
                  );
                  if (rt) {
                    var handler = self.msgHandlers[msgHandlerName];
                    if (!handler) {
                      self.socket.send(data.eventType, data.data);
                    }
                  }
                } else if (data.eventType === "subscribeTopicMsg") {
                  var msgHandlerName = data.data.appTopic;
                  var rt = registerMsgChild(
                    msgHandlerName,
                    data.data.token,
                    data.childId
                  );
                  if (rt) {
                    var handler = self.msgHandlers[msgHandlerName];
                    if (!handler) {
                      self.socket.send(data.eventType, data.data);
                    }
                  }
                } else if (
                  data.eventType === "unSubscribeUserMsg" ||
                  data.eventType === "unSubscribeTopicMsg"
                ) {
                  var rt = unRegisterMsgChild(data.data, data.childId);
                  if (rt) {
                    var handler = self.msgHandlers[data.data];
                    if (!handler) {
                      self.socket.send(data.eventType, data.data);
                    }
                  }
                } else {
                  self.socket.send(data.eventType, data.data);
                }
              }
              break;
            case "localMessage":
              if (data.fromId != self.guid) {
                self.dealLocalMsg(data.eventType, data.data);
              }
              break;
            case "clildClose":
              unRegisterMsgChildAll(data.data);
              break;
          }
        }
      }

      function findTrace() {
        var matcher = new RegExp(
          "(?:^|; )(" + self.sharingKey + ")=([^;]*)"
        ).exec(document.cookie);
        if (matcher) {
          return io.JSON.parse(decodeURIComponent(matcher[2]));
        }
      }
      function clearTrace() {
        var trace = findTrace();
        if (trace && trace.parentId === self.guid) {
          document.cookie =
            self.sharingKey +
            "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
        }
      }

      function leaveTrace() {
        if (storageService.isClosed) {
          return;
        }
        var cur = new Date().getTime();
        //if (Apush._loglevel === 'info') {
        //	Apush.util.info("leaveTrace1:" + cur);
        //}
        // get cur trace if self guif > trace then skip
        var trace = findTrace();
        // 	if an old heir exists then this don't share
        //可能存在多个连接，但是只允许一个发出心跳
        if (trace && trace.parentId < self.guid && cur - trace.ts <= 3000) {
          //if (self.traceTimer){
          //	clearInterval(self.traceTimer);
          //}

          if (Apush._loglevel === "info") {
            Apush.util.info(
              "leaveTrace failed,newId:" +
                trace.parentId +
                ",newTime:" +
                trace.ts +
                ",oldId:" +
                self.guid +
                ",oldTime:" +
                trace.ts +
                ",curTime:" +
                cur
            );
          }
          setTimeout(leaveTrace, 1000);
          return;
        }
        document.cookie =
          self.sharingKey +
          "=" +
          // Opera's JSON implementation ignores a number whose a last digit of 0 strangely
          // but has no problem with a number whose a last digit of 9 + 1
          encodeURIComponent(
            io.JSON.stringify({
              ts: cur + 1,
              heir: (storageService.get("children") || [])[0],
              parentId: self.guid
            })
          ) +
          "; path=/";

        //if (Apush._loglevel === 'info') {
        //	Apush.util.info("leaveTrace:" + cur);
        //}
        setTimeout(leaveTrace, 1000);
      }

      // Chooses a storageService
      storageService = servers.storage() || servers.windowref();
      //storageService = servers.storage();
      if (!storageService) {
        return;
      }
      storageService.init();

      if (Apush._loglevel === "info") {
        Apush.util.info("Installed StorageService ");
      }

      // List of children sockets
      storageService.set("children", []);
      // reset childRegistInfo
      self.msgChildHandlers = {};
      // Leaves traces
      leaveTrace();

      //self.traceTimer = setInterval(leaveTrace, 1000);

      return {
        ondisconnect: function() {
          storageService.signal("parentDisconnect", self.guid);
        },
        onconnect: function() {
          storageService.signal("parentConnect", self.guid);
        },
        signal: function(msg) {
          var eventWrap = {
            parentId: self.guid,
            data: msg
          };
          storageService.signal("message", eventWrap);
        },
        localSend: function(eventType, event) {
          var eventWrap = {
            fromId: self.guid,
            eventType: eventType,
            data: event
          };

          storageService.signal("localMessage", eventWrap);
        },
        close: function() {
          storageService.isClosed = true;
          clearTrace();
          // signal child to recreate Socket
          var data = {
            parentId: self.guid,
            reason: "error",
            heir: (storageService.get("children") || [])[0]
          };
          storageService.signal("parentClose", data);
          storageService.close();
        }
      };
    };
  })("undefined" != typeof Apush ? Apush : module.exports, this);
})("object" === typeof module ? module.exports : (this.Apush = {}), this);

(function(exports, global) {
  var util = (exports.util = {
    off: function(elem, type, fn) {
      if (elem.removeEventListener) {
        elem.removeEventListener(type, fn, false);
      } else if (elem.detachEvent) {
        elem.detachEvent("on" + type, fn);
      }
    },
    info: function(arg) {
      Apush.util.console.info(arg);
    },
    error: function(arg) {
      Apush.util.console.error(arg);
    },
    browser: {},
    storage: !!(window.localStorage && window.StorageEvent)
  });
  var ua = navigator.userAgent.toLowerCase(),
    match =
      /(chrome)[ \/]([\w.]+)/.exec(ua) ||
      /(webkit)[ \/]([\w.]+)/.exec(ua) ||
      /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
      /(msie) ([\w.]+)/.exec(ua) ||
      /(trident)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
      (ua.indexOf("compatible") < 0 &&
        /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua)) ||
      [];

  util.browser[match[1] || ""] = true;
  util.browser.version = match[2] || "0";

  // Trident is the layout engine of the Internet Explorer
  // IE 11 has no "MSIE: 11.0" token
  if (util.browser.trident) {
    util.browser.msie = true;
  }

  // The storage event of Internet Explorer and Firefox 3 works strangely
  if (
    util.browser.msie ||
    (util.browser.mozilla && util.browser.version.split(".")[0] === "1")
  ) {
    util.storage = false;
  }
  var console = window.console;
  if (!console || !console.log || !console.error) {
    console = {
      info: function() {},
      error: function() {}
    };
  }
  util.console = console;
})("undefined" != typeof Apush ? Apush : module.exports, this);
