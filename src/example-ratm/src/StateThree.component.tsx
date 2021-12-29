import React, { useMemo } from 'react';

import useMachine from '../../context';

export interface IStateOneProps {
  onGoToStateTwo: () => void;
  onGoToStateOne: () => void;
}

function StateThree(props: IStateOneProps) {
  const { onGoToStateTwo, onGoToStateOne } = props;

  const machine = useMachine();
  const state = machine.getState('StateThree');

  const code = useMemo(() => {
    if (state && state?.params) {
      const { params } = state;
      return params?.get('code');
    }
  }, [state]);

  return (
    <div className="state-three">
      <header>
        <h1>State 3</h1>
        {code && <h2>Your code param value in url is {code}</h2>}
      </header>
      <main>
        <button onClick={onGoToStateOne}>Go to state 1</button>
        <button onClick={onGoToStateTwo}>Go to state 2</button>
      </main>
    </div>
  );
}

export default StateThree;
