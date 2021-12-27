import * as React from 'react';
function StateTwo(props) {
    var onGoToStateThree = props.onGoToStateThree, onGoToStateOne = props.onGoToStateOne;
    return (React.createElement("div", { className: "state-two" },
        React.createElement("header", null,
            React.createElement("h1", null, "State 2")),
        React.createElement("main", null,
            React.createElement("button", { onClick: onGoToStateThree }, "Go to state 3"),
            React.createElement("button", { onClick: onGoToStateOne }, "Go to state 1"))));
}
export default StateTwo;
