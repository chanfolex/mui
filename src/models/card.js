import { queryData, addData, updateData, queryOption } from '@/services/card';

export default {
  namespace: 'card',
  state: {
    list: [],
    pagination: {
      total: 0,
      current: 1,
      pageSize: 10,
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const res = yield call(queryData, payload);
      if (res.code === 200) {
        yield put({ type: 'setPaginationCurrent', payload: payload ? payload.pagination : 1 });
        yield put({ type: 'save', payload: res.data });
      }
    },

    *fetchOption({ payload }, { call }) {
      const response = yield call(queryOption, payload);
      return response;
    },

    *add({ payload, callback }, { call, put }) {
      const response = yield call(addData, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },

    *update({ payload }, { call }) {
      const response = yield call(updateData, payload);
      // yield put({
      //   type: 'save',
      //   payload: response,
      // })
      // if(callback) callback();
      return response;
    },
  },
  reducers: {
    save(state, action) {
      const { list, sum } = action.payload;
      const pagination = {
        total: sum,
        current: state.pagination.current,
        pageSize: 10,
      };
      return { ...state, list, pagination };
    },

    setPaginationCurrent(state, action) {
      const { pagination } = state;
      pagination.current = action.payload;
      return { ...state, pagination };
    },

    add(state) {
      return {
        ...state,
      };
    },
  },
};
