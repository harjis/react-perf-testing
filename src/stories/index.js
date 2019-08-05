import React from "react";
import { storiesOf } from "@storybook/react";
import whyDidYouRender from "@welldone-software/why-did-you-render";

whyDidYouRender(React);

// This storys purpose is to show how event handlers can be perf-optimised

const styles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid',
  margin: '2px'
};
const values = [
  { value: 0 },
  { value: 1 },
  { value: 2 },
  { value: 3 },
  { value: 4 },
  { value: 5 }
];

// UNOPTIMISED
const FunctionalButton = props => {
  console.log("rendered");
  return (
    <div style={styles} onClick={props.onClick}>
      {props.value}
    </div>
  );
};
FunctionalButton.whyDidYouRender = true;

const App = props => {
  const [state, setState] = React.useState(0);
  return (
    <div>
      <div>{state}</div>
      {props.values.map((value, index) => (
        <FunctionalButton
          key={index}
          onClick={() => setState(value.value)}
          value={value.value}
        />
      ))}
    </div>
  );
};

// OPTIMISED
const FunctionalButtonOptimised = props => {
  console.log("rendered");
  const { onClick, value } = props;
  const onClickM = React.useCallback(() => {
    onClick(value);
  }, [onClick, value]);
  return (
    <div style={styles} onClick={onClickM}>
      {props.value}
    </div>
  );
};


const FunctionalButtonOptimisedMemo = React.memo(FunctionalButtonOptimised);
FunctionalButtonOptimisedMemo.whyDidYouRender = true;

const AppOptimised = props => {
  const [state, setState] = React.useState(0);
  const setStateMemo = React.useCallback(
    value => {
      setState(value);
    },
    [setState]
  );
  return (
    <div>
      <div>{state}</div>
      {props.values.map((value, index) => (
        <FunctionalButtonOptimisedMemo
          key={index}
          onClick={setStateMemo}
          value={value.value}
        />
      ))}
    </div>
  );
};

storiesOf("Performance testing/FunctionalButton", module)
  .add("Un-optimised", () => <App values={values} />)
  .add("Optimised", () => <AppOptimised values={values} />);
