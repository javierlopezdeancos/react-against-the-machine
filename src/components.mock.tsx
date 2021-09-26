interface IComponentsProps {
  id: string;
}

export function ComponentA(props: IComponentsProps): JSX.Element {
  return (
    <div data-testid={props?.id}>
      <h1>You are in component A</h1>
    </div>
  );
}

export function ComponentB(props: IComponentsProps): JSX.Element {
  return (
    <div data-testid={props?.id}>
      <h1>You are in component B</h1>
    </div>
  );
}
