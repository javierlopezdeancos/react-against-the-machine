import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { render, RenderResult } from '@testing-library/react';
import { busMock } from './bus.mock';

import Machine, { State, Transition, Content } from './';
import { ComponentA, ComponentB } from './components.mock';

let documentBody: RenderResult;

const componentAId = 'componentA';
const componentBId = 'componentB';

const onTransitionToComponentBMock = jest.fn((): boolean => true);

describe('Given a State <Machine/>', () => {
  beforeEach(() => {
    documentBody = render(
      <div data-testid="app">
        <Machine initial={componentAId} bus={busMock} logged={true}>
          <State id={componentAId} private={false}>
            <Content>
              <ComponentA id={componentAId} />
            </Content>
            <Transition event={`go:to:${componentBId}`} state={componentBId} onEnter={onTransitionToComponentBMock} />
          </State>

          <State id={componentBId} private={false}>
            <Content>
              <ComponentB id={componentBId} />
            </Content>
            <Transition event={`go:to:${componentAId}`} state={componentAId} />
          </State>
        </Machine>
      </div>
    );

    onTransitionToComponentBMock.mockClear();
  });

  it('When run to the first time then should be render only the initial state if is not private', () => {
    const componentANode = documentBody.queryByTestId(componentAId);
    const componentBNode = documentBody.queryByTestId(componentBId);

    expect(componentANode).toBeInTheDocument();
    expect(componentBNode).not.toBeInTheDocument();
  });

  it('When a transition event is trigger then should be render only the final target state to this transition', () => {
    act(() => {
      busMock.publish(`go:to:${componentBId}`);
    });

    const componentANode = documentBody.queryByTestId(componentAId);
    const componentBNode = documentBody.queryByTestId(componentBId);

    expect(componentANode).not.toBeInTheDocument();
    expect(componentBNode).toBeInTheDocument();
  });

  it('When a transition event is trigger and transition has a handler to be executed on enter then should be executed', () => {
    act(() => {
      busMock.publish(`go:to:${componentBId}`);
    });

    expect(onTransitionToComponentBMock.mock.calls.length).toBe(1);
  });
});
