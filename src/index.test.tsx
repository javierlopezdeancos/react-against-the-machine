import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { render } from '@testing-library/react';

import { busMock } from './bus.mock';
import Machine, { State, Transition, Content } from './';
import Component from './components.mock';
import { MachineProvider } from './context';

const contentComponentAId = 'componentA';
const contentComponentBId = 'componentB';

const onTransitionToBStateMock = jest.fn().mockName('onTransitionToBStateMockedFunction');

beforeEach(() => {
  act(() => {
    busMock.publish(`go:to:${contentComponentAId}`);
  });
});

test('Given a State <Machine/> When run to the first time Then should be render only the initial state if is not private', () => {
  const { queryByTestId } = render(
    <div data-testid="app">
      <MachineProvider>
        <Machine initial={contentComponentAId} bus={busMock} logged={false}>
          <State id={contentComponentAId} private={false}>
            <Content>
              <Component id={contentComponentAId} />
            </Content>
            <Transition event={`go:to:${contentComponentBId}`} state={contentComponentBId} />
          </State>

          <State id={contentComponentBId} private={false}>
            <Content>
              <Component id={contentComponentBId} />
            </Content>
            <Transition event={`go:to:${contentComponentAId}`} state={contentComponentAId} />
          </State>
        </Machine>
      </MachineProvider>
    </div>
  );

  const initialStateContentComponent = queryByTestId(contentComponentAId);
  const stateBContentComponent = queryByTestId(contentComponentBId);

  expect(initialStateContentComponent).toBeInTheDocument();
  expect(stateBContentComponent).not.toBeInTheDocument();
});

test('Given a State <Machine/> When a transition event is trigger Then should be render only the final target state to this transition', () => {
  const { queryByTestId } = render(
    <div data-testid="app">
      <MachineProvider>
        <Machine initial={contentComponentAId} bus={busMock} logged={false}>
          <State id={contentComponentAId} private={false}>
            <Content>
              <Component id={contentComponentAId} />
            </Content>
            <Transition event={`go:to:${contentComponentBId}`} state={contentComponentBId} />
          </State>

          <State id={contentComponentBId} private={false}>
            <Content>
              <Component id={contentComponentBId} />
            </Content>
            <Transition event={`go:to:${contentComponentAId}`} state={contentComponentAId} />
          </State>
        </Machine>
      </MachineProvider>
    </div>
  );

  act(() => {
    busMock.publish(`go:to:${contentComponentBId}`);
  });

  const stateAContentComponent = queryByTestId(contentComponentAId);
  const stateBContentComponent = queryByTestId(contentComponentBId);

  expect(stateAContentComponent).not.toBeInTheDocument();
  expect(stateBContentComponent).toBeInTheDocument();
});

test('Given a State <Machine/> When a transition event is trigger and transition has a handler to be executed on enter Then should be executed', () => {
  render(
    <div data-testid="app">
      <MachineProvider>
        <Machine initial={contentComponentAId} bus={busMock} logged={false}>
          <State id={contentComponentAId} private={false}>
            <Content>
              <Component id={contentComponentAId} />
            </Content>
            <Transition
              event={`go:to:${contentComponentBId}`}
              state={contentComponentBId}
              onEnter={onTransitionToBStateMock}
            />
          </State>

          <State id={contentComponentBId} private={false}>
            <Content>
              <Component id={contentComponentBId} />
            </Content>
            <Transition event={`go:to:${contentComponentAId}`} state={contentComponentAId} />
          </State>
        </Machine>
      </MachineProvider>
    </div>
  );

  act(() => {
    busMock.publish(`go:to:${contentComponentBId}`);
  });

  expect(onTransitionToBStateMock.mock.calls.length).toBe(1);
});

test('Given a State <Machine/> When user is no logged And an event is trigger to transition to a private state Then the machine state should transition to initial state', () => {
  const { queryByTestId } = render(
    <div data-testid="app">
      <MachineProvider>
        <Machine initial={contentComponentAId} bus={busMock} logged={false}>
          <State id={contentComponentAId} private={false}>
            <Content>
              <Component id={contentComponentAId} />
            </Content>
            <Transition event={`go:to:${contentComponentBId}`} state={contentComponentBId} />
          </State>

          <State id={contentComponentBId} private>
            <Content>
              <Component id={contentComponentBId} />
            </Content>
            <Transition event={`go:to:${contentComponentAId}`} state={contentComponentAId} />
          </State>
        </Machine>
      </MachineProvider>
    </div>
  );

  act(() => {
    busMock.publish(`go:to:${contentComponentBId}`);
  });

  const initialStateContentComponent = queryByTestId(contentComponentAId);
  const stateBContentComponent = queryByTestId(contentComponentBId);

  expect(initialStateContentComponent).toBeInTheDocument();
  expect(stateBContentComponent).not.toBeInTheDocument();
});

test('Given a State <Machine/> When user is logged And an event is trigger to transition to a private state Then the machine state should transition to initial state', () => {
  const { queryByTestId } = render(
    <div data-testid="app">
      <MachineProvider>
        <Machine initial={contentComponentAId} bus={busMock} logged>
          <State id={contentComponentAId} private={false}>
            <Content>
              <Component id={contentComponentAId} />
            </Content>
            <Transition
              event={`go:to:${contentComponentBId}`}
              state={contentComponentBId}
              onEnter={onTransitionToBStateMock}
            />
          </State>

          <State id={contentComponentBId} private>
            <Content>
              <Component id={contentComponentBId} />
            </Content>
            <Transition event={`go:to:${contentComponentAId}`} state={contentComponentAId} />
          </State>
        </Machine>
      </MachineProvider>
    </div>
  );

  act(() => {
    busMock.publish(`go:to:${contentComponentBId}`);
  });

  const initialStateContentComponent = queryByTestId(contentComponentAId);
  const stateBContentComponent = queryByTestId(contentComponentBId);

  expect(initialStateContentComponent).not.toBeInTheDocument();
  expect(stateBContentComponent).toBeInTheDocument();
});
