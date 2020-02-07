import {
  queryData,
  addData,
  updateData,
  queryOption,

  // eslint-disable-next-line import/extensions
} from '@/services/employee';
// eslint-disable-next-line import/extensions

export default {
  namespace: 'employee',
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
    //   *fetchCategoryOption({ payload }, { call }) {
    //     const response = yield call(queryCategoryOption, payload);
    //     return response;
    //   },
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
    *update({ payload, callback }, { call }) {
      const response = yield call(updateData, payload);
      if (callback) callback(response);
    },

    *reload(action, { put, select }) {
      const pagination = yield select(state => state.employee.pagination);
      yield put({ type: 'fetch', payload: { pagination: pagination.current } });
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
  },
};
