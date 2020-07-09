import { combineReducers } from "redux";
import * as currentState from "./currentState.jsx";
import * as currentConfig from "./currentConfig.jsx";

export const rootReducer = combineReducers({
  state: currentState.reducer,
  config: currentConfig.reducer,
});

export const initialState = {
  state: currentState.initialState,
  config: currentState.initialState,
};

export default rootReducer