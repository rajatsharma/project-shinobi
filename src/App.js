import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

function App({ counter, increment, decrement }) {
  return (
    <>
      <button onClick={increment}>+</button>
      <div>{JSON.stringify(counter)}</div>
      <button onClick={decrement}>-</button>
    </>
  );
}

App.propTypes = {
  counter: PropTypes.number,
  increment: PropTypes.func,
  decrement: PropTypes.func,
};

export default connect(
  state => ({
    counter: state.counter,
  }),
  dispatch => ({
    increment: () => dispatch({ type: 'INCREMENT' }),
    decrement: () => dispatch({ type: 'DECREMENT' }),
  }),
)(App);
