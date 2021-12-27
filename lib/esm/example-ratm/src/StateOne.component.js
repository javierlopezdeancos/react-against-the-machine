import * as React from 'react';
function StateOne(props) {
    var onGoToStateTwo = props.onGoToStateTwo, onGoToStateThree = props.onGoToStateThree;
    return (React.createElement("div", { className: "state-one" },
        React.createElement("header", null,
            React.createElement("h1", null, "State 1")),
        React.createElement("main", null,
            React.createElement("button", { onClick: onGoToStateTwo }, "Go to state 2"),
            React.createElement("button", { onClick: onGoToStateThree }, "Go to state 3"))));
}
export default StateOne;
