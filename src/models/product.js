import {
  queryProduct,
  addProduct,
  updateProduct,
  querySupporterOption,
  queryTypeOption,
  queryGradeOption,
  // eslint-disable-next-line import/extensions
} from '@/services/product';
// eslint-disable-next-line import/extensions
import { queryCategoryOption } from '@/services/category';

export default {
  namespace: 'product',
  state: {
    list: [],
    pagination: {
      total: 0,
      current: 1,
      pageSize: 10,
    },
    supporters: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const res = yield call(queryProduct, payload);
      if (res.code === 200) {
        yield put({ type: 'setPaginationCurrent', payload: payload ? payload.pagination : 1 });
        yield put({ type: 'save', payload: res.data });
      }
    },
    *fetchCategoryOption({ payload }, { call }) {
      const response = yield call(queryCategoryOption, payload);
      return response;
    },

    *fetchProductOption({ payload }, { call }) {
      const response = yield call(queryProduct, payload);
      return response;
    },

    *fetchGradeOption({ payload }, { call }) {
      const response = yield call(queryGradeOption, payload);
      return response;
    },

    *fetchTypeOption({ payload }, { call }) {
      const response = yield call(queryTypeOption, payload);
      return response;
    },
    *fetchSupporterOption({ payload }, { call, put }) {
      const res = yield call(querySupporterOption, payload);
      if (res.code === 200) {
        yield put({ type: 'saveSupporter', payload: res.data });
      }
      return res;
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addProduct, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *update({ payload, callback }, { call }) {
      const response = yield call(updateProduct, payload);
      if (callback) callback(response);
    },
    *setSupporters({ payload }, { put }) {
      yield put({ type: 'saveSupporter', payload });
    },
    *reload(action, { put, select }) {
      const pagination = yield select(state => state.product.pagination);
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
    saveSupporter(state, action) {
      return { ...state, supporters: action.payload };
    },
    setPaginationCurrent(state, action) {
      const { pagination } = state;
      pagination.current = action.payload;
      return { ...state, pagination };
    },
  },
};
