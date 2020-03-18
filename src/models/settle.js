import { queryData, addData, updateData, queryDataItems } from '@/services/settle';

export default {
  namespace: 'settle',
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

    *add({ payload, callback }, { call, put }) {
      const response = yield call(addData, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
      return response;
    },

    *fetchItems({ payload }, { call }) {
      const response = yield call(queryDataItems, payload);
      return response;
    },

    *update({ payload, callback }, { call }) {
      const response = yield call(updateData, payload);
      if (callback) callback(response);
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
