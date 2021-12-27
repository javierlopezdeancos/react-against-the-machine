import * as React from 'react';

interface IComponentsProps {
  id: string;
}

export default function ComponentMock(props: IComponentsProps): JSX.Element {
  return (
    <div data-testid={props?.id}>
      <h1>You are in {props?.id}</h1>
    </div>
  );
}
