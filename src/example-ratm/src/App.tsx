import React from 'react';
import { laGuaGua as bus } from 'laguagua';

import Machine, { MachineProvider, State, Transition, Content } from '../../index';
import StateOne from './StateOne.component';
import StateTwo from './StateTwo.component';
import StateThree from './StateThree.component';

import './App.css';

function App() {
  const goToStateOne = () => bus.publish('go:to:one');

  const goToStateTwo = () => bus.publish('go:to:two');

  const goToStateThree = () => {
    bus.publish('go:to:three');
  };

  const handlerEnterStateThree = (params?: Map<string, string>): void => {
    if (!params || !params?.has) {
      return;
    }

    const codeValue = params?.get('code');

    if (codeValue) {
      console.log('code param in URL has value: ', codeValue);
    }
  };

  return (
    <MachineProvider>
      <Machine initial="StateOne" bus={bus} logged={true}>
        <State id="StateOne" private={false}>
          <Content>
            <StateOne onGoToStateTwo={goToStateTwo} onGoToStateThree={goToStateThree} />
          </Content>
          <Transition event="go:to:two" state="StateTwo" />
          <Transition event="go:to:three" state="StateThree" />
        </State>

        <State id="StateTwo" private={true}>
          <Content>
            <StateTwo onGoToStateOne={goToStateOne} onGoToStateThree={goToStateThree} />
          </Content>
          <Transition event="go:to:one" state="StateOne" />
          <Transition event="go:to:three" state="StateThree" />
        </State>

        <State id="StateThree" private={false} params={['code']} onEnter={handlerEnterStateThree}>
          <Content>
            <StateThree onGoToStateTwo={goToStateTwo} onGoToStateOne={goToStateOne} />
          </Content>
          <Transition event="go:to:one" state="StateOne" />
          <Transition event="go:to:two" state="StateTwo" />
        </State>
      </Machine>
    </MachineProvider>
  );
}

export default App;
