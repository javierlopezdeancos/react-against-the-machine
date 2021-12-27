import * as React from 'react';

export interface IStateOneProps {
  onGoToStateOne: () => void;
  onGoToStateThree: () => void;
}

function StateTwo(props: IStateOneProps) {
  const { onGoToStateThree, onGoToStateOne } = props;

  return (
    <div className="state-two">
      <header>
        <h1>State 2</h1>
      </header>
      <main>
        <button onClick={onGoToStateThree}>Go to state 3</button>
        <button onClick={onGoToStateOne}>Go to state 1</button>
      </main>
    </div>
  );
}

export default StateTwo;
