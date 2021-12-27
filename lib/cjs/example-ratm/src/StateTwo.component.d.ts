/// <reference types="react" />
export interface IStateOneProps {
    onGoToStateOne: () => void;
    onGoToStateThree: () => void;
}
declare function StateTwo(props: IStateOneProps): JSX.Element;
export default StateTwo;
