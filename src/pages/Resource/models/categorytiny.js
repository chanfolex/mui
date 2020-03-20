import {  queryOption } from '@/services/categorytiny';

export default {
  namespace: 'categorytiny',
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

    *fetchOption({ payload }, { call, put }) {
        const response = yield call(queryOption, payload);
        yield put({
          type: 'save',
          payload: response,
        });
      },


    *add({ payload }, { call }) {
      const response = yield call(addCategory, payload);
      return response;
    },

    
    *update({ payload }, { call }) {
      const response = yield call(updateCategory, payload);
      return response;
    },
    *delete({ payload }, { call }) {
      const response = yield call(removeCategory, payload);
      // yield put({
      //   type: 'save',
      //   payload: response,
      // })
      // if (callback) callback();
      return response;
    },
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
          },
        };
        return {
          ...state,
          data,
        };
      }
      return state;
    },
    add(state) {
      return {
        ...state,
      };
    },
  },
};
