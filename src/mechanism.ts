export type OnEnterDataResponse<D = unknown> = (data?: D) => void;

export type ToState<E = unknown> = {
  id: string;
  event: string;
  onEnter?: OnEnterDataResponse<E>;
};

export type State<E = unknown> = {
  id: string;
  isPrivate?: boolean;
  params?: string[];
  to: ToState<E>[];
  content?: JSX.Element;
  onEnter?: (params?: Map<string, string>) => void;
};

export type Location = {
  origin: string;
  path: string;
};

export interface IMechanism {
  clear: () => void;
  currentId: string | undefined;
  getContent: (sid: string) => JSX.Element | undefined;
  getState: (sid: string) => State | undefined;
  getStateByEvent: (te: string) => State | undefined;
  getTransition: (sid: string, tid: string) => ToState | undefined;
  getTransitionByEvent: (te: string) => ToState | undefined;
  isPrivate: (s: State) => boolean;
  removeState: (sid: string) => void;
  setContent: (sid: string, c: JSX.Element) => void;
  setState: (s: State) => void;
  setTransition: (sid: string, t: ToState) => void;
  states: State[];
}

class Mechanism implements IMechanism {
  private _states: State[];

  private _currentId: undefined | string;

  constructor(initial?: string) {
    this._currentId = initial;
    this._states = [];
  }

  public get currentId(): string | undefined {
    return this._currentId;
  }

  public set currentId(cid: string | undefined) {
    this._currentId = cid;
  }

  public get states(): State[] {
    return this._states;
  }

  public set states(ss: State[]) {
    this._states = ss;
  }

  public setState(s: State): void {
    const state = this.getState(s.id);

    if (state) {
      return;
    }

    this._states?.push(s);
  }

  public removeState(sid: string): void {
    const statesFiltered = this._states?.filter((s) => s.id !== sid);
    this._states = statesFiltered;
  }

  public getState(sid: string): State | undefined {
    return this._states?.find((s) => s.id === sid);
  }

  public setTransition(sid: string, t: ToState): void {
    const statesWithTransition = this._states?.map(
      (s): State => {
        if (s.id === sid) {
          s?.to?.push(t);
        }

        return s;
      }
    );

    this._states = statesWithTransition;
  }

  public getTransition(sid: string, tid: string): ToState | undefined {
    const state = this.getState(sid);

    if (state && state?.to && state?.to?.length > 0) {
      return state.to.find((t: ToState) => t.id === tid);
    }

    return;
  }

  public setContent(sid: string, c: JSX.Element) {
    const statesWithContent = this._states?.map(
      (s): State => {
        if (s.id === sid && c) {
          s.content = c;
        }

        return s;
      }
    );

    this._states = statesWithContent;
  }

  public getContent(sid: string): JSX.Element | undefined {
    const state = this.getState(sid);

    if (state && state?.content) {
      return state.content;
    }

    return;
  }

  public getStateByEvent(te: string): State | undefined {
    let state;

    if (this?._states && this._states?.length > 0) {
      this?.states.forEach((s: State): void => {
        if (s?.to && s?.to?.length > 0) {
          s.to.forEach((t: ToState): void => {
            if (t?.event === te) {
              if (t?.id) {
                state = this.getState(t.id);
              }
            }
          });
        }
      });
    }

    return state;
  }

  public getTransitionByEvent(te: string): ToState | undefined {
    let transition;

    if (this?._states && this._states?.length > 0) {
      this?.states.forEach((s: State): void => {
        if (s?.to && s?.to?.length > 0) {
          s.to.forEach((t: ToState): void => {
            if (t?.event === te) {
              transition = { ...t };
            }
          });
        }
      });
    }

    return transition;
  }

  public isPrivate(s: State): boolean {
    return s?.isPrivate || false;
  }

  public clear(): void {
    this._states = [];
    this._currentId = undefined;
  }
}

export default Mechanism;

export const mechanism = new Mechanism();
