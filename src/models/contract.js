import { message } from 'antd';
import {
  getSalesContractSN,
  addSalesContract,
  querySalesContract,
  updateSalesContract,
  deleteSalesContract,
  queryInsertBySn,
  queryExportBySn,
  addCraft,
} from '@/services/sales-contract';

export default {
  namespace: 'contract',
  state: {
    list: [],
    pagination: {
      total: 0,
      current: 1,
      pageSize: 10,
    },
    contractSn: '',
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const res = yield call(querySalesContract, payload);
      if (res.code === 200) {
        yield put({ type: 'setPaginationCurrent', payload: payload ? payload.pagination : 1 });
        yield put({ type: 'save', payload: res.data });
      }
    },
    *create({ payload }, { call, put }) {
      yield call(addSalesContract, payload);
      yield put({ type: 'reload' });
      message.success('添加成功');
    },
    *createCraft({ payload }, { call }) {
      yield call(addCraft, payload);
      message.success('添加成功');
    },
    *update({ payload }, { call, put }) {
      yield call(updateSalesContract, payload);
      yield put({ type: 'reload' });
      message.success('更新成功');
    },

    *delete({ payload }, { call, put }) {
      yield call(deleteSalesContract, payload);
      yield put({ type: 'reload' });
      message.success('删除成功');
    },

    *reload(action, { put, select }) {
      const pagination = yield select(state => state.contract.pagination);
      yield put({ type: 'fetch', payload: { pagination: pagination.page } });
    },
    *fetchInsertItems({ payload }, { call }) {
      const response = yield call(queryInsertBySn, payload);
      return response;
    },
    *fetchExportItems({ payload }, { call }) {
      const response = yield call(queryExportBySn, payload);
      return response;
    },

    *fetchSn({ payload }, { call, put }) {
      const res = yield call(getSalesContractSN, payload);
      if (res.code === 200) {
        yield put({ type: 'saveSn', payload: res.data });
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
    setPaginationCurrent(state, action) {
      const { pagination } = state;
      pagination.current = action.payload;
      return { ...state, pagination };
    },
    saveSn(state, action) {
      return { ...state, contractSn: action.payload };
    },
  },
};
