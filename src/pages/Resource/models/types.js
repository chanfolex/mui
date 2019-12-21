import { queryTypes, addTypes, updateTypes, removeTypes } from '@/services/types';

export default {
  namespace: 'types',
  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryTypes, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *add({ payload }, { call }) {
      const response = yield call(addTypes, payload);
      // yield put({
      //   type: 'add',
      //   payload,
      // });
      return response;
    },
    *update({ payload }, { call }) {
      const response = yield call(updateTypes, payload);
      // yield put({
      //   type: 'save',
      //   payload: response,
      // })
      // if(callback) callback();
      return response;
    },
    *delete({ payload }, { call }) {
      const response = yield call(removeTypes, payload);
      // yield put({
      //   type: 'save',
      //   payload: response,
      // })
      // if (callback) callback();
      return response;
    }
  },
  reducers: {
    save(state, action) {
      if (action.payload.code === 200) {
        const data = {
          list: action.payload.data.list,
          pagination: {
            total: action.payload.data.sum,
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
    add(state) {
      return {
        ...state
      }
    }
  },
};
