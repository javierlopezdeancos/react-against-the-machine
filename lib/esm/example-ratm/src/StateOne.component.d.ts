/// <reference types="react" />
export interface IStateOneProps {
    onGoToStateTwo: () => void;
    onGoToStateThree: () => void;
}
declare function StateOne(props: IStateOneProps): JSX.Element;
export default StateOne;
