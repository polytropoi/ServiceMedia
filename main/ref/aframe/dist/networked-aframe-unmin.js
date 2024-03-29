! function(e) {
    var t = {};

    function n(i) {
        if (t[i]) return t[i].exports;
        var o = t[i] = {
            i: i,
            l: !1,
            exports: {}
        };
        return e[i].call(o.exports, o, o.exports, n), o.l = !0, o.exports
    }
    n.m = e, n.c = t, n.d = function(e, t, i) {
        n.o(e, t) || Object.defineProperty(e, t, {
            enumerable: !0,
            get: i
        })
    }, n.r = function(e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(e, "__esModule", {
            value: !0
        })
    }, n.t = function(e, t) {
        if (1 & t && (e = n(e)), 8 & t) return e;
        if (4 & t && "object" == typeof e && e && e.__esModule) return e;
        var i = Object.create(null);
        if (n.r(i), Object.defineProperty(i, "default", {
                enumerable: !0,
                value: e
            }), 2 & t && "string" != typeof e)
            for (var o in e) n.d(i, o, function(t) {
                return e[t]
            }.bind(null, o));
        return i
    }, n.n = function(e) {
        var t = e && e.__esModule ? function() {
            return e.default
        } : function() {
            return e
        };
        return n.d(t, "a", t), t
    }, n.o = function(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }, n.p = "", n(n.s = 1)
}([function(e, t, n) {
    "use strict";
    var i = n(2),
        o = n(3),
        s = n(4),
        r = n(5),
        a = n(6),
        c = n(8),
        u = n(9),
        l = {
            app: "",
            room: "",
            clientId: ""
        };
    l.options = i, l.utils = o, l.log = new s, l.schemas = new r, l.version = "0.6.1", l.adapters = new u;
    var h = new a,
        d = new c(h);
    l.connection = d, l.entities = h, e.exports = window.NAF = l
}, function(e, t, n) {
    "use strict";
    n(0), n(12), n(13), n(16)
}, function(e, t, n) {
    "use strict";
    e.exports = {
        debug: !1,
        updateRate: 15,
        useLerp: !0,
        firstSyncSource: null,
        syncSource: null
    }
}, function(e, t, n) {
    "use strict";
    e.exports.whenEntityLoaded = function(e, t) {
        e.hasLoaded && t(), e.addEventListener("loaded", (function() {
            t()
        }))
    }, e.exports.createHtmlNodeFromString = function(e) {
        var t = document.createElement("div");
        return t.innerHTML = e, t.firstChild
    }, e.exports.getCreator = function(e) {
        var t = e.components;
        return t.networked ? t.networked.data.creator : null
    }, e.exports.getNetworkOwner = function(e) {
        var t = e.components;
        return t.networked ? t.networked.data.owner : null
    }, e.exports.getNetworkId = function(e) {
        var t = e.components;
        return t.networked ? t.networked.data.networkId : null
    }, e.exports.now = function() {
        return Date.now()
    }, e.exports.createNetworkId = function() {
        return Math.random().toString(36).substring(2, 9)
    }, e.exports.getNetworkedEntity = function(e) {
        return new Promise((function(t, n) {
            for (var i = e; i && i.components && !i.components.networked;) i = i.parentNode;
            if (!i || !i.components || !i.components.networked) return n("Entity does not have and is not a child of an entity with the [networked] component ");
            i.hasLoaded ? t(i) : i.addEventListener("instantiated", (function() {
                t(i)
            }), {
                once: !0
            })
        }))
    }, e.exports.takeOwnership = function(e) {
        for (var t = e; t && t.components && !t.components.networked;) t = t.parentNode;
        if (!t || !t.components || !t.components.networked) throw new Error("Entity does not have and is not a child of an entity with the [networked] component ");
        return t.components.networked.takeOwnership()
    }, e.exports.isMine = function(e) {
        for (var t = e; t && t.components && !t.components.networked;) t = t.parentNode;
        if (!t || !t.components || !t.components.networked) throw new Error("Entity does not have and is not a child of an entity with the [networked] component ");
        return t.components.networked.data.owner === NAF.clientId
    }, e.exports.almostEqualVec3 = function(e, t, n) {
        return Math.abs(e.x - t.x) < n && Math.abs(e.y - t.y) < n && Math.abs(e.z - t.z) < n
    }
}, function(e, t, n) {
    "use strict";

    function i(e, t) {
        for (var n = 0; n < t.length; n++) {
            var i = t[n];
            i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
        }
    }
    var o = function() {
        function e() {
            ! function(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }(this, e), this.debug = !1
        }
        var t, n, o;
        return t = e, (n = [{
            key: "setDebug",
            value: function(e) {
                this.debug = e
            }
        }, {
            key: "write",
            value: function() {
                this.debug && console.log.apply(this, arguments)
            }
        }, {
            key: "warn",
            value: function() {
                console.warn.apply(this, arguments)
            }
        }, {
            key: "error",
            value: function() {
                console.error.apply(this, arguments)
            }
        }]) && i(t.prototype, n), o && i(t, o), e
    }();
    e.exports = o
}, function(e, t, n) {
    "use strict";

    function i(e, t) {
        for (var n = 0; n < t.length; n++) {
            var i = t[n];
            i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
        }
    }
    var o = function() {
        function e() {
            ! function(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }(this, e), this.schemaDict = {}, this.templateCache = {}
        }
        var t, n, o;
        return t = e, (n = [{
            key: "createDefaultSchema",
            value: function(e) {
                return {
                    template: e,
                    components: ["position", "rotation"]
                }
            }
        }, {
            key: "add",
            value: function(e) {
                if (this.validateSchema(e)) {
                    this.schemaDict[e.template] = e;
                    var t = document.querySelector(e.template);
                    if (!t) return void NAF.log.error("Template el not found for ".concat(e.template, ", make sure NAF.schemas.add is called after <a-scene> is defined."));
                    if (!this.validateTemplate(e, t)) return;
                    this.templateCache[e.template] = document.importNode(t.content, !0)
                } else NAF.log.error("Schema not valid: ", e), NAF.log.error("See https://github.com/haydenjameslee/networked-aframe#syncing-custom-components")
            }
        }, {
            key: "getCachedTemplate",
            value: function(e) {
                return this.templateIsCached(e) || (this.templateExistsInScene(e) ? this.add(this.createDefaultSchema(e)) : NAF.log.error("Template el for ".concat(e, " is not in the scene, add the template to <a-assets> and register with NAF.schemas.add."))), this.templateCache[e].firstElementChild.cloneNode(!0)
            }
        }, {
            key: "templateIsCached",
            value: function(e) {
                return !!this.templateCache[e]
            }
        }, {
            key: "getComponents",
            value: function(e) {
                var t = ["position", "rotation"];
                return this.hasTemplate(e) && (t = this.schemaDict[e].components), t
            }
        }, {
            key: "hasTemplate",
            value: function(e) {
                return !!this.schemaDict[e]
            }
        }, {
            key: "templateExistsInScene",
            value: function(e) {
                var t = document.querySelector(e);
                return t && this.isTemplateTag(t)
            }
        }, {
            key: "validateSchema",
            value: function(e) {
                return !(!e.template || !e.components)
            }
        }, {
            key: "validateTemplate",
            value: function(e, t) {
                return this.isTemplateTag(t) ? !!this.templateHasOneOrZeroChildren(t) || (NAF.log.error("Template for ".concat(e.template, " has more than one child. Templates must have one direct child element, no more. Template found:"), t), !1) : (NAF.log.error("Template for ".concat(e.template, " is not a <template> tag. Instead found: ").concat(t.tagName)), !1)
            }
        }, {
            key: "isTemplateTag",
            value: function(e) {
                return "template" === e.tagName.toLowerCase()
            }
        }, {
            key: "templateHasOneOrZeroChildren",
            value: function(e) {
                return e.content.childElementCount < 2
            }
        }, {
            key: "remove",
            value: function(e) {
                delete this.schemaDict[e]
            }
        }, {
            key: "clear",
            value: function() {
                this.schemaDict = {}
            }
        }]) && i(t.prototype, n), o && i(t, o), e
    }();
    e.exports = o
}, function(e, t, n) {
    "use strict";

    function i(e, t) {
        for (var n = 0; n < t.length; n++) {
            var i = t[n];
            i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
        }
    }
    var o = n(7),
        s = function() {
            function e() {
                ! function(e, t) {
                    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                }(this, e), this.entities = {}, this.childCache = new o, this.onRemoteEntityCreatedEvent = new Event("remoteEntityCreated"), this._persistentFirstSyncs = {}
            }
            var t, n, s;
            return t = e, (n = [{
                key: "registerEntity",
                value: function(e, t) {
                    this.entities[e] = t
                }
            }, {
                key: "createRemoteEntity",
                value: function(e) {
                    NAF.log.write("Creating remote entity", e);
                    var t = e.networkId,
                        n = NAF.schemas.getCachedTemplate(e.template);
                    return n.setAttribute("id", "naf-" + t), this.initPosition(n, e.components), this.initRotation(n, e.components), this.addNetworkComponent(n, e), this.registerEntity(t, n), n
                }
            }, {
                key: "initPosition",
                value: function(e, t) {
                    if (t.position) {
                        var n = t.position;
                        e.setAttribute("position", n)
                    }
                }
            }, {
                key: "initRotation",
                value: function(e, t) {
                    if (t.rotation) {
                        var n = t.rotation;
                        e.setAttribute("rotation", n)
                    }
                }
            }, {
                key: "addNetworkComponent",
                value: function(e, t) {
                    var n = {
                        template: t.template,
                        creator: t.creator,
                        owner: t.owner,
                        networkId: t.networkId,
                        persistent: t.persistent
                    };
                    e.setAttribute("networked", n), e.firstUpdateData = t
                }
            }, {
                key: "updateEntityMulti",
                value: function(e, t, n, i) {
                    if (!NAF.options.syncSource || i === NAF.options.syncSource)
                        for (var o = 0, s = n.d.length; o < s; o++) this.updateEntity(e, "u", n.d[o], i)
                }
            }, {
                key: "updateEntity",
                value: function(e, t, n, i) {
                    if (!NAF.options.syncSource || i === NAF.options.syncSource) {
                        var o = n.networkId;
                        this.hasEntity(o) ? this.entities[o].components.networked.networkUpdate(n) : n.isFirstSync && (NAF.options.firstSyncSource && i !== NAF.options.firstSyncSource ? NAF.log.write("Ignoring first sync from disallowed source", i) : n.persistent ? this._persistentFirstSyncs[o] = n : this.receiveFirstUpdateFromEntity(n))
                    }
                }
            }, {
                key: "receiveFirstUpdateFromEntity",
                value: function(e) {
                    var t = e.parent,
                        n = e.networkId;
                    if (t && !this.hasEntity(t)) this.childCache.addChild(t, e);
                    else {
                        var i = this.createRemoteEntity(e);
                        this.createAndAppendChildren(n, i), this.addEntityToPage(i, t)
                    }
                }
            }, {
                key: "createAndAppendChildren",
                value: function(e, t) {
                    for (var n = this.childCache.getChildren(e), i = 0; i < n.length; i++) {
                        var o = n[i],
                            s = o.networkId;
                        if (this.hasEntity(s)) NAF.log.warn("Tried to instantiate entity multiple times", s, o, "Existing entity:", this.getEntity(s));
                        else {
                            var r = this.createRemoteEntity(o);
                            this.createAndAppendChildren(s, r), t.appendChild(r)
                        }
                    }
                }
            }, {
                key: "addEntityToPage",
                value: function(e, t) {
                    this.hasEntity(t) ? this.addEntityToParent(e, t) : this.addEntityToSceneRoot(e)
                }
            }, {
                key: "addEntityToParent",
                value: function(e, t) {
                    document.getElementById("naf-" + t).appendChild(e)
                }
            }, {
                key: "addEntityToSceneRoot",
                value: function(e) {
                    document.querySelector("a-scene").appendChild(e)
                }
            }, {
                key: "completeSync",
                value: function(e, t) {
                    for (var n in this.entities) this.entities[n] && this.entities[n].components.networked.syncAll(e, t)
                }
            }, {
                key: "removeRemoteEntity",
                value: function(e, t, n, i) {
                    if (!NAF.options.syncSource || i === NAF.options.syncSource) {
                        var o = n.networkId;
                        return this.removeEntity(o)
                    }
                }
            }, {
                key: "removeEntitiesOfClient",
                value: function(e) {
                    var t = [];
                    for (var n in this.entities)
                        if (NAF.utils.getCreator(this.entities[n]) === e) {
                            var i = void 0,
                                o = this.entities[n].getAttribute("networked");
                            if (o && o.persistent && (i = NAF.utils.takeOwnership(this.entities[n])), !i) {
                                var s = this.removeEntity(n);
                                t.push(s)
                            }
                        } return t
                }
            }, {
                key: "removeEntity",
                value: function(e) {
                    if (this.forgetPersistentFirstSync(e), this.hasEntity(e)) {
                        var t = this.entities[e];
                        return this.forgetEntity(e), t.parentNode.removeChild(t), t
                    }
                    return NAF.log.error("Tried to remove entity I don't have."), null
                }
            }, {
                key: "forgetEntity",
                value: function(e) {
                    delete this.entities[e], this.forgetPersistentFirstSync(e)
                }
            }, {
                key: "getPersistentFirstSync",
                value: function(e) {
                    return this._persistentFirstSyncs[e]
                }
            }, {
                key: "forgetPersistentFirstSync",
                value: function(e) {
                    delete this._persistentFirstSyncs[e]
                }
            }, {
                key: "getEntity",
                value: function(e) {
                    return this.entities[e] ? this.entities[e] : null
                }
            }, {
                key: "hasEntity",
                value: function(e) {
                    return !!this.entities[e]
                }
            }, {
                key: "removeRemoteEntities",
                value: function() {
                    for (var e in this.childCache = new o, this.entities) this.entities[e].getAttribute("networked").owner != NAF.clientId && this.removeEntity(e)
                }
            }]) && i(t.prototype, n), s && i(t, s), e
        }();
    e.exports = s
}, function(e, t, n) {
    "use strict";

    function i(e, t) {
        for (var n = 0; n < t.length; n++) {
            var i = t[n];
            i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
        }
    }
    var o = function() {
        function e() {
            ! function(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }(this, e), this.dict = {}
        }
        var t, n, o;
        return t = e, (n = [{
            key: "addChild",
            value: function(e, t) {
                this.hasParent(e) || (this.dict[e] = []), this.dict[e].push(t)
            }
        }, {
            key: "getChildren",
            value: function(e) {
                if (!this.hasParent(e)) return [];
                var t = this.dict[e];
                return delete this.dict[e], t
            }
        }, {
            key: "hasParent",
            value: function(e) {
                return !!this.dict[e]
            }
        }]) && i(t.prototype, n), o && i(t, o), e
    }();
    e.exports = o
}, function(e, t, n) {
    "use strict";

    function i(e, t) {
        for (var n = 0; n < t.length; n++) {
            var i = t[n];
            i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
        }
    }
    var o = "u",
        s = "um",
        r = "r",
        a = function() {
            function e(t) {
                ! function(e, t) {
                    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                }(this, e), this.entities = t, this.setupDefaultDataSubscriptions(), this.connectedClients = {}, this.activeDataChannels = {}
            }
            var t, n, a;
            return t = e, (n = [{
                key: "setNetworkAdapter",
                value: function(e) {
                    this.adapter = e
                }
            }, {
                key: "setupDefaultDataSubscriptions",
                value: function() {
                    this.dataChannelSubs = {}, this.dataChannelSubs[o] = this.entities.updateEntity.bind(this.entities), this.dataChannelSubs[s] = this.entities.updateEntityMulti.bind(this.entities), this.dataChannelSubs[r] = this.entities.removeRemoteEntity.bind(this.entities)
                }
            }, {
                key: "connect",
                value: function(e, t, n) {
                    var i = arguments.length > 3 && void 0 !== arguments[3] && arguments[3];
                    NAF.app = t, NAF.room = n, this.adapter.setServerUrl(e), this.adapter.setApp(t), this.adapter.setRoom(n);
                    var o = {
                        audio: i,
                        video: !1,
                        datachannel: !0
                    };
                    return this.adapter.setWebRtcOptions(o), this.adapter.setServerConnectListeners(this.connectSuccess.bind(this), this.connectFailure.bind(this)), this.adapter.setDataChannelListeners(this.dataChannelOpen.bind(this), this.dataChannelClosed.bind(this), this.receivedData.bind(this)), this.adapter.setRoomOccupantListener(this.occupantsReceived.bind(this)), this.adapter.connect()
                }
            }, {
                key: "onConnect",
                value: function(e) {
                    this.onConnectCallback = e, this.isConnected() ? e() : document.body.addEventListener("connected", e, !1)
                }
            }, {
                key: "connectSuccess",
                value: function(e) {
                    NAF.log.write("Networked-Aframe Client ID:", e), NAF.clientId = e;
                    var t = new CustomEvent("connected", {
                        detail: {
                            clientId: e
                        }
                    });
                    document.body.dispatchEvent(t)
                }
            }, {
                key: "connectFailure",
                value: function(e, t) {
                    NAF.log.error(e, "failure to connect")
                }
            }, {
                key: "occupantsReceived",
                value: function(e) {
                    var t = Object.assign({}, this.connectedClients);
                    this.connectedClients = e, this.checkForDisconnectingClients(t, e), this.checkForConnectingClients(e)
                }
            }, {
                key: "checkForDisconnectingClients",
                value: function(e, t) {
                    for (var n in e) t[n] || (NAF.log.write("Closing stream to ", n), this.adapter.closeStreamConnection(n))
                }
            }, {
                key: "checkForConnectingClients",
                value: function(e) {
                    for (var t in e) this.isNewClient(t) && this.adapter.shouldStartConnectionTo(e[t]) && (NAF.log.write("Opening datachannel to ", t), this.adapter.startStreamConnection(t))
                }
            }, {
                key: "getConnectedClients",
                value: function() {
                    return this.connectedClients
                }
            }, {
                key: "isConnected",
                value: function() {
                    return !!NAF.clientId
                }
            }, {
                key: "isMineAndConnected",
                value: function(e) {
                    return this.isConnected() && NAF.clientId === e
                }
            }, {
                key: "isNewClient",
                value: function(e) {
                    return !this.isConnectedTo(e)
                }
            }, {
                key: "isConnectedTo",
                value: function(e) {
                    return this.adapter.getConnectStatus(e) === NAF.adapters.IS_CONNECTED
                }
            }, {
                key: "dataChannelOpen",
                value: function(e) {
                    NAF.log.write("Opened data channel from " + e), this.activeDataChannels[e] = !0, this.entities.completeSync(e, !0);
                    var t = new CustomEvent("clientConnected", {
                        detail: {
                            clientId: e
                        }
                    });
                    document.body.dispatchEvent(t)
                }
            }, {
                key: "dataChannelClosed",
                value: function(e) {
                    NAF.log.write("Closed data channel from " + e), this.activeDataChannels[e] = !1, this.entities.removeEntitiesOfClient(e);
                    var t = new CustomEvent("clientDisconnected", {
                        detail: {
                            clientId: e
                        }
                    });
                    document.body.dispatchEvent(t)
                }
            }, {
                key: "hasActiveDataChannel",
                value: function(e) {
                    return !(!this.activeDataChannels[e] || !this.activeDataChannels[e])
                }
            }, {
                key: "broadcastData",
                value: function(e, t) {
                    this.adapter.broadcastData(e, t)
                }
            }, {
                key: "broadcastDataGuaranteed",
                value: function(e, t) {
                    this.adapter.broadcastDataGuaranteed(e, t)
                }
            }, {
                key: "sendData",
                value: function(e, t, n, i) {
                    this.hasActiveDataChannel(e) && (i ? this.adapter.sendDataGuaranteed(e, t, n) : this.adapter.sendData(e, t, n))
                }
            }, {
                key: "sendDataGuaranteed",
                value: function(e, t, n) {
                    this.sendData(e, t, n, !0)
                }
            }, {
                key: "subscribeToDataChannel",
                value: function(e, t) {
                    this.isReservedDataType(e) ? NAF.log.error("NetworkConnection@subscribeToDataChannel: " + e + " is a reserved dataType. Choose another") : this.dataChannelSubs[e] = t
                }
            }, {
                key: "unsubscribeToDataChannel",
                value: function(e) {
                    this.isReservedDataType(e) ? NAF.log.error("NetworkConnection@unsubscribeToDataChannel: " + e + " is a reserved dataType. Choose another") : delete this.dataChannelSubs[e]
                }
            }, {
                key: "isReservedDataType",
                value: function(e) {
                    return e == o || e == r
                }
            }, {
                key: "receivedData",
                value: function(e, t, n, i) {
                    this.dataChannelSubs[t] ? this.dataChannelSubs[t](e, t, n, i) : NAF.log.write("NetworkConnection@receivedData: " + t + " has not been subscribed to yet. Call subscribeToDataChannel()")
                }
            }, {
                key: "getServerTime",
                value: function() {
                    return this.adapter.getServerTime()
                }
            }, {
                key: "disconnect",
                value: function() {
                    this.entities.removeRemoteEntities(), this.adapter.disconnect(), NAF.app = "", NAF.room = "", NAF.clientId = "", this.connectedClients = {}, this.activeDataChannels = {}, this.adapter = null, this.setupDefaultDataSubscriptions(), document.body.removeEventListener("connected", this.onConnectCallback)
                }
            }]) && i(t.prototype, n), a && i(t, a), e
        }();
    e.exports = a
}, function(e, t, n) {
    "use strict";

    function i(e, t) {
        for (var n = 0; n < t.length; n++) {
            var i = t[n];
            i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
        }
    }
    var o = n(10),
        s = n(11),
        r = function() {
            function e() {
                ! function(e, t) {
                    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                }(this, e), this.adapters = {
                    socketio: s,
                    webrtc: o
                }, this.IS_CONNECTED = e.IS_CONNECTED, this.CONNECTING = e.CONNECTING, this.NOT_CONNECTED = e.NOT_CONNECTED
            }
            var t, n, r;
            return t = e, (n = [{
                key: "register",
                value: function(e, t) {
                    this.adapters[e] = t
                }
            }, {
                key: "make",
                value: function(e) {
                    var t = e.toLowerCase();
                    if (this.adapters[t]) return new(0, this.adapters[t]);
                    throw "easyrtc" === t || "wseasyrtc" == t ? new Error("Adapter: " + e + " not registered. EasyRTC support was removed in Networked-Aframe 0.7.0. To use the deprecated EasyRTC adapter see https://github.com/networked-aframe/naf-easyrtc-adapter") : new Error("Adapter: " + e + " not registered. Please use NAF.adapters.register() to register this adapter.")
                }
            }]) && i(t.prototype, n), r && i(t, r), e
        }();
    r.IS_CONNECTED = "IS_CONNECTED", r.CONNECTING = "CONNECTING", r.NOT_CONNECTED = "NOT_CONNECTED", e.exports = r
}, function(e, t, n) {
    "use strict";

    function i(e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    }

    function o(e, t) {
        for (var n = 0; n < t.length; n++) {
            var i = t[n];
            i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
        }
    }

    function s(e, t, n) {
        return t && o(e.prototype, t), n && o(e, n), e
    }
    var r = function() {
        function e(t, n, o) {
            i(this, e), this.localId = t, this.remoteId = n, this.sendSignalFunc = o, this.open = !1, this.channelLabel = "networked-aframe-channel", this.pc = this.createPeerConnection(), this.channel = null
        }
        return s(e, [{
            key: "setDatachannelListeners",
            value: function(e, t, n, i) {
                this.openListener = e, this.closedListener = t, this.messageListener = n, this.trackListener = i
            }
        }, {
            key: "offer",
            value: function(e) {
                var t = this;
                this.setupChannel(this.pc.createDataChannel(this.channelLabel, {
                    reliable: !1
                })), e.sendAudio && e.localAudioStream.getTracks().forEach((function(n) {
                    return t.pc.addTrack(n, e.localAudioStream)
                })), this.pc.createOffer((function(e) {
                    t.handleSessionDescription(e)
                }), (function(e) {
                    NAF.log.error("WebRtcPeer.offer: " + e)
                }), {
                    offerToReceiveAudio: !0,
                    offerToReceiveVideo: !1
                })
            }
        }, {
            key: "handleSignal",
            value: function(e) {
                if (this.localId === e.to && this.remoteId === e.from) switch (e.type) {
                    case "offer":
                        this.handleOffer(e);
                        break;
                    case "answer":
                        this.handleAnswer(e);
                        break;
                    case "candidate":
                        this.handleCandidate(e);
                        break;
                    default:
                        NAF.log.error("WebRtcPeer.handleSignal: Unknown signal type " + e.type)
                }
            }
        }, {
            key: "send",
            value: function(e, t) {
                null !== this.channel && "open" === this.channel.readyState && this.channel.send(JSON.stringify({
                    type: e,
                    data: t
                }))
            }
        }, {
            key: "getStatus",
            value: function() {
                if (null === this.channel) return e.NOT_CONNECTED;
                switch (this.channel.readyState) {
                    case "open":
                        return e.IS_CONNECTED;
                    case "connecting":
                        return e.CONNECTING;
                    case "closing":
                    case "closed":
                    default:
                        return e.NOT_CONNECTED
                }
            }
        }, {
            key: "createPeerConnection",
            value: function() {
                var t = this,
                    n = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection || window.msRTCPeerConnection;
                if (void 0 === n) throw new Error("WebRtcPeer.createPeerConnection: This browser does not seem to support WebRTC.");
                var i = new n({
                    iceServers: e.ICE_SERVERS
                });
                return i.onicecandidate = function(e) {
                    e.candidate && t.sendSignalFunc({
                        from: t.localId,
                        to: t.remoteId,
                        type: "candidate",
                        sdpMLineIndex: e.candidate.sdpMLineIndex,
                        candidate: e.candidate.candidate
                    })
                }, i.oniceconnectionstatechange = function() {
                    t.open && "disconnected" === i.iceConnectionState && (t.open = !1, t.closedListener(t.remoteId))
                }, i.ontrack = function(e) {
                    t.trackListener(t.remoteId, e.streams[0])
                }, i
            }
        }, {
            key: "setupChannel",
            value: function(e) {
                var t = this;
                this.channel = e, this.channel.onmessage = function(e) {
                    var n = JSON.parse(e.data);
                    t.messageListener(t.remoteId, n.type, n.data)
                }, this.channel.onopen = function(e) {
                    t.open = !0, t.openListener(t.remoteId)
                }, this.channel.onclose = function(e) {
                    t.open && (t.open = !1, t.closedListener(t.remoteId))
                }, this.channel.onerror = function(e) {
                    NAF.log.error("WebRtcPeer.channel.onerror: " + e)
                }
            }
        }, {
            key: "handleOffer",
            value: function(e) {
                var t = this;
                this.pc.ondatachannel = function(e) {
                    t.setupChannel(e.channel)
                }, this.setRemoteDescription(e), this.pc.createAnswer((function(e) {
                    t.handleSessionDescription(e)
                }), (function(e) {
                    NAF.log.error("WebRtcPeer.handleOffer: " + e)
                }))
            }
        }, {
            key: "handleAnswer",
            value: function(e) {
                this.setRemoteDescription(e)
            }
        }, {
            key: "handleCandidate",
            value: function(e) {
                var t = window.RTCIceCandidate || window.webkitRTCIceCandidate || window.mozRTCIceCandidate;
                this.pc.addIceCandidate(new t(e), (function() {}), (function(e) {
                    NAF.log.error("WebRtcPeer.handleCandidate: " + e)
                }))
            }
        }, {
            key: "handleSessionDescription",
            value: function(e) {
                this.pc.setLocalDescription(e, (function() {}), (function(e) {
                    NAF.log.error("WebRtcPeer.handleSessionDescription: " + e)
                })), this.sendSignalFunc({
                    from: this.localId,
                    to: this.remoteId,
                    type: e.type,
                    sdp: e.sdp
                })
            }
        }, {
            key: "setRemoteDescription",
            value: function(e) {
                var t = window.RTCSessionDescription || window.webkitRTCSessionDescription || window.mozRTCSessionDescription || window.msRTCSessionDescription;
                this.pc.setRemoteDescription(new t(e), (function() {}), (function(e) {
                    NAF.log.error("WebRtcPeer.setRemoteDescription: " + e)
                }))
            }
        }, {
            key: "close",
            value: function() {
                this.pc && this.pc.close()
            }
        }]), e
    }();
    r.IS_CONNECTED = "IS_CONNECTED", r.CONNECTING = "CONNECTING", r.NOT_CONNECTED = "NOT_CONNECTED", r.ICE_SERVERS = [{
        urls: "stun:stun1.l.google.com:19302"
    }, {
        urls: "stun:stun2.l.google.com:19302"
    }, {
        urls: "stun:stun3.l.google.com:19302"
    }, {
        urls: "stun:stun4.l.google.com:19302"
    }];
    var a = function() {
        function e() {
            i(this, e), void 0 === io && console.warn("It looks like socket.io has not been loaded before WebrtcAdapter. Please do that."), this.app = "default", this.room = "default", this.occupantListener = null, this.myRoomJoinTime = null, this.myId = null, this.peers = {}, this.occupants = {}, this.audioStreams = {}, this.pendingAudioRequest = {}, this.serverTimeRequests = 0, this.timeOffsets = [], this.avgTimeOffset = 0
        }
        return s(e, [{
            key: "setServerUrl",
            value: function(e) {
                this.wsUrl = e
            }
        }, {
            key: "setApp",
            value: function(e) {
                this.app = e
            }
        }, {
            key: "setRoom",
            value: function(e) {
                this.room = e
            }
        }, {
            key: "setWebRtcOptions",
            value: function(e) {
                !1 === e.datachannel && NAF.log.error("WebrtcAdapter.setWebRtcOptions: datachannel must be true."), !0 === e.audio && (this.sendAudio = !0), !0 === e.video && NAF.log.warn("WebrtcAdapter does not support video yet.")
            }
        }, {
            key: "setServerConnectListeners",
            value: function(e, t) {
                this.connectSuccess = e, this.connectFailure = t
            }
        }, {
            key: "setRoomOccupantListener",
            value: function(e) {
                this.occupantListener = e
            }
        }, {
            key: "setDataChannelListeners",
            value: function(e, t, n) {
                this.openListener = e, this.closedListener = t, this.messageListener = n
            }
        }, {
            key: "connect",
            value: function() {
                var e = this;
                this.updateTimeOffset().then((function() {
                    e.wsUrl && "/" !== e.wsUrl || ("https:" === location.protocol ? e.wsUrl = "wss://" + location.host : e.wsUrl = "ws://" + location.host), NAF.log.write("Attempting to connect to socket.io");
                    var t = e.socket = io(e.wsUrl);

                    function n(t) {
                        var n = t.from,
                            i = t.type,
                            o = t.data;
                        "ice-candidate" !== i ? e.messageListener(n, i, o) : e.peers[n].handleSignal(o)
                    }
                    t.on("connect", (function() {
                        NAF.log.write("User connected", t.id), e.myId = t.id, e.joinRoom()
                    })), t.on("connectSuccess", (function(t) {
                        var n = t.joinedTime;
                        if (e.myRoomJoinTime = n, NAF.log.write("Successfully joined room", e.room, "at server time", n), e.sendAudio) {
                            navigator.mediaDevices.getUserMedia({
                                audio: !0,
                                video: !1
                            }).then((function(t) {
                                e.storeAudioStream(e.myId, t), e.connectSuccess(e.myId)
                            })).catch((function(e) {
                                return NAF.log.error(e)
                            }))
                        } else e.connectSuccess(e.myId)
                    })), t.on("error", (function(t) {
                        console.error("Socket connection failure", t), e.connectFailure()
                    })), t.on("occupantsChanged", (function(t) {
                        var n = t.occupants;
                        NAF.log.write("occupants changed", t), e.receivedOccupants(n)
                    })), t.on("send", n), t.on("broadcast", n)
                }))
            }
        }, {
            key: "joinRoom",
            value: function() {
                NAF.log.write("Joining room", this.room), this.socket.emit("joinRoom", {
                    room: this.room
                })
            }
        }, {
            key: "receivedOccupants",
            value: function(e) {
                var t = this;
                delete e[this.myId], this.occupants = e;
                var n = this,
                    i = this.myId,
                    o = function() {
                        var e = s;
                        if (t.peers[e]) return "continue";
                        var o = new r(i, e, (function(t) {
                            n.socket.emit("send", {
                                from: i,
                                to: e,
                                type: "ice-candidate",
                                data: t,
                                sending: !0
                            })
                        }));
                        o.setDatachannelListeners(n.openListener, n.closedListener, n.messageListener, n.trackListener.bind(n)), n.peers[e] = o
                    };
                for (var s in e) o();
                this.occupantListener(e)
            }
        }, {
            key: "shouldStartConnectionTo",
            value: function(e) {
                return (this.myRoomJoinTime || 0) <= (e || 0)
            }
        }, {
            key: "startStreamConnection",
            value: function(e) {
                var t = this;
                NAF.log.write("starting offer process"), this.sendAudio ? this.getMediaStream(this.myId).then((function(n) {
                    var i = {
                        sendAudio: !0,
                        localAudioStream: n
                    };
                    t.peers[e].offer(i)
                })) : this.peers[e].offer({})
            }
        }, {
            key: "closeStreamConnection",
            value: function(e) {
                NAF.log.write("closeStreamConnection", e, this.peers), this.peers[e].close(), delete this.peers[e], delete this.occupants[e], this.closedListener(e)
            }
        }, {
            key: "getConnectStatus",
            value: function(e) {
                var t = this.peers[e];
                if (void 0 === t) return NAF.adapters.NOT_CONNECTED;
                switch (t.getStatus()) {
                    case r.IS_CONNECTED:
                        return NAF.adapters.IS_CONNECTED;
                    case r.CONNECTING:
                        return NAF.adapters.CONNECTING;
                    case r.NOT_CONNECTED:
                    default:
                        return NAF.adapters.NOT_CONNECTED
                }
            }
        }, {
            key: "sendData",
            value: function(e, t, n) {
                this.peers[e].send(t, n)
            }
        }, {
            key: "sendDataGuaranteed",
            value: function(e, t, n) {
                var i = {
                    from: this.myId,
                    to: e,
                    type: t,
                    data: n,
                    sending: !0
                };
                this.socket.emit("send", i)
            }
        }, {
            key: "broadcastData",
            value: function(e, t) {
                for (var n in this.peers) this.sendData(n, e, t)
            }
        }, {
            key: "broadcastDataGuaranteed",
            value: function(e, t) {
                var n = {
                    from: this.myId,
                    type: e,
                    data: t,
                    broadcasting: !0
                };
                this.socket.emit("broadcast", n)
            }
        }, {
            key: "storeAudioStream",
            value: function(e, t) {
                this.audioStreams[e] = t, this.pendingAudioRequest[e] && (NAF.log.write("Received pending audio for " + e), this.pendingAudioRequest[e](t), this.pendingAudioRequest[e](t))
            }
        }, {
            key: "trackListener",
            value: function(e, t) {
                this.storeAudioStream(e, t)
            }
        }, {
            key: "getMediaStream",
            value: function(e) {
                var t = this;
                return this.audioStreams[e] ? (NAF.log.write("Already had audio for " + e), Promise.resolve(this.audioStreams[e])) : (NAF.log.write("Waiting on audio for " + e), new Promise((function(n) {
                    t.pendingAudioRequest[e] = n
                })))
            }
        }, {
            key: "updateTimeOffset",
            value: function() {
                var e = this,
                    t = Date.now() + this.avgTimeOffset;
                return fetch(document.location.href, {
                    method: "HEAD",
                    cache: "no-cache"
                }).then((function(n) {
                    var i = new Date(n.headers.get("Date")).getTime() + 500,
                        o = Date.now(),
                        s = i + (o - t) / 2 - o;
                    e.serverTimeRequests++, e.serverTimeRequests <= 10 ? e.timeOffsets.push(s) : e.timeOffsets[e.serverTimeRequests % 10] = s, e.avgTimeOffset = e.timeOffsets.reduce((function(e, t) {
                        return e + t
                    }), 0) / e.timeOffsets.length, e.serverTimeRequests > 10 ? setTimeout((function() {
                        return e.updateTimeOffset()
                    }), 3e5) : e.updateTimeOffset()
                }))
            }
        }, {
            key: "getServerTime",
            value: function() {
                return new Date + this.avgTimeOffset
            }
        }]), e
    }();
    e.exports = a
}, function(e, t, n) {
    "use strict";

    function i(e, t) {
        for (var n = 0; n < t.length; n++) {
            var i = t[n];
            i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
        }
    }
    var o = function() {
        function e() {
            ! function(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }(this, e), void 0 === io && console.warn("It looks like socket.io has not been loaded before SocketioAdapter. Please do that."), this.app = "default", this.room = "default", this.occupantListener = null, this.myRoomJoinTime = null, this.myId = null, this.occupants = {}, this.connectedClients = [], this.serverTimeRequests = 0, this.timeOffsets = [], this.avgTimeOffset = 0
        }
        var t, n, o;
        return t = e, (n = [{
            key: "setServerUrl",
            value: function(e) {
                this.wsUrl = e
            }
        }, {
            key: "setApp",
            value: function(e) {
                this.app = e
            }
        }, {
            key: "setRoom",
            value: function(e) {
                this.room = e
            }
        }, {
            key: "setWebRtcOptions",
            value: function(e) {}
        }, {
            key: "setServerConnectListeners",
            value: function(e, t) {
                this.connectSuccess = e, this.connectFailure = t
            }
        }, {
            key: "setRoomOccupantListener",
            value: function(e) {
                this.occupantListener = e
            }
        }, {
            key: "setDataChannelListeners",
            value: function(e, t, n) {
                this.openListener = e, this.closedListener = t, this.messageListener = n
            }
        }, {
            key: "connect",
            value: function() {
                var e = this;
                this.updateTimeOffset().then((function() {
                    e.wsUrl && "/" !== e.wsUrl || ("https:" === location.protocol ? e.wsUrl = "wss://" + location.host : e.wsUrl = "ws://" + location.host), NAF.log.write("Attempting to connect to socket.io");
                    var t = e.socket = io(e.wsUrl);

                    function n(t) {
                        var n = t.from,
                            i = t.type,
                            o = t.data;
                        e.messageListener(n, i, o)
                    }
                    t.on("connect", (function() {
                        NAF.log.write("User connected", t.id), e.myId = t.id, e.joinRoom()
                    })), t.on("connectSuccess", (function(t) {
                        var n = t.joinedTime;
                        e.myRoomJoinTime = n, NAF.log.write("Successfully joined room", e.room, "at server time", n), e.connectSuccess(e.myId)
                    })), t.on("error", (function(t) {
                        console.error("Socket connection failure", t), e.connectFailure()
                    })), t.on("occupantsChanged", (function(t) {
                        var n = t.occupants;
                        NAF.log.write("occupants changed", t), e.receivedOccupants(n)
                    })), t.on("send", n), t.on("broadcast", n)
                }))
            }
        }, {
            key: "joinRoom",
            value: function() {
                NAF.log.write("Joining room", this.room), this.socket.emit("joinRoom", {
                    room: this.room
                })
            }
        }, {
            key: "receivedOccupants",
            value: function(e) {
                delete e[this.myId], this.occupants = e, this.occupantListener(e)
            }
        }, {
            key: "shouldStartConnectionTo",
            value: function(e) {
                return !0
            }
        }, {
            key: "startStreamConnection",
            value: function(e) {
                this.connectedClients.push(e), this.openListener(e)
            }
        }, {
            key: "closeStreamConnection",
            value: function(e) {
                this.connectedClients = this.connectedClients.filter((function(t) {
                    return t != e
                })), this.closedListener(e)
            }
        }, {
            key: "getConnectStatus",
            value: function(e) {
                return -1 != this.connectedClients.indexOf(e) ? NAF.adapters.IS_CONNECTED : NAF.adapters.NOT_CONNECTED
            }
        }, {
            key: "sendData",
            value: function(e, t, n) {
                this.sendDataGuaranteed(e, t, n)
            }
        }, {
            key: "sendDataGuaranteed",
            value: function(e, t, n) {
                var i = {
                    from: this.myId,
                    to: e,
                    type: t,
                    data: n,
                    sending: !0
                };
                this.socket ? this.socket.emit("send", i) : NAF.log.warn("SocketIO socket not created yet")
            }
        }, {
            key: "broadcastData",
            value: function(e, t) {
                this.broadcastDataGuaranteed(e, t)
            }
        }, {
            key: "broadcastDataGuaranteed",
            value: function(e, t) {
                var n = {
                    from: this.myId,
                    type: e,
                    data: t,
                    broadcasting: !0
                };
                this.socket ? this.socket.emit("broadcast", n) : NAF.log.warn("SocketIO socket not created yet")
            }
        }, {
            key: "getMediaStream",
            value: function(e) {}
        }, {
            key: "updateTimeOffset",
            value: function() {
                var e = this,
                    t = Date.now() + this.avgTimeOffset;
                return fetch(document.location.href, {
                    method: "HEAD",
                    cache: "no-cache"
                }).then((function(n) {
                    var i = new Date(n.headers.get("Date")).getTime() + 500,
                        o = Date.now(),
                        s = i + (o - t) / 2 - o;
                    e.serverTimeRequests++, e.serverTimeRequests <= 10 ? e.timeOffsets.push(s) : e.timeOffsets[e.serverTimeRequests % 10] = s, e.avgTimeOffset = e.timeOffsets.reduce((function(e, t) {
                        return e + t
                    }), 0) / e.timeOffsets.length, e.serverTimeRequests > 10 ? setTimeout((function() {
                        return e.updateTimeOffset()
                    }), 3e5) : e.updateTimeOffset()
                }))
            }
        }, {
            key: "getServerTime",
            value: function() {
                return new Date + this.avgTimeOffset
            }
        }]) && i(t.prototype, n), o && i(t, o), e
    }();
    e.exports = o
}, function(e, t, n) {
    "use strict";
    AFRAME.registerComponent("networked-scene", {
        schema: {
            serverURL: {
                default: "/"
            },
            app: {
                default: "default"
            },
            room: {
                default: "default"
            },
            connectOnLoad: {
                default: !0
            },
            onConnect: {
                default: "onConnect"
            },
            adapter: {
                default: "socketio"
            },
            audio: {
                default: !1
            },
            debug: {
                default: !1
            }
        },
        init: function() {
            var e = this.el;
            this.connect = this.connect.bind(this), e.addEventListener("connect", this.connect), this.data.connectOnLoad && e.emit("connect", null, !1)
        },
        connect: function() {
            return NAF.log.setDebug(this.data.debug), NAF.log.write("Networked-Aframe Connecting..."), this.checkDeprecatedProperties(), this.setupNetworkAdapter(), this.hasOnConnectFunction() && this.callOnConnect(), NAF.connection.connect(this.data.serverURL, this.data.app, this.data.room, this.data.audio)
        },
        checkDeprecatedProperties: function() {},
        setupNetworkAdapter: function() {
            var e = this.data.adapter,
                t = NAF.adapters.make(e);
            NAF.connection.setNetworkAdapter(t), this.el.emit("adapter-ready", t, !1)
        },
        hasOnConnectFunction: function() {
            return "" != this.data.onConnect && window[this.data.onConnect]
        },
        callOnConnect: function() {
            NAF.connection.onConnect(window[this.data.onConnect])
        },
        remove: function() {
            NAF.log.write("networked-scene disconnected"), this.el.removeEventListener("connect", this.connect), NAF.connection.disconnect()
        }
    })
}, function(e, t, n) {
    "use strict";
    var i = n(14),
        o = n(15),
        s = THREE.Math.DEG2RAD,
        r = ["position", "rotation", "scale"];
    AFRAME.registerSystem("networked", {
        init: function() {
            this.components = [], this.nextSyncTime = 0
        },
        register: function(e) {
            this.components.push(e)
        },
        deregister: function(e) {
            var t = this.components.indexOf(e);
            t > -1 && this.components.splice(t, 1)
        },
        tick: function() {
            if (NAF.connection.adapter && !(this.el.clock.elapsedTime < this.nextSyncTime)) {
                for (var e = {
                        d: []
                    }, t = 0, n = this.components.length; t < n; t++) {
                    var i = this.components[t];
                    if (i.isMine()) {
                        if (!i.el.parentElement) return void NAF.log.error("entity registered with system despite being removed");
                        var o = this.components[t].syncDirty();
                        o && e.d.push(o)
                    }
                }
                e.d.length > 0 && NAF.connection.broadcastData("um", e), this.updateNextSyncTime()
            }
        },
        updateNextSyncTime: function() {
            this.nextSyncTime = this.el.clock.elapsedTime + 1 / NAF.options.updateRate
        }
    }), AFRAME.registerComponent("networked", {
        schema: {
            template: {
                default: ""
            },
            attachTemplateToLocal: {
                default: !0
            },
            persistent: {
                default: !1
            },
            networkId: {
                default: ""
            },
            owner: {
                default: ""
            },
            creator: {
                default: ""
            }
        },
        init: function() {
            this.OWNERSHIP_GAINED = "ownership-gained", this.OWNERSHIP_CHANGED = "ownership-changed", this.OWNERSHIP_LOST = "ownership-lost", this.onOwnershipGainedEvent = {
                el: this.el
            }, this.onOwnershipChangedEvent = {
                el: this.el
            }, this.onOwnershipLostEvent = {
                el: this.el
            }, this.conversionEuler = new THREE.Euler, this.conversionEuler.order = "YXZ", this.bufferInfos = [], this.bufferPosition = new THREE.Vector3, this.bufferQuaternion = new THREE.Quaternion, this.bufferScale = new THREE.Vector3;
            var e = this.wasCreatedByNetwork();
            this.onConnected = this.onConnected.bind(this), this.syncData = {}, this.componentSchemas = NAF.schemas.getComponents(this.data.template), this.cachedElements = new Array(this.componentSchemas.length), this.networkUpdatePredicates = this.componentSchemas.map((function(e) {
                return e.requiresNetworkUpdate && e.requiresNetworkUpdate() || (t = null, function(e) {
                    return !(null !== t && i(t, e) || (t = AFRAME.utils.clone(e), 0))
                });
                var t
            })), this.invalidateCachedElements(), this.initNetworkParent(), "" === this.data.networkId && this.el.setAttribute(this.name, {
                networkId: NAF.utils.createNetworkId()
            }), e ? this.firstUpdate() : (this.data.attachTemplateToLocal && this.attachTemplateToLocal(), this.registerEntity(this.data.networkId)), this.lastOwnerTime = -1, NAF.clientId ? this.onConnected() : document.body.addEventListener("connected", this.onConnected, !1), document.body.dispatchEvent(this.entityCreatedEvent()), this.el.dispatchEvent(new CustomEvent("instantiated", {
                detail: {
                    el: this.el
                }
            })), this.el.sceneEl.systems.networked.register(this)
        },
        attachTemplateToLocal: function() {
            for (var e = NAF.schemas.getCachedTemplate(this.data.template), t = e.attributes, n = 0; n < t.length; n++) this.el.setAttribute(t[n].name, t[n].value);
            for (; e.firstElementChild;) this.el.appendChild(e.firstElementChild)
        },
        takeOwnership: function() {
            var e = this.data.owner,
                t = this.lastOwnerTime,
                n = NAF.connection.getServerTime();
            return !!(e && !this.isMine() && t < n) && (this.lastOwnerTime = n, this.removeLerp(), this.el.setAttribute("networked", {
                owner: NAF.clientId
            }), this.syncAll(), this.onOwnershipGainedEvent.oldOwner = e, this.el.emit(this.OWNERSHIP_GAINED, this.onOwnershipGainedEvent), this.onOwnershipChangedEvent.oldOwner = e, this.onOwnershipChangedEvent.newOwner = NAF.clientId, this.el.emit(this.OWNERSHIP_CHANGED, this.onOwnershipChangedEvent), !0)
        },
        wasCreatedByNetwork: function() {
            return !!this.el.firstUpdateData
        },
        initNetworkParent: function() {
            var e = this.el.parentElement;
            e.components && e.components.networked ? this.parent = e : this.parent = null
        },
        registerEntity: function(e) {
            NAF.entities.registerEntity(e, this.el)
        },
        applyPersistentFirstSync: function() {
            var e = this.data.networkId,
                t = NAF.entities.getPersistentFirstSync(e);
            t && (this.networkUpdate(t), NAF.entities.forgetPersistentFirstSync(e))
        },
        firstUpdate: function() {
            var e = this.el.firstUpdateData;
            this.networkUpdate(e)
        },
        onConnected: function() {
            var e = this;
            "" === this.data.owner && (this.lastOwnerTime = NAF.connection.getServerTime(), this.el.setAttribute(this.name, {
                owner: NAF.clientId,
                creator: NAF.clientId
            }), setTimeout((function() {
                e.el.parentNode ? e.syncAll(void 0, !0) : NAF.log.warn("Networked element was removed before ever getting the chance to syncAll")
            }), 0)), document.body.removeEventListener("connected", this.onConnected, !1)
        },
        isMine: function() {
            return this.data.owner === NAF.clientId
        },
        createdByMe: function() {
            return this.data.creator === NAF.clientId
        },
        tick: function(e, t) {
            if (!this.isMine() && NAF.options.useLerp)
                for (var n = 0; n < this.bufferInfos.length; n++) {
                    var i = this.bufferInfos[n],
                        o = i.buffer,
                        s = i.object3D,
                        r = i.componentNames;
                    o.update(t), r.includes("position") && s.position.copy(o.getPosition()), r.includes("rotation") && s.quaternion.copy(o.getQuaternion()), r.includes("scale") && s.scale.copy(o.getScale())
                }
        },
        syncAll: function(e, t) {
            if (this.canSync()) {
                var n = this.gatherComponentsData(!0),
                    i = this.createSyncData(n, t);
                e ? NAF.connection.sendDataGuaranteed(e, "u", i) : NAF.connection.broadcastDataGuaranteed("u", i)
            }
        },
        syncDirty: function() {
            if (this.canSync()) {
                var e = this.gatherComponentsData(!1);
                if (null !== e) return this.createSyncData(e)
            }
        },
        getCachedElement: function(e) {
            var t = this.cachedElements[e];
            if (t) return t;
            var n = this.componentSchemas[e];
            return n.selector ? this.cachedElements[e] = this.el.querySelector(n.selector) : this.cachedElements[e] = this.el
        },
        invalidateCachedElements: function() {
            for (var e = 0; e < this.cachedElements.length; e++) this.cachedElements[e] = null
        },
        gatherComponentsData: function(e) {
            for (var t = null, n = 0; n < this.componentSchemas.length; n++) {
                var i = this.componentSchemas[n],
                    o = this.getCachedElement(n);
                if (o) {
                    var s = i.component ? i.component : i,
                        r = o.getAttribute(s);
                    if (null !== r) {
                        var a = i.property ? r[i.property] : r;
                        (this.networkUpdatePredicates[n](a) || e) && ((t = t || {})[n] = a)
                    } else e && ((t = t || {})[n] = null)
                } else e && ((t = t || {})[n] = null)
            }
            return t
        },
        createSyncData: function(e, t) {
            var n = this.syncData,
                i = this.data;
            return n.networkId = i.networkId, n.owner = i.owner, n.creator = i.creator, n.lastOwnerTime = this.lastOwnerTime, n.template = i.template, n.persistent = i.persistent, n.parent = this.getParentId(), n.components = e, n.isFirstSync = !!t, n
        },
        canSync: function() {
            if (this.data.owner && this.isMine()) return !0;
            if (!this.createdByMe()) return !1;
            var e = NAF.connection.getConnectedClients();
            for (var t in e)
                if (t === this.data.owner) return !1;
            return !0
        },
        getParentId: function() {
            return this.initNetworkParent(), this.parent ? this.parent.getAttribute("networked").networkId : null
        },
        networkUpdate: function(e) {
            if (!(e.lastOwnerTime < this.lastOwnerTime || this.lastOwnerTime === e.lastOwnerTime && this.data.owner > e.owner)) {
                if (this.data.owner !== e.owner) {
                    var t = this.isMine();
                    this.lastOwnerTime = e.lastOwnerTime;
                    var n = this.data.owner,
                        i = e.owner;
                    this.el.setAttribute("networked", {
                        owner: e.owner
                    }), t && (this.onOwnershipLostEvent.newOwner = i, this.el.emit(this.OWNERSHIP_LOST, this.onOwnershipLostEvent)), this.onOwnershipChangedEvent.oldOwner = n, this.onOwnershipChangedEvent.newOwner = i, this.el.emit(this.OWNERSHIP_CHANGED, this.onOwnershipChangedEvent)
                }
                this.data.persistent !== e.persistent && this.el.setAttribute("networked", {
                    persistent: e.persistent
                }), this.updateNetworkedComponents(e.components)
            }
        },
        updateNetworkedComponents: function(e) {
            for (var t = 0, n = this.componentSchemas.length; t < n; t++) {
                var i = e[t],
                    o = this.componentSchemas[t],
                    s = this.getCachedElement(t);
                null !== s && null != i && (o.component ? o.property ? this.updateNetworkedComponent(s, o.component, o.property, i) : this.updateNetworkedComponent(s, o.component, i) : this.updateNetworkedComponent(s, o, i))
            }
        },
        updateNetworkedComponent: function(e, t, n, i) {
            if (NAF.options.useLerp && r.includes(t)) {
                for (var a, c = 0, u = this.bufferInfos.length; c < u; c++) {
                    var l = this.bufferInfos[c];
                    if (l.object3D === e.object3D) {
                        a = l;
                        break
                    }
                }
                if (a) {
                    var h = a.componentNames;
                    h.includes(t) || h.push(t)
                } else a = {
                    buffer: new o(o.MODE_LERP, .1),
                    object3D: e.object3D,
                    componentNames: [t]
                }, this.bufferInfos.push(a);
                var d = a.buffer;
                switch (t) {
                    case "position":
                        return void d.setPosition(this.bufferPosition.set(n.x, n.y, n.z));
                    case "rotation":
                        return this.conversionEuler.set(s * n.x, s * n.y, s * n.z), void d.setQuaternion(this.bufferQuaternion.setFromEuler(this.conversionEuler));
                    case "scale":
                        return void d.setScale(this.bufferScale.set(n.x, n.y, n.z))
                }
                NAF.log.error("Could not set value in interpolation buffer.", e, t, n, a)
            } else void 0 === i ? e.setAttribute(t, n) : e.setAttribute(t, n, i)
        },
        removeLerp: function() {
            this.bufferInfos = []
        },
        remove: function() {
            if (this.isMine() && NAF.connection.isConnected()) {
                var e = {
                    networkId: this.data.networkId
                };
                NAF.entities.hasEntity(this.data.networkId) ? NAF.connection.broadcastDataGuaranteed("r", e) : NAF.log.error("Removing networked entity that is not in entities array.")
            }
            NAF.entities.forgetEntity(this.data.networkId), document.body.dispatchEvent(this.entityRemovedEvent(this.data.networkId)), this.el.sceneEl.systems.networked.deregister(this)
        },
        entityCreatedEvent: function() {
            return new CustomEvent("entityCreated", {
                detail: {
                    el: this.el
                }
            })
        },
        entityRemovedEvent: function(e) {
            return new CustomEvent("entityRemoved", {
                detail: {
                    networkId: e
                }
            })
        }
    })
}, function(e, t, n) {
    "use strict";

    function i(e) {
        return (i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
            return typeof e
        } : function(e) {
            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
        })(e)
    }
    var o = Array.isArray,
        s = Object.keys,
        r = Object.prototype.hasOwnProperty;
    e.exports = function e(t, n) {
        if (t === n) return !0;
        if (t && n && "object" == i(t) && "object" == i(n)) {
            var a, c, u, l = o(t),
                h = o(n);
            if (l && h) {
                if ((c = t.length) != n.length) return !1;
                for (a = c; 0 != a--;)
                    if (!e(t[a], n[a])) return !1;
                return !0
            }
            if (l != h) return !1;
            var d = t instanceof Date,
                f = n instanceof Date;
            if (d != f) return !1;
            if (d && f) return t.getTime() == n.getTime();
            var p = t instanceof RegExp,
                m = n instanceof RegExp;
            if (p != m) return !1;
            if (p && m) return t.toString() == n.toString();
            var v = s(t);
            if ((c = v.length) !== s(n).length) return !1;
            for (a = c; 0 != a--;)
                if (!r.call(n, v[a])) return !1;
            for (a = c; 0 != a--;)
                if (!e(t[u = v[a]], n[u])) return !1;
            return !0
        }
        return t != t && n != n
    }
}, function(e, t, n) {
    "use strict";
    var i = function() {
        function e(e, t) {
            for (var n = 0; n < t.length; n++) {
                var i = t[n];
                i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
            }
        }
        return function(t, n, i) {
            return n && e(t.prototype, n), i && e(t, i), t
        }
    }();

    function o(e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    }
    var s = [],
        r = function() {
            var e = s.pop();
            return e || (e = {
                position: new THREE.Vector3,
                velocity: new THREE.Vector3,
                scale: new THREE.Vector3,
                quaternion: new THREE.Quaternion,
                time: 0
            }), e
        },
        a = function() {
            function e() {
                var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0,
                    n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : .15;
                o(this, e), this.state = 0, this.buffer = [], this.bufferTime = 1e3 * n, this.time = 0, this.mode = t, this.originFrame = r(), this.position = new THREE.Vector3, this.quaternion = new THREE.Quaternion, this.scale = new THREE.Vector3(1, 1, 1)
            }
            return i(e, [{
                key: "hermite",
                value: function(e, t, n, i, o, s) {
                    var r = t * t,
                        a = t * t * t,
                        c = 2 * a - 3 * r + 1,
                        u = -2 * a + 3 * r,
                        l = a - 2 * r + t,
                        h = a - r;
                    e.copy(n.multiplyScalar(c)), e.add(i.multiplyScalar(u)), e.add(o.multiplyScalar(l)), e.add(s.multiplyScalar(h))
                }
            }, {
                key: "lerp",
                value: function(e, t, n, i) {
                    e.lerpVectors(t, n, i)
                }
            }, {
                key: "slerp",
                value: function(e, t, n, i) {
                    THREE.Quaternion.slerp(t, n, e, i)
                }
            }, {
                key: "updateOriginFrameToBufferTail",
                value: function() {
                    var e;
                    e = this.originFrame, s.push(e), this.originFrame = this.buffer.shift()
                }
            }, {
                key: "appendBuffer",
                value: function(e, t, n, i) {
                    var o = this.buffer.length > 0 ? this.buffer[this.buffer.length - 1] : null;
                    if (o && o.time === this.time) e && o.position.copy(e), t && o.velocity.copy(t), n && o.quaternion.copy(n), i && o.scale.copy(i);
                    else {
                        var s = o || this.originFrame,
                            a = r();
                        a.position.copy(e || s.position), a.velocity.copy(t || s.velocity), a.quaternion.copy(n || s.quaternion), a.scale.copy(i || s.scale), a.time = this.time, this.buffer.push(a)
                    }
                }
            }, {
                key: "setTarget",
                value: function(e, t, n, i) {
                    this.appendBuffer(e, t, n, i)
                }
            }, {
                key: "setPosition",
                value: function(e, t) {
                    this.appendBuffer(e, t, null, null)
                }
            }, {
                key: "setQuaternion",
                value: function(e) {
                    this.appendBuffer(null, null, e, null)
                }
            }, {
                key: "setScale",
                value: function(e) {
                    this.appendBuffer(null, null, null, e)
                }
            }, {
                key: "update",
                value: function(e) {
                    if (0 === this.state && this.buffer.length > 0 && (this.updateOriginFrameToBufferTail(), this.position.copy(this.originFrame.position), this.quaternion.copy(this.originFrame.quaternion), this.scale.copy(this.originFrame.scale), this.state = 1), 1 === this.state && this.buffer.length > 0 && this.time > this.bufferTime && (this.state = 2), 2 === this.state) {
                        for (var t = this.time - this.bufferTime; this.buffer.length > 0 && t > this.buffer[0].time;) this.buffer.length > 1 ? this.updateOriginFrameToBufferTail() : (this.originFrame.position.copy(this.buffer[0].position), this.originFrame.velocity.copy(this.buffer[0].velocity), this.originFrame.quaternion.copy(this.buffer[0].quaternion), this.originFrame.scale.copy(this.buffer[0].scale), this.originFrame.time = this.buffer[0].time, this.buffer[0].time = this.time + e);
                        if (this.buffer.length > 0 && this.buffer[0].time > 0) {
                            var n = this.buffer[0],
                                i = n.time - this.originFrame.time,
                                o = (t - this.originFrame.time) / i;
                            0 === this.mode ? this.lerp(this.position, this.originFrame.position, n.position, o) : 1 === this.mode && this.hermite(this.position, o, this.originFrame.position, n.position, this.originFrame.velocity.multiplyScalar(i), n.velocity.multiplyScalar(i)), this.slerp(this.quaternion, this.originFrame.quaternion, n.quaternion, o), this.lerp(this.scale, this.originFrame.scale, n.scale, o)
                        }
                    }
                    0 !== this.state && (this.time += e)
                }
            }, {
                key: "getPosition",
                value: function() {
                    return this.position
                }
            }, {
                key: "getQuaternion",
                value: function() {
                    return this.quaternion
                }
            }, {
                key: "getScale",
                value: function() {
                    return this.scale
                }
            }]), e
        }();
    e.exports = a
}, function(e, t, n) {
    "use strict";
    var i = n(0);
    AFRAME.registerComponent("networked-audio-source", {
        schema: {
            positional: {
                default: !0
            },
            distanceModel: {
                default: "inverse",
                oneOf: ["linear", "inverse", "exponential"]
            },
            maxDistance: {
                default: 1e4
            },
            refDistance: {
                default: 1
            },
            rolloffFactor: {
                default: 1
            }
        },
        init: function() {
            var e = this;
            this.listener = null, this.stream = null, this._setMediaStream = this._setMediaStream.bind(this), NAF.utils.getNetworkedEntity(this.el).then((function(t) {
                var n = t.components.networked.data.owner;
                n && NAF.connection.adapter.getMediaStream(n).then(e._setMediaStream).catch((function(e) {
                    return i.log.error("Error getting media stream for ".concat(n), e)
                }))
            }))
        },
        update: function() {
            this._setPannerProperties()
        },
        _setMediaStream: function(e) {
            if (this.sound || this.setupSound(), e != this.stream) {
                if (this.stream && this.sound.disconnect(), e) {
                    /chrome/i.test(navigator.userAgent) && (this.audioEl = new Audio, this.audioEl.setAttribute("autoplay", "autoplay"), this.audioEl.setAttribute("playsinline", "playsinline"), this.audioEl.srcObject = e, this.audioEl.volume = 0);
                    var t = this.sound.context.createMediaStreamSource(e);
                    this.sound.setNodeSource(t), this.el.emit("sound-source-set", {
                        soundSource: t
                    })
                }
                this.stream = e
            }
        },
        _setPannerProperties: function() {
            this.sound && this.data.positional && (this.sound.setDistanceModel(this.data.distanceModel), this.sound.setMaxDistance(this.data.maxDistance), this.sound.setRefDistance(this.data.refDistance), this.sound.setRolloffFactor(this.data.rolloffFactor))
        },
        remove: function() {
            this.sound && (this.el.removeObject3D(this.attrName), this.stream && this.sound.disconnect())
        },
        setupSound: function() {
            var e = this.el,
                t = e.sceneEl;
            this.sound && e.removeObject3D(this.attrName), t.audioListener || (t.audioListener = new THREE.AudioListener, t.camera && t.camera.add(t.audioListener), t.addEventListener("camera-set-active", (function(e) {
                e.detail.cameraEl.getObject3D("camera").add(t.audioListener)
            }))), this.listener = t.audioListener, this.sound = this.data.positional ? new THREE.PositionalAudio(this.listener) : new THREE.Audio(this.listener), e.setObject3D(this.attrName, this.sound), this._setPannerProperties()
        }
    })
}]);