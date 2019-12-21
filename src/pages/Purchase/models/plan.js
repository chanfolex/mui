import { queryPlan, addPlan, updatePlan, removePlan } from '@/services/plan';

export default {
  namespace: 'purchasePlan',
  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryPlan, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addPlan, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updatePlan, payload);
      yield put({
        type: 'save',
        payload: response,
      })
      if(callback) callback();
    },
    *delete({ payload, callback }, { call, put }) {
      const response = yield call(removePlan, payload);
      yield put({
        type: 'save',
        payload: response,
      })
      if (callback) callback();
    }
  },
  reducers: {
    save(state, action) {
      if (action.payload.code === 200) {
        const data = {
          list: action.payload.data.list,
          pagination: {
            total: action.payload.data.list.length,
            pageSize: 10,
            current: 1,
          }
        }
        return {
          ...state,
          data,
        };
      }
      return state;
    },
  },
};
