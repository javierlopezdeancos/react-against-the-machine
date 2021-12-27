import * as React from 'react';
function StateThree(props) {
    var onGoToStateTwo = props.onGoToStateTwo, onGoToStateOne = props.onGoToStateOne;
    return (React.createElement("div", { className: "state-three" },
        React.createElement("header", null,
            React.createElement("h1", null, "State 3")),
        React.createElement("main", null,
            React.createElement("button", { onClick: onGoToStateOne }, "Go to state 1"),
            React.createElement("button", { onClick: onGoToStateTwo }, "Go to state 2"))));
}
export default StateThree;
