/// <reference types="react" />
export interface IStateOneProps {
    onGoToStateTwo: () => void;
    onGoToStateOne: () => void;
}
declare function StateThree(props: IStateOneProps): JSX.Element;
export default StateThree;
