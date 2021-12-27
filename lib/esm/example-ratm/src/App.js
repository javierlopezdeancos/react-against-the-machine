import React from 'react';
import Machine, { MachineProvider, State, Transition, Content } from '../../index';
import { laGuaGua as bus } from 'laguagua';
import StateOne from './StateOne.component';
import StateTwo from './StateTwo.component';
import StateThree from './StateThree.component';
import './App.css';
var goToStateOne = function () { return bus.publish('go::one'); };
var goToStateTwo = function () { return bus.publish('go::two'); };
var goToStateThree = function () { return bus.publish('go::three'); };
function App() {
    return (React.createElement(MachineProvider, null,
        React.createElement(Machine, { initial: "StateOne", bus: bus, logged: false },
            React.createElement(State, { id: "StateOne", private: false },
                React.createElement(Content, null,
                    React.createElement(StateOne, { onGoToStateTwo: goToStateTwo, onGoToStateThree: goToStateThree })),
                React.createElement(Transition, { event: "go::two", state: "StateTwo" }),
                React.createElement(Transition, { event: "go::three", state: "StateThree" })),
            React.createElement(State, { id: "StateTwo", private: true },
                React.createElement(Content, null,
                    React.createElement(StateTwo, { onGoToStateOne: goToStateOne, onGoToStateThree: goToStateThree })),
                React.createElement(Transition, { event: "go::one", state: "StateOne" }),
                React.createElement(Transition, { event: "go::three", state: "StateThree" })),
            React.createElement(State, { id: "StateThree", private: false },
                React.createElement(Content, null,
                    React.createElement(StateThree, { onGoToStateTwo: goToStateTwo, onGoToStateOne: goToStateOne })),
                React.createElement(Transition, { event: "go::one", state: "StateOne" }),
                React.createElement(Transition, { event: "go::two", state: "StateTwo" })))));
}
export default App;
