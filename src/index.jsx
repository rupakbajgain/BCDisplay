import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import configureStore from "./redux/configureStore.jsx";
import config from './result.json';
import App from "./containers/App.jsx";
import actionCreater from './redux/actionCreators.jsx';

const Root = props => {
  const store = configureStore();
  store.dispatch(actionCreater.setConfig(config));
  return(
    <Provider store={store}>
      <App />
    </Provider>
  );
};

ReactDOM.render(<Root/>, document.getElementById("bcMap"));