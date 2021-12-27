import * as React from 'react';

export interface IStateOneProps {
  onGoToStateTwo: () => void;
  onGoToStateOne: () => void;
}

function StateThree(props: IStateOneProps) {
  const { onGoToStateTwo, onGoToStateOne } = props;

  return (
    <div className="state-three">
      <header>
        <h1>State 3</h1>
      </header>
      <main>
        <button onClick={onGoToStateOne}>Go to state 1</button>
        <button onClick={onGoToStateTwo}>Go to state 2</button>
      </main>
    </div>
  );
}

export default StateThree;
