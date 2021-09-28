import React, { useEffect, useCallback, useState } from 'react';
import rl from 'erre-ele';
import { mechanism } from './mechanism';
export default function Machine(props) {
    var initial = props.initial, bus = props.bus, children = props.children, logged = props.logged;
    var _a = useState(), content = _a[0], setContent = _a[1];
    var getStateIdFromURL = useCallback(function () {
        var pathname = rl.getPathnameFromURL();
        var pathsSegments = pathname.split('/');
        return pathsSegments[1];
    }, []);
    var setCurrentPath = useCallback(function () {
        var stateId = getStateIdFromURL();
        if (stateId) {
            rl.pathname = '/' + stateId;
        }
        else {
            rl.pathname = '/';
        }
    }, [getStateIdFromURL]);
    var onHistoryChange = useCallback(function () {
        setCurrentPath();
    }, [setCurrentPath]);
    rl.setOnPopState(onHistoryChange);
    var setCurrentState = useCallback(function () {
        var initialState = mechanism.getState(initial);
        if (rl.pathname === '/' || rl.pathname === '/' + (initialState === null || initialState === void 0 ? void 0 : initialState.id)) {
            mechanism.currentId = initialState === null || initialState === void 0 ? void 0 : initialState.id;
        }
        else {
            var stateId = getStateIdFromURL();
            mechanism.currentId = stateId;
        }
    }, [initial, mechanism, getStateIdFromURL]);
    var getCurrentStateParamsFromURL = useCallback(function () {
        var _a;
        var stateId = mechanism.currentId;
        if (!stateId) {
            return;
        }
        var state = mechanism.getState(stateId);
        var params = new Map();
        if (!(state === null || state === void 0 ? void 0 : state.params)) {
            return;
        }
        (_a = state === null || state === void 0 ? void 0 : state.params) === null || _a === void 0 ? void 0 : _a.forEach(function (paramName) {
            var paramValue = rl.getParamFromURL(paramName);
            if (paramName && paramValue) {
                params === null || params === void 0 ? void 0 : params.set(paramName, paramValue);
            }
        });
        if (params.size === 0) {
            return;
        }
        return params;
    }, [mechanism]);
    var setConfigurationToCurrentState = useCallback(function () {
        setCurrentPath();
        setCurrentState();
        var currentId = mechanism.currentId;
        if (!currentId) {
            return;
        }
        var currentState = mechanism.getState(currentId);
        if (currentState === null || currentState === void 0 ? void 0 : currentState.content) {
            setContent(currentState.content);
        }
        if (currentState === null || currentState === void 0 ? void 0 : currentState.onEnter) {
            var params = getCurrentStateParamsFromURL();
            currentState === null || currentState === void 0 ? void 0 : currentState.onEnter(params);
        }
    }, [setCurrentPath, setCurrentState, getCurrentStateParamsFromURL, mechanism]);
    var messageHandler = useCallback(function (message, data) {
        var transition = mechanism.getTransitionByEvent(message);
        var stateToTransitionTo = mechanism.getStateByEvent(message);
        if (stateToTransitionTo && transition) {
            var isStateToTransitionPrivate = mechanism.isPrivate(stateToTransitionTo);
            if ((isStateToTransitionPrivate && logged) || !isStateToTransitionPrivate) {
                rl.go('/' + stateToTransitionTo.id);
                mechanism.currentId = stateToTransitionTo === null || stateToTransitionTo === void 0 ? void 0 : stateToTransitionTo.id;
                if (transition === null || transition === void 0 ? void 0 : transition.onEnter) {
                    transition.onEnter(data);
                }
            }
            else {
                rl.go('/');
            }
        }
        setConfigurationToCurrentState();
    }, [mechanism, setConfigurationToCurrentState, logged]);
    var addStateAndTransitionToMechanism = useCallback(function (stateId, isPrivate, params, onEnter, event, toStateId, toOnEnter) {
        if (stateId && event && toStateId) {
            mechanism.setState({
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
            mechanism.setTransition(stateId, t);
        }
        return;
    }, [mechanism]);
    var addStateAndContentToMechanism = useCallback(function (stateId, isPrivate, params, onEnter, content) {
        if (stateId) {
            mechanism.setState({
                id: stateId,
                isPrivate: isPrivate,
                params: params,
                onEnter: onEnter,
                to: [],
            });
            mechanism.setContent(stateId, content);
        }
    }, [mechanism]);
    var startUpMechanism = useCallback(function () {
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
    useEffect(function () {
        bus.clear();
        startUpMechanism();
    }, [startUpMechanism, bus]);
    return React.createElement(React.Fragment, null, content ? content : null);
}
export function State(_a) {
    var children = _a.children;
    return React.createElement(React.Fragment, null, children);
}
// @ts-expect-error: Let's ignore a compile error
export function Transition(props) {
    return null;
}
export function Content(_a) {
    var children = _a.children;
    return React.createElement(React.Fragment, null, children);
}
export { mechanism } from './mechanism';
export { default as Mechanism } from './mechanism';
