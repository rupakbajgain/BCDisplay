import { createStore, applyMiddleware } from "redux";
import { rootReducer, initialState } from "./reducers.jsx";
import loggingMiddleware from "./loggingMiddleware.jsx";

export const configureStore = () => {
  const store = createStore(
    rootReducer,
    initialState/*,
    applyMiddleware(
      loggingMiddleware,
    )*/
  );
  return store;
};
export default configureStore;