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
var react_1 = __importDefault(require("react"));
var index_1 = __importStar(require("../../index"));
var laguagua_1 = require("laguagua");
var StateOne_component_1 = __importDefault(require("./StateOne.component"));
var StateTwo_component_1 = __importDefault(require("./StateTwo.component"));
var StateThree_component_1 = __importDefault(require("./StateThree.component"));
require("./App.css");
var goToStateOne = function () { return laguagua_1.laGuaGua.publish('go::one'); };
var goToStateTwo = function () { return laguagua_1.laGuaGua.publish('go::two'); };
var goToStateThree = function () { return laguagua_1.laGuaGua.publish('go::three'); };
function App() {
    return (react_1.default.createElement(index_1.MachineProvider, null,
        react_1.default.createElement(index_1.default, { initial: "StateOne", bus: laguagua_1.laGuaGua, logged: false },
            react_1.default.createElement(index_1.State, { id: "StateOne", private: false },
                react_1.default.createElement(index_1.Content, null,
                    react_1.default.createElement(StateOne_component_1.default, { onGoToStateTwo: goToStateTwo, onGoToStateThree: goToStateThree })),
                react_1.default.createElement(index_1.Transition, { event: "go::two", state: "StateTwo" }),
                react_1.default.createElement(index_1.Transition, { event: "go::three", state: "StateThree" })),
            react_1.default.createElement(index_1.State, { id: "StateTwo", private: true },
                react_1.default.createElement(index_1.Content, null,
                    react_1.default.createElement(StateTwo_component_1.default, { onGoToStateOne: goToStateOne, onGoToStateThree: goToStateThree })),
                react_1.default.createElement(index_1.Transition, { event: "go::one", state: "StateOne" }),
                react_1.default.createElement(index_1.Transition, { event: "go::three", state: "StateThree" })),
            react_1.default.createElement(index_1.State, { id: "StateThree", private: false },
                react_1.default.createElement(index_1.Content, null,
                    react_1.default.createElement(StateThree_component_1.default, { onGoToStateTwo: goToStateTwo, onGoToStateOne: goToStateOne })),
                react_1.default.createElement(index_1.Transition, { event: "go::one", state: "StateOne" }),
                react_1.default.createElement(index_1.Transition, { event: "go::two", state: "StateTwo" })))));
}
exports.default = App;
