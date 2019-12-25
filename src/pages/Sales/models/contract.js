import { message } from 'antd';
import {
  getSalesContractSN,
  getPurchaseContractSN,
  addSalesContract,
  querySalesContract,
  updateSalesContract,
  queryContractBySn,
  queryStorageOption,
  addCraft,
  querySalesContractPrivate,
  queryClientOptionPrivate,
  queryCategoryOption,
  queryUserOption,
  // eslint-disable-next-line import/extensions
} from '@/services/sales-contract';

export default {
  namespace: 'salesContract',
  state: {
    list: [],
    pagination: {
      total: 0,
      current: 1,
      pageSize: 10,
    },
    clients: [],
    contractSn: '',
    SaleSn: '',
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const res = yield call(querySalesContract, payload);
      if (res.code === 200) {
        yield put({ type: 'setPaginationCurrent', payload: payload ? payload.pagination : 1 });
        yield put({ type: 'save', payload: res.data });
      }
    },
    *fetchPrivate({ payload }, { call, put }) {
      const res = yield call(querySalesContractPrivate, payload);
      if (res.code === 200) {
        yield put({ type: 'setPaginationCurrent', payload: payload ? payload.pagination : 1 });
        yield put({ type: 'save', payload: res.data });
      }
    },
    *create({ payload }, { call, put }) {
      const res = yield call(addSalesContract, payload);
      if (res.code === 200) {
        yield put({ type: 'reload' });
        message.success('添加成功');
      } else {
        message.warning(res.msg);
      }
    },

    *createCraft({ payload }, { call }) {
      yield call(addCraft, payload);
      message.success('添加成功');
    },
    *update({ payload }, { call, put }) {
      yield call(updateSalesContract, payload);
      yield put({ type: 'reloadPrivate' });
      message.success('更新成功');
    },
    *reload(action, { put, select }) {
      const pagination = yield select(state => state.customer.pagination);
      yield put({ type: 'fetch', payload: { pagination: pagination.page } });
    },
    *reloadPrivate(action, { put, select }) {
      const pagination = yield select(state => state.customer.pagination);
      yield put({ type: 'fetchPrivate', payload: { pagination: pagination.page } });
    },
    *fetchItems({ payload }, { call }) {
      const response = yield call(queryContractBySn, payload);
      return response;
    },

    *fetchClientOption({ payload }, { call, put }) {
      const res = yield call(queryClientOptionPrivate, payload);
      if (res.code === 200) {
        yield put({ type: 'saveClient', payload: res.data });
      }
      return res;
    },

    *fetchStorageOption({ payload }, { call }) {
      const response = yield call(queryStorageOption, payload);
      return response;
    },

    *fetchUserOption({ payload }, { call }) {
      const response = yield call(queryUserOption, payload);
      return response;
    },

    *fetchCategoryOption({ payload }, { call }) {
      const response = yield call(queryCategoryOption, payload);
      return response;
    },

    *fetchPurchaseSn({ payload }, { call, put }) {
      const res = yield call(getPurchaseContractSN, payload);
      if (res.code === 200) {
        yield put({ type: 'saveSn', payload: res.data });
      }
    },

    *fetchSaleContractSn({ payload }, { call, put }) {
      const res = yield call(getSalesContractSN, payload);
      if (res.code === 200) {
        yield put({ type: 'saveSaleSn', payload: res.data });
      }
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
    saveClient(state, action) {
      return { ...state, clients: action.payload };
    },
    setPaginationCurrent(state, action) {
      const { pagination } = state;
      pagination.current = action.payload;
      return { ...state, pagination };
    },
    saveSn(state, action) {
      return { ...state, contractSn: action.payload };
    },

    saveSaleSn(state, action) {
      return { ...state, SaleSn: action.payload };
    },
  },
};
