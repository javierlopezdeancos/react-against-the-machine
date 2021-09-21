import { mechanism, State } from './mechanism';

const transitionMock = {
  id: 'transition-test',
  event: 'transition.event.test',
};

const contentMock = (): JSX.Element => {
  return <></>;
};

const stateMock = {
  id: 'test',
  to: [],
  content: contentMock(),
} as State;

let state: State;

describe('Rage against the machine - mechanism', () => {
  beforeEach(() => {
    mechanism.clear();
    state = { ...stateMock };
  });

  test('should set the id for the current state', () => {
    mechanism.currentId = state.id;

    expect(mechanism.currentId).toBe('test');
  });

  test('should set a state if are not added yet', () => {
    mechanism.setState(state);

    expect(mechanism.states[0]).toBe(state);
  });

  test('should not set a state if are added yet', () => {
    mechanism.setState(state);
    mechanism.setState(state);

    expect(mechanism.states.length).toBe(1);
  });

  test('should remove a state if exist', () => {
    mechanism.setState(state);
    expect(mechanism.states.length).toBe(1);
    mechanism.removeState(stateMock.id);
    expect(mechanism.states.length).toBe(0);
  });

  test("should not remove a state if doesn't exist", () => {
    mechanism.setState(state);
    expect(mechanism.states.length).toBe(1);
    mechanism.removeState('sate-id-not-added');
    expect(mechanism.states.length).toBe(1);
  });

  test('should clear all states and currentId', () => {
    expect(mechanism.states.length).toBe(0);
    expect(mechanism.currentId).toBe(undefined);
  });

  test('should get a state content', () => {
    mechanism.setState(state);
    const content = mechanism.getContent(stateMock.id);

    expect(content).toBe(stateMock.content);
  });

  test('should set a content into state if exist this state', () => {
    mechanism.setState(state);
    mechanism.setContent(state.id, state.content as JSX.Element);
    const content = mechanism.getContent(state.id);

    expect(content).toBe(stateMock.content);
  });

  test('should not set a content in state if not exist this state', () => {
    mechanism.setContent(state.id, state.content as JSX.Element);
    const content = mechanism.getContent(state.id);

    expect(content).toBe(undefined);
  });

  test('should set a transition into state if state exist and have this transition', () => {
    mechanism.setState(state);
    mechanism.setTransition(state.id, transitionMock);
    const transition = mechanism.getTransition(state.id, transitionMock.id);

    expect(transition).toBe(transitionMock);
  });

  test('should not set a transition into state if state not exist', () => {
    mechanism.setState(state);
    mechanism.clear();
    mechanism.setTransition('state-id-test-not-added', transitionMock);
    const transition = mechanism.getTransition(state.id, transitionMock.id);

    expect(transition).toBe(undefined);
  });

  test('should set a transition into state if state exist but not have this transition', () => {
    mechanism.setState(state);
    mechanism.setTransition(state.id, transitionMock);
    const transition = mechanism.getTransition(state.id, transitionMock.id);

    expect(transition).toBe(transitionMock);
  });
});
