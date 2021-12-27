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
Object.defineProperty(exports, "__esModule", { value: true });
var React = __importStar(require("react"));
function StateThree(props) {
    var onGoToStateTwo = props.onGoToStateTwo, onGoToStateOne = props.onGoToStateOne;
    return (React.createElement("div", { className: "state-three" },
        React.createElement("header", null,
            React.createElement("h1", null, "State 3")),
        React.createElement("main", null,
            React.createElement("button", { onClick: onGoToStateOne }, "Go to state 1"),
            React.createElement("button", { onClick: onGoToStateTwo }, "Go to state 2"))));
}
exports.default = StateThree;
