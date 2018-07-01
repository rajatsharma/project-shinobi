import React from "react";
import { hashHistory, Router } from "react-router";
import { Provider } from "react-redux";
import PropTypes from "prop-types";

class App extends React.Component {
  /* eslint-disable */
  static propTypes = {
    store: PropTypes.object.isRequired,
    routes: PropTypes.object.isRequired
  };
  /* eslint-enable */
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <Provider store={this.props.store}>
        <div style={{ height: "100%" }} className="app">
          <Router history={hashHistory}>{this.props.routes}</Router>
        </div>
      </Provider>
    );
  }
}

export default App;
