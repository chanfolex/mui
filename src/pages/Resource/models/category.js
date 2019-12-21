import { queryCategory, addCategory, updateCategory, removeCategory } from '@/services/category';

export default {
  namespace: 'category',
  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryCategory, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addCategory, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateCategory, payload);
      yield put({
        type: 'save',
        payload: response,
      })
      if(callback) callback();
    },
    *delete({ payload, callback }, { call, put }) {
      const response = yield call(removeCategory, payload);
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
