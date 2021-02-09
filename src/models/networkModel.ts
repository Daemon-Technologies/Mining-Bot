import { Effect, ImmerReducer, Reducer, Subscription } from 'umi';
export interface networkState {
  network: string;
  lastUse: string;
}
export interface networkType {
  namespace: "network";
  state: networkState;
  effects: {
    query: Effect;
  };
  reducers: {
    save: Reducer<networkState>;
  };
}
const IndexModel: networkType = {
  namespace: 'network',
  state: {
    network: 'Xenon'
  },
  effects: {
    *query({ payload }, { call, put }) {
    },
  },
  reducers: {
    save(state, {payload}) {
      return {
        ...state,
        network: payload
      };
    }
    
  }
};
export default IndexModel;