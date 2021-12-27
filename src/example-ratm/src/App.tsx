import React from 'react';

import Machine, { MachineProvider, State, Transition, Content } from '../../index';

import { laGuaGua as bus } from 'laguagua';

import StateOne from './StateOne.component';
import StateTwo from './StateTwo.component';
import StateThree from './StateThree.component';

import './App.css';

const goToStateOne = () => bus.publish('go::one');

const goToStateTwo = () => bus.publish('go::two');

const goToStateThree = () => bus.publish('go::three');

function App() {
  return (
    <MachineProvider>
      <Machine initial="StateOne" bus={bus} logged={false}>
        <State id="StateOne" private={false}>
          <Content>
            <StateOne onGoToStateTwo={goToStateTwo} onGoToStateThree={goToStateThree} />
          </Content>
          <Transition event="go::two" state="StateTwo" />
          <Transition event="go::three" state="StateThree" />
        </State>

        <State id="StateTwo" private={true}>
          <Content>
            <StateTwo onGoToStateOne={goToStateOne} onGoToStateThree={goToStateThree} />
          </Content>
          <Transition event="go::one" state="StateOne" />
          <Transition event="go::three" state="StateThree" />
        </State>

        <State id="StateThree" private={false}>
          <Content>
            <StateThree onGoToStateTwo={goToStateTwo} onGoToStateOne={goToStateOne} />
          </Content>
          <Transition event="go::one" state="StateOne" />
          <Transition event="go::two" state="StateTwo" />
        </State>
      </Machine>
    </MachineProvider>
  );
}

export default App;
