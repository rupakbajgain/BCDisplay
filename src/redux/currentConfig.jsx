import * as types from './type.jsx'

export const initialState = {}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
  case types.SET_CONFIG:
    return action.payload.value;
  default:
    return state;
  }
}