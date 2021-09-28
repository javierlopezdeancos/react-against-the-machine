"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mechanism = void 0;
var Mechanism = /** @class */ (function () {
    function Mechanism(initial) {
        this._currentId = initial;
        this._states = [];
    }
    Object.defineProperty(Mechanism.prototype, "currentId", {
        get: function () {
            return this._currentId;
        },
        set: function (cid) {
            this._currentId = cid;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mechanism.prototype, "states", {
        get: function () {
            return this._states;
        },
        set: function (ss) {
            this._states = ss;
        },
        enumerable: false,
        configurable: true
    });
    Mechanism.prototype.setState = function (s) {
        var _a;
        var state = this.getState(s.id);
        if (state) {
            return;
        }
        (_a = this._states) === null || _a === void 0 ? void 0 : _a.push(s);
    };
    Mechanism.prototype.removeState = function (sid) {
        var _a;
        var statesFiltered = (_a = this._states) === null || _a === void 0 ? void 0 : _a.filter(function (s) { return s.id !== sid; });
        this._states = statesFiltered;
    };
    Mechanism.prototype.getState = function (sid) {
        var _a;
        return (_a = this._states) === null || _a === void 0 ? void 0 : _a.find(function (s) { return s.id === sid; });
    };
    Mechanism.prototype.setTransition = function (sid, t) {
        var _a;
        var statesWithTransition = (_a = this._states) === null || _a === void 0 ? void 0 : _a.map(function (s) {
            var _a;
            if (s.id === sid) {
                (_a = s === null || s === void 0 ? void 0 : s.to) === null || _a === void 0 ? void 0 : _a.push(t);
            }
            return s;
        });
        this._states = statesWithTransition;
    };
    Mechanism.prototype.getTransition = function (sid, tid) {
        var _a;
        var state = this.getState(sid);
        if (state && (state === null || state === void 0 ? void 0 : state.to) && ((_a = state === null || state === void 0 ? void 0 : state.to) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            return state.to.find(function (t) { return t.id === tid; });
        }
        return;
    };
    Mechanism.prototype.setContent = function (sid, c) {
        var _a;
        var statesWithContent = (_a = this._states) === null || _a === void 0 ? void 0 : _a.map(function (s) {
            if (s.id === sid && c) {
                s.content = c;
            }
            return s;
        });
        this._states = statesWithContent;
    };
    Mechanism.prototype.getContent = function (sid) {
        var state = this.getState(sid);
        if (state && (state === null || state === void 0 ? void 0 : state.content)) {
            return state.content;
        }
        return;
    };
    Mechanism.prototype.getStateByEvent = function (te) {
        var _this = this;
        var _a;
        var state;
        if ((this === null || this === void 0 ? void 0 : this._states) && ((_a = this._states) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            this === null || this === void 0 ? void 0 : this.states.forEach(function (s) {
                var _a;
                if ((s === null || s === void 0 ? void 0 : s.to) && ((_a = s === null || s === void 0 ? void 0 : s.to) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                    s.to.forEach(function (t) {
                        if ((t === null || t === void 0 ? void 0 : t.event) === te) {
                            if (t === null || t === void 0 ? void 0 : t.id) {
                                state = _this.getState(t.id);
                            }
                        }
                    });
                }
            });
        }
        return state;
    };
    Mechanism.prototype.getTransitionByEvent = function (te) {
        var _a;
        var transition;
        if ((this === null || this === void 0 ? void 0 : this._states) && ((_a = this._states) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            this === null || this === void 0 ? void 0 : this.states.forEach(function (s) {
                var _a;
                if ((s === null || s === void 0 ? void 0 : s.to) && ((_a = s === null || s === void 0 ? void 0 : s.to) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                    s.to.forEach(function (t) {
                        if ((t === null || t === void 0 ? void 0 : t.event) === te) {
                            transition = __assign({}, t);
                        }
                    });
                }
            });
        }
        return transition;
    };
    Mechanism.prototype.isPrivate = function (s) {
        return (s === null || s === void 0 ? void 0 : s.isPrivate) || false;
    };
    Mechanism.prototype.clear = function () {
        this._states = [];
        this._currentId = undefined;
    };
    return Mechanism;
}());
exports.default = Mechanism;
exports.mechanism = new Mechanism();
