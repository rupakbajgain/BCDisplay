import * as types from './type.jsx';

export const setState = (field, value) => ({
  type: types.SET_STATE,
  payload: {[field]: value}
});

export const setConfig = (value) => ({
  type: types.SET_CONFIG,
  payload: {value}
});

export default {setState, setConfig};