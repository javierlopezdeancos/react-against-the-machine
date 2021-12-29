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
exports.useMachine = exports.MachineContext = exports.MachineProvider = exports.Content = exports.Transition = exports.State = void 0;
var react_1 = __importStar(require("react"));
var erre_ele_1 = __importDefault(require("erre-ele"));
var context_1 = __importDefault(require("./context"));
function Machine(props) {
    var initial = props.initial, bus = props.bus, children = props.children, logged = props.logged;
    var mounted = (0, react_1.useRef)(false);
    var machine = (0, context_1.default)();
    var isPathNameHostRoot = (0, react_1.useCallback)(function () {
        var pathname = erre_ele_1.default.getPathnameFromURL();
        return pathname === '' || pathname === '/';
    }, [erre_ele_1.default.getPathnameFromURL]);
    var isPathNameInitialState = (0, react_1.useCallback)(function () {
        var pathname = erre_ele_1.default.getPathnameFromURL();
        return pathname === '/' + initial;
    }, [erre_ele_1.default.getPathnameFromURL, initial]);
    var getStateIdFromURL = (0, react_1.useCallback)(function () {
        var pathname = erre_ele_1.default.getPathnameFromURL();
        var pathsSegments = pathname.split('/');
        return pathsSegments[1];
    }, []);
    var setCurrentStateFromURL = (0, react_1.useCallback)(function () {
        var pathNameIsHostRoot = isPathNameHostRoot();
        var pathNameIsInitialState = isPathNameInitialState();
        var nextStateId = getStateIdFromURL() === '' ? initial : getStateIdFromURL();
        var currentStateId = machine.currentId;
        if (currentStateId === nextStateId && nextStateId !== undefined) {
            return;
        }
        else if (pathNameIsHostRoot || pathNameIsInitialState) {
            if (mounted.current === null) {
                return;
            }
            machine.setCurrentId(initial);
        }
        else {
            if (mounted.current === null) {
                return;
            }
            machine.setCurrentId(nextStateId);
            var nextState_1 = machine.getState(nextStateId);
            if (nextState_1 === null || nextState_1 === void 0 ? void 0 : nextState_1.params) {
                // @ts-expect-error
                nextState_1 === null || nextState_1 === void 0 ? void 0 : nextState_1.params.forEach(function (value, key) {
                    var paramValue = erre_ele_1.default.getParamFromURL(key);
                    if (paramValue) {
                        machine.setStateParamValue(nextState_1.id, key, paramValue);
                    }
                });
                machine.updateState(nextState_1);
            }
            if (nextState_1 === null || nextState_1 === void 0 ? void 0 : nextState_1.onEnter) {
                nextState_1 === null || nextState_1 === void 0 ? void 0 : nextState_1.onEnter(nextState_1 === null || nextState_1 === void 0 ? void 0 : nextState_1.params);
            }
        }
    }, [
        initial,
        machine.currentId,
        machine.setCurrentId,
        machine.getState,
        getStateIdFromURL,
        isPathNameHostRoot,
        isPathNameInitialState,
    ]);
    var storeStateAndTransition = (0, react_1.useCallback)(function (stateId, isPrivate, params, onEnter, event, toStateId, toOnEnter) {
        if (stateId && event && toStateId) {
            var paramsMap_1 = new Map();
            if (params && params.length > 0) {
                params === null || params === void 0 ? void 0 : params.map(function (paramName) {
                    paramsMap_1.set(paramName, undefined);
                });
            }
            machine.addState({
                id: stateId,
                isPrivate: isPrivate,
                params: paramsMap_1,
                onEnter: onEnter,
                to: [],
            });
            var t = {
                id: toStateId,
                event: event,
                onEnter: toOnEnter,
            };
            machine.setTransition(stateId, t);
        }
        return;
    }, [machine]);
    var storeStateAndContent = (0, react_1.useCallback)(function (stateId, isPrivate, params, onEnter, content) {
        if (stateId) {
            var paramsMap_2 = new Map();
            if (params && params.length > 0) {
                params === null || params === void 0 ? void 0 : params.map(function (paramName) {
                    paramsMap_2.set(paramName, undefined);
                });
            }
            machine.addState({
                id: stateId,
                isPrivate: isPrivate,
                params: paramsMap_2,
                onEnter: onEnter,
                to: [],
            });
            machine.setContent(stateId, content);
        }
    }, [machine]);
    var clearBus = (0, react_1.useCallback)(function () {
        bus.clear();
    }, [bus]);
    var runMachineOnPopBrowserHistory = (0, react_1.useCallback)(function (browserHistoryPopEvent) {
        var _a, _b, _c, _d, _e;
        var isABrowserHistoryEventWithAValidPathname = browserHistoryPopEvent && ((_c = (_b = (_a = browserHistoryPopEvent === null || browserHistoryPopEvent === void 0 ? void 0 : browserHistoryPopEvent.currentTarget) === null || _a === void 0 ? void 0 : _a.document) === null || _b === void 0 ? void 0 : _b.location) === null || _c === void 0 ? void 0 : _c.pathname);
        if (isABrowserHistoryEventWithAValidPathname) {
            erre_ele_1.default.pathname = (_e = (_d = browserHistoryPopEvent === null || browserHistoryPopEvent === void 0 ? void 0 : browserHistoryPopEvent.currentTarget.document) === null || _d === void 0 ? void 0 : _d.location) === null || _e === void 0 ? void 0 : _e.pathname;
            setCurrentStateFromURL();
            return;
        }
    }, [setCurrentStateFromURL]);
    var subscribeToBrowserHistoryEvents = (0, react_1.useCallback)(function () {
        erre_ele_1.default.setOnPopState(runMachineOnPopBrowserHistory);
    }, [erre_ele_1.default, runMachineOnPopBrowserHistory]);
    var unSubscribeToBrowserHistoryEvents = (0, react_1.useCallback)(function () {
        erre_ele_1.default.unSubscribeOnPopState();
    }, [erre_ele_1.default]);
    var messageHandler = (0, react_1.useCallback)(function (message, data) {
        var transition = machine.getTransitionByEvent(message);
        var stateToTransition = machine.getStateByEvent(message);
        var currentStateId = getStateIdFromURL() === '' ? initial : getStateIdFromURL();
        var stateToTransitionIsTheInitialState = (stateToTransition === null || stateToTransition === void 0 ? void 0 : stateToTransition.id) === initial;
        if ((stateToTransition === null || stateToTransition === void 0 ? void 0 : stateToTransition.id) === currentStateId) {
            return;
        }
        if (stateToTransition && transition) {
            var isStateToTransitionPrivate = machine.isPrivate(stateToTransition);
            if ((isStateToTransitionPrivate && logged) || !isStateToTransitionPrivate) {
                if (stateToTransitionIsTheInitialState) {
                    erre_ele_1.default.go('/');
                }
                else {
                    erre_ele_1.default.go('/' + stateToTransition.id);
                }
                if (transition === null || transition === void 0 ? void 0 : transition.onEnter) {
                    transition.onEnter(data);
                }
            }
            else {
                erre_ele_1.default.go('/');
            }
        }
        setCurrentStateFromURL();
    }, [machine, erre_ele_1.default, logged, initial]);
    var storeStates = (0, react_1.useCallback)(function () {
        var stateComponents = children;
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
                        storeStateAndTransition((_c = stateComponent === null || stateComponent === void 0 ? void 0 : stateComponent.props) === null || _c === void 0 ? void 0 : _c.id, (_d = stateComponent === null || stateComponent === void 0 ? void 0 : stateComponent.props) === null || _d === void 0 ? void 0 : _d.private, (_e = stateComponent === null || stateComponent === void 0 ? void 0 : stateComponent.props) === null || _e === void 0 ? void 0 : _e.params, (_f = stateComponent === null || stateComponent === void 0 ? void 0 : stateComponent.props) === null || _f === void 0 ? void 0 : _f.onEnter, (_g = transitionComponent === null || transitionComponent === void 0 ? void 0 : transitionComponent.props) === null || _g === void 0 ? void 0 : _g.event, (_h = transitionComponent === null || transitionComponent === void 0 ? void 0 : transitionComponent.props) === null || _h === void 0 ? void 0 : _h.state, (_j = transitionComponent === null || transitionComponent === void 0 ? void 0 : transitionComponent.props) === null || _j === void 0 ? void 0 : _j.onEnter);
                        if ((_k = transitionComponent === null || transitionComponent === void 0 ? void 0 : transitionComponent.props) === null || _k === void 0 ? void 0 : _k.event) {
                            bus.subscribe((_l = transitionComponent === null || transitionComponent === void 0 ? void 0 : transitionComponent.props) === null || _l === void 0 ? void 0 : _l.event, messageHandler);
                        }
                    }
                    else if (!componentIsATransitionComponent && componentIsAContentComponent) {
                        storeStateAndContent((_m = stateComponent === null || stateComponent === void 0 ? void 0 : stateComponent.props) === null || _m === void 0 ? void 0 : _m.id, (_o = stateComponent === null || stateComponent === void 0 ? void 0 : stateComponent.props) === null || _o === void 0 ? void 0 : _o.private, (_p = stateComponent === null || stateComponent === void 0 ? void 0 : stateComponent.props) === null || _p === void 0 ? void 0 : _p.params, (_q = stateComponent === null || stateComponent === void 0 ? void 0 : stateComponent.props) === null || _q === void 0 ? void 0 : _q.onEnter, stateComponentChild.props.children);
                    }
                });
            }
        });
    }, [storeStateAndContent, storeStateAndTransition, bus, children, messageHandler]);
    var startMachine = (0, react_1.useCallback)(function () {
        clearBus();
        var stateComponents = children;
        var thereAreStatesComponents = (stateComponents === null || stateComponents === void 0 ? void 0 : stateComponents.length) > 0;
        if (thereAreStatesComponents) {
            storeStates();
            setCurrentStateFromURL();
            subscribeToBrowserHistoryEvents();
        }
        return;
    }, [children, storeStates, setCurrentStateFromURL, subscribeToBrowserHistoryEvents]);
    (0, react_1.useEffect)(function () {
        var prevCurrentId = machine.prevId;
        var currentId = machine.currentId;
        var stateToTransitionIsTheInitialLoad = machine.currentContent === null && prevCurrentId === undefined && currentId === undefined;
        if (stateToTransitionIsTheInitialLoad || prevCurrentId !== currentId) {
            if (stateToTransitionIsTheInitialLoad) {
                startMachine();
            }
        }
        return function () {
            unSubscribeToBrowserHistoryEvents();
        };
    }, [machine.prevId, machine.currentId, machine.currentContent, unSubscribeToBrowserHistoryEvents, startMachine]);
    var content = (0, react_1.useMemo)(function () { return machine.currentContent; }, [machine.currentContent]);
    // @ts-expect-error
    return react_1.default.createElement("div", { ref: mounted }, content);
}
exports.default = Machine;
function State(_a) {
    var children = _a.children;
    return react_1.default.createElement(react_1.default.Fragment, null, children);
}
exports.State = State;
// @ts-expect-error
function Transition(props) {
    return null;
}
exports.Transition = Transition;
function Content(_a) {
    var children = _a.children;
    return react_1.default.createElement(react_1.default.Fragment, null, children);
}
exports.Content = Content;
var context_2 = require("./context");
Object.defineProperty(exports, "MachineProvider", { enumerable: true, get: function () { return context_2.MachineProvider; } });
Object.defineProperty(exports, "MachineContext", { enumerable: true, get: function () { return context_2.MachineContext; } });
var context_3 = require("./context");
Object.defineProperty(exports, "useMachine", { enumerable: true, get: function () { return __importDefault(context_3).default; } });
