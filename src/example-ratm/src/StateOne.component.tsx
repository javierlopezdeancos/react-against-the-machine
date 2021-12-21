import * as React from 'react';

export interface IStateOneProps {
  onGoToStateTwo: () => void;
  onGoToStateThree: () => void;
}

function StateOne(props: IStateOneProps) {
  const { onGoToStateTwo, onGoToStateThree } = props;

  return (
    <div className="state-one">
      <header>
        <h1>State 1</h1>
      </header>
      <main>
        <button onClick={onGoToStateTwo}>Go to state 2</button>
        <button onClick={onGoToStateThree}>Go to state 3</button>
      </main>
    </div>
  );
}

export default StateOne;
