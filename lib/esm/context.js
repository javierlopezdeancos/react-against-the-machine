var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import React, { createContext, useContext } from 'react';
var defaultState = {
    clear: function () { },
    prevId: undefined,
    currentId: undefined,
    currentContent: null,
    currentPathname: undefined,
    states: [],
    hasStates: function () { },
    getContent: function () { return undefined; },
    getState: function () { return undefined; },
    getStateByEvent: function () { return undefined; },
    getTransition: function () { return undefined; },
    getTransitionByEvent: function () { return undefined; },
    isPrivate: function () { return false; },
    removeState: function () { },
    setCurrentId: function () { },
    setContent: function () { },
    addState: function () { },
    updateState: function () { },
    setTransition: function () { },
    setStateParamValue: function () { },
};
var MachineContext = createContext(defaultState);
var MachineProvider = /** @class */ (function (_super) {
    __extends(MachineProvider, _super);
    function MachineProvider() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            prevId: undefined,
            currentId: undefined,
            currentContent: null,
            currentPathname: undefined,
            states: [],
        };
        _this.setCurrentId = function (cid) {
            if (cid) {
                var currentContent = _this.getContent(cid);
                var prevId = _this.state.currentId;
                _this.setState(__assign(__assign({}, _this.state), { currentId: cid, currentContent: currentContent, prevId: prevId }));
            }
        };
        _this.hasStates = function () {
            var _a, _b;
            if (((_b = (_a = _this === null || _this === void 0 ? void 0 : _this.state) === null || _a === void 0 ? void 0 : _a.states) === null || _b === void 0 ? void 0 : _b.length) === 0) {
                return false;
            }
            return true;
        };
        _this.addState = function (s) {
            var hasStates = _this.hasStates();
            if (!hasStates) {
                _this.state.states.push(s);
                return;
            }
            var stateIsStored = _this.getState(s.id);
            if (stateIsStored) {
                return;
            }
            _this.state.states.push(s);
        };
        _this.updateState = function (s) {
            _this.state.states.map(function (st) {
                if (s.id === st.id) {
                    st = s;
                }
                return st;
            });
        };
        _this.removeState = function (sid) {
            var _a, _b;
            var statesFiltered = (_b = (_a = _this.state) === null || _a === void 0 ? void 0 : _a.states) === null || _b === void 0 ? void 0 : _b.filter(function (s) { return s.id !== sid; });
            _this.setState(__assign(__assign({}, _this.state), { states: statesFiltered }));
        };
        _this.getState = function (sid) {
            var hasStates = _this.hasStates();
            if (!hasStates) {
                return undefined;
            }
            var statesCopy = __spreadArray([], _this.state.states, true);
            return statesCopy.find(function (s) { return s.id === sid; });
        };
        _this.setTransition = function (sid, t) {
            _this.state.states.map(function (s) {
                var _a;
                if (s.id === sid) {
                    (_a = s === null || s === void 0 ? void 0 : s.to) === null || _a === void 0 ? void 0 : _a.push(t);
                }
                return s;
            });
        };
        _this.getTransition = function (sid, tid) {
            var _a;
            var state = _this.getState(sid);
            if (state && (state === null || state === void 0 ? void 0 : state.to) && ((_a = state === null || state === void 0 ? void 0 : state.to) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                return state.to.find(function (t) { return t.id === tid; });
            }
            return;
        };
        _this.setContent = function (sid, c) {
            _this.state.states.map(function (s) {
                if (s.id === sid && c) {
                    s.content = c;
                }
                return s;
            });
        };
        _this.getContent = function (sid) {
            var state = _this.getState(sid);
            if (state && (state === null || state === void 0 ? void 0 : state.content)) {
                return state.content;
            }
            return;
        };
        _this.getStateByEvent = function (te) {
            var state;
            if (_this.state.states && _this.state.states.length > 0) {
                _this.state.states.forEach(function (s) {
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
        _this.getTransitionByEvent = function (te) {
            var transition;
            if (_this.state.states && _this.state.states.length > 0) {
                _this.state.states.forEach(function (s) {
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
        _this.isPrivate = function (s) {
            return (s === null || s === void 0 ? void 0 : s.isPrivate) || false;
        };
        _this.setStateParamValue = function (stateId, paramName, paramValue) {
            var state = _this.getState(stateId);
            if (!state) {
                return;
            }
            if (!(state === null || state === void 0 ? void 0 : state.params)) {
                return;
            }
            // @ts-expect-error
            state.params.forEach(function (value, key) {
                var _a;
                if (key === paramName && ((_a = state === null || state === void 0 ? void 0 : state.params) === null || _a === void 0 ? void 0 : _a.set)) {
                    state.params.set(key, paramValue);
                }
            });
            _this.updateState(state);
        };
        _this.clear = function () {
            _this.setState(__assign(__assign({}, _this.state), { states: undefined, currentId: undefined, prevId: undefined }));
        };
        return _this;
    }
    MachineProvider.prototype.render = function () {
        var children = this.props.children;
        var _a = this.state, prevId = _a.prevId, currentId = _a.currentId, currentContent = _a.currentContent, currentPathname = _a.currentPathname, states = _a.states;
        return (React.createElement(MachineContext.Provider, { value: {
                prevId: prevId,
                currentId: currentId,
                currentContent: currentContent,
                currentPathname: currentPathname,
                states: states,
                hasStates: this.hasStates,
                getContent: this.getContent,
                getState: this.getState,
                getStateByEvent: this.getStateByEvent,
                getTransition: this.getTransition,
                getTransitionByEvent: this.getTransitionByEvent,
                isPrivate: this.isPrivate,
                removeState: this.removeState,
                setCurrentId: this.setCurrentId,
                setContent: this.setContent,
                addState: this.addState,
                updateState: this.updateState,
                setTransition: this.setTransition,
                setStateParamValue: this.setStateParamValue,
                clear: this.clear,
            } }, children));
    };
    return MachineProvider;
}(React.Component));
var useMachine = function () { return useContext(MachineContext); };
export default useMachine;
export { MachineContext, MachineProvider };
