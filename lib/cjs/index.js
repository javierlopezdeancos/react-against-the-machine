"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mechanism = exports.mechanism = exports.Content = exports.Transition = exports.State = void 0;
var react_1 = __importStar(require("react"));
var erre_ele_1 = __importDefault(require("erre-ele"));
var mechanism_1 = require("./mechanism");
function Machine(props) {
    var initial = props.initial, bus = props.bus, children = props.children, logged = props.logged;
    var _a = (0, react_1.useState)(), content = _a[0], setContent = _a[1];
    var getStateIdFromURL = (0, react_1.useCallback)(function () {
        var pathname = erre_ele_1.default.getPathnameFromURL();
        var pathsSegments = pathname.split('/');
        return pathsSegments[1];
    }, []);
    var setCurrentPath = (0, react_1.useCallback)(function () {
        var stateId = getStateIdFromURL();
        if (stateId) {
            erre_ele_1.default.pathname = '/' + stateId;
        }
        else {
            erre_ele_1.default.pathname = '/';
        }
    }, [getStateIdFromURL]);
    var onHistoryChange = (0, react_1.useCallback)(function () {
        setCurrentPath();
    }, [setCurrentPath]);
    erre_ele_1.default.setOnPopState(onHistoryChange);
    var setCurrentState = (0, react_1.useCallback)(function () {
        var initialState = mechanism_1.mechanism.getState(initial);
        if (erre_ele_1.default.pathname === '/' || erre_ele_1.default.pathname === '/' + (initialState === null || initialState === void 0 ? void 0 : initialState.id)) {
            mechanism_1.mechanism.currentId = initialState === null || initialState === void 0 ? void 0 : initialState.id;
        }
        else {
            var stateId = getStateIdFromURL();
            mechanism_1.mechanism.currentId = stateId;
        }
    }, [initial, mechanism_1.mechanism, getStateIdFromURL]);
    var getCurrentStateParamsFromURL = (0, react_1.useCallback)(function () {
        var _a;
        var stateId = mechanism_1.mechanism.currentId;
        if (!stateId) {
            return;
        }
        var state = mechanism_1.mechanism.getState(stateId);
        var params = new Map();
        if (!(state === null || state === void 0 ? void 0 : state.params)) {
            return;
        }
        (_a = state === null || state === void 0 ? void 0 : state.params) === null || _a === void 0 ? void 0 : _a.forEach(function (paramName) {
            var paramValue = erre_ele_1.default.getParamFromURL(paramName);
            if (paramName && paramValue) {
                params === null || params === void 0 ? void 0 : params.set(paramName, paramValue);
            }
        });
        if (params.size === 0) {
            return;
        }
        return params;
    }, [mechanism_1.mechanism]);
    var setConfigurationToCurrentState = (0, react_1.useCallback)(function () {
        setCurrentPath();
        setCurrentState();
        var currentId = mechanism_1.mechanism.currentId;
        if (!currentId) {
            return;
        }
        var currentState = mechanism_1.mechanism.getState(currentId);
        if (currentState === null || currentState === void 0 ? void 0 : currentState.content) {
            setContent(currentState.content);
        }
        if (currentState === null || currentState === void 0 ? void 0 : currentState.onEnter) {
            var params = getCurrentStateParamsFromURL();
            currentState === null || currentState === void 0 ? void 0 : currentState.onEnter(params);
        }
    }, [setCurrentPath, setCurrentState, getCurrentStateParamsFromURL, mechanism_1.mechanism]);
    var messageHandler = (0, react_1.useCallback)(function (message, data) {
        var transition = mechanism_1.mechanism.getTransitionByEvent(message);
        var stateToTransitionTo = mechanism_1.mechanism.getStateByEvent(message);
        if (stateToTransitionTo && transition) {
            var isStateToTransitionPrivate = mechanism_1.mechanism.isPrivate(stateToTransitionTo);
            if ((isStateToTransitionPrivate && logged) || !isStateToTransitionPrivate) {
                erre_ele_1.default.go('/' + stateToTransitionTo.id);
                mechanism_1.mechanism.currentId = stateToTransitionTo === null || stateToTransitionTo === void 0 ? void 0 : stateToTransitionTo.id;
                if (transition === null || transition === void 0 ? void 0 : transition.onEnter) {
                    transition.onEnter(data);
                }
            }
            else {
                erre_ele_1.default.go('/');
            }
        }
        setConfigurationToCurrentState();
    }, [mechanism_1.mechanism, setConfigurationToCurrentState, logged]);
    var addStateAndTransitionToMechanism = (0, react_1.useCallback)(function (stateId, isPrivate, params, onEnter, event, toStateId, toOnEnter) {
        if (stateId && event && toStateId) {
            mechanism_1.mechanism.setState({
                id: stateId,
                isPrivate: isPrivate,
                params: params,
                onEnter: onEnter,
                to: [],
            });
            var t = {
                id: toStateId,
                event: event,
                onEnter: toOnEnter,
            };
            mechanism_1.mechanism.setTransition(stateId, t);
        }
        return;
    }, [mechanism_1.mechanism]);
    var addStateAndContentToMechanism = (0, react_1.useCallback)(function (stateId, isPrivate, params, onEnter, content) {
        if (stateId) {
            mechanism_1.mechanism.setState({
                id: stateId,
                isPrivate: isPrivate,
                params: params,
                onEnter: onEnter,
                to: [],
            });
            mechanism_1.mechanism.setContent(stateId, content);
        }
    }, [mechanism_1.mechanism]);
    var startUpMechanism = (0, react_1.useCallback)(function () {
        var stateComponents = children;
        var thereAreStatesComponents = (stateComponents === null || stateComponents === void 0 ? void 0 : stateComponents.length) > 0;
        if (thereAreStatesComponents) {
            // eslint-disable-next-line
            stateComponents.map(function (stateComponent) {
                var _a, _b;
                var componentIsAStateComponent = ((_a = stateComponent === null || stateComponent === void 0 ? void 0 : stateComponent.type) === null || _a === void 0 ? void 0 : _a.name) === 'State';
                if (componentIsAStateComponent) {
                    (_b = stateComponent === null || stateComponent === void 0 ? void 0 : stateComponent.props) === null || _b === void 0 ? void 0 : _b.children.forEach(function (stateComponentChild) {
                        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
                        var componentIsATransitionComponent = ((_a = stateComponentChild === null || stateComponentChild === void 0 ? void 0 : stateComponentChild.type) === null || _a === void 0 ? void 0 : _a.name) === 'Transition';
                        var componentIsAContentComponent = ((_b = stateComponentChild === null || stateComponentChild === void 0 ? void 0 : stateComponentChild.type) === null || _b === void 0 ? void 0 : _b.name) === 'Content';
                        if (componentIsATransitionComponent && !componentIsAContentComponent) {
                            var transitionComponent = stateComponentChild;
                            addStateAndTransitionToMechanism((_c = stateComponent === null || stateComponent === void 0 ? void 0 : stateComponent.props) === null || _c === void 0 ? void 0 : _c.id, (_d = stateComponent === null || stateComponent === void 0 ? void 0 : stateComponent.props) === null || _d === void 0 ? void 0 : _d.private, (_e = stateComponent === null || stateComponent === void 0 ? void 0 : stateComponent.props) === null || _e === void 0 ? void 0 : _e.params, (_f = stateComponent === null || stateComponent === void 0 ? void 0 : stateComponent.props) === null || _f === void 0 ? void 0 : _f.onEnter, (_g = transitionComponent === null || transitionComponent === void 0 ? void 0 : transitionComponent.props) === null || _g === void 0 ? void 0 : _g.event, (_h = transitionComponent === null || transitionComponent === void 0 ? void 0 : transitionComponent.props) === null || _h === void 0 ? void 0 : _h.state, (_j = transitionComponent === null || transitionComponent === void 0 ? void 0 : transitionComponent.props) === null || _j === void 0 ? void 0 : _j.onEnter);
                            if ((_k = transitionComponent === null || transitionComponent === void 0 ? void 0 : transitionComponent.props) === null || _k === void 0 ? void 0 : _k.event) {
                                bus.subscribe((_l = transitionComponent === null || transitionComponent === void 0 ? void 0 : transitionComponent.props) === null || _l === void 0 ? void 0 : _l.event, messageHandler);
                            }
                        }
                        else if (!componentIsATransitionComponent && componentIsAContentComponent) {
                            addStateAndContentToMechanism((_m = stateComponent === null || stateComponent === void 0 ? void 0 : stateComponent.props) === null || _m === void 0 ? void 0 : _m.id, (_o = stateComponent === null || stateComponent === void 0 ? void 0 : stateComponent.props) === null || _o === void 0 ? void 0 : _o.private, (_p = stateComponent === null || stateComponent === void 0 ? void 0 : stateComponent.props) === null || _p === void 0 ? void 0 : _p.params, (_q = stateComponent === null || stateComponent === void 0 ? void 0 : stateComponent.props) === null || _q === void 0 ? void 0 : _q.onEnter, stateComponentChild.props.children);
                        }
                    });
                }
            });
        }
        setConfigurationToCurrentState();
    }, [
        addStateAndContentToMechanism,
        addStateAndTransitionToMechanism,
        bus,
        children,
        messageHandler,
        setConfigurationToCurrentState,
    ]);
    (0, react_1.useEffect)(function () {
        bus.clear();
        startUpMechanism();
    }, [startUpMechanism, bus]);
    return react_1.default.createElement(react_1.default.Fragment, null, content ? content : null);
}
exports.default = Machine;
function State(_a) {
    var children = _a.children;
    return react_1.default.createElement(react_1.default.Fragment, null, children);
}
exports.State = State;
// @ts-expect-error: Let's ignore a compile error
function Transition(props) {
    return null;
}
exports.Transition = Transition;
function Content(_a) {
    var children = _a.children;
    return react_1.default.createElement(react_1.default.Fragment, null, children);
}
exports.Content = Content;
var mechanism_2 = require("./mechanism");
Object.defineProperty(exports, "mechanism", { enumerable: true, get: function () { return mechanism_2.mechanism; } });
var mechanism_3 = require("./mechanism");
Object.defineProperty(exports, "Mechanism", { enumerable: true, get: function () { return __importDefault(mechanism_3).default; } });
