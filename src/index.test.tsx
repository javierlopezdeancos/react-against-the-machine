import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { render, RenderResult } from '@testing-library/react';

import { busMock } from './bus.mock';
import Machine, { State, Transition, Content, IBus } from './';
import { ComponentA, ComponentB } from './components.mock';

const componentAId = 'componentA';
const componentBId = 'componentB';

const onTransitionToComponentBMock = jest.fn((): boolean => true);

interface IRenderMachine {
  logged: boolean;
  bus: IBus;
  componentAIsPrivate: boolean;
  componentBIsPrivate: boolean;
  onTransitionToComponentBMock: jest.Mock<boolean, []>;
}

const renderMachine = (props: IRenderMachine): RenderResult =>
  render(
    <div data-testid="app">
      <Machine initial={componentAId} bus={props.bus} logged={props.logged}>
        <State id={componentAId} private={props.componentAIsPrivate}>
          <Content>
            <ComponentA id={componentAId} />
          </Content>
          <Transition
            event={`go:to:${componentBId}`}
            state={componentBId}
            onEnter={props.onTransitionToComponentBMock}
          />
        </State>

        <State id={componentBId} private={props.componentBIsPrivate}>
          <Content>
            <ComponentB id={componentBId} />
          </Content>
          <Transition event={`go:to:${componentAId}`} state={componentAId} />
        </State>
      </Machine>
    </div>
  );

describe('Given a State <Machine/>', () => {
  afterEach(() => {
    onTransitionToComponentBMock.mockClear();
  });

  it('When run to the first time then should be render only the initial state if is not private', () => {
    const documentBody = renderMachine({
      logged: true,
      bus: busMock,
      componentAIsPrivate: false,
      componentBIsPrivate: false,
      onTransitionToComponentBMock,
    });

    const componentANode = documentBody.queryByTestId(componentAId);
    const componentBNode = documentBody.queryByTestId(componentBId);

    expect(componentANode).toBeInTheDocument();
    expect(componentBNode).not.toBeInTheDocument();
  });

  it('When a transition event is trigger then should be render only the final target state to this transition', () => {
    const documentBody = renderMachine({
      logged: true,
      bus: busMock,
      componentAIsPrivate: false,
      componentBIsPrivate: false,
      onTransitionToComponentBMock,
    });

    act(() => {
      busMock.publish(`go:to:${componentBId}`);
    });

    const componentANode = documentBody.queryByTestId(componentAId);
    const componentBNode = documentBody.queryByTestId(componentBId);

    expect(componentANode).not.toBeInTheDocument();
    expect(componentBNode).toBeInTheDocument();
  });

  it('When a transition event is trigger and transition has a handler to be executed on enter then should be executed', () => {
    renderMachine({
      logged: true,
      bus: busMock,
      componentAIsPrivate: false,
      componentBIsPrivate: false,
      onTransitionToComponentBMock,
    });

    act(() => {
      busMock.publish(`go:to:${componentBId}`);
    });

    expect(onTransitionToComponentBMock.mock.calls.length).toBe(1);
  });

  it('When the user is logged and', () => {
    const documentBody = renderMachine({
      logged: true,
      bus: busMock,
      componentAIsPrivate: true,
      componentBIsPrivate: true,
      onTransitionToComponentBMock,
    });

    const componentANode = documentBody.queryByTestId(componentAId);
    const componentBNode = documentBody.queryByTestId(componentBId);

    expect(componentANode).not.toBeInTheDocument();
    expect(componentBNode).toBeInTheDocument();
  });
});
