import { message } from 'antd';
import {
  queryList,
  updateData,
  queryPcontract,
  queryListPre,
  addPayData,
  addData,
  queryDataById,
} from '@/services/payment';

export default {
  namespace: 'payment',
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
      const res = yield call(queryList, payload);
      if (res.code === 200) {
        yield put({ type: 'setPaginationCurrent', payload: payload ? payload.pagination : 1 });
        yield put({ type: 'save', payload: res.data });
      }
    },

    *fetchPcontract({ payload }, { call, put }) {
      const res = yield call(queryPcontract, payload);
      if (res.code === 200) {
        yield put({ type: 'setPaginationCurrent', payload: payload ? payload.pagination : 1 });
        yield put({ type: 'save', payload: res.data });
      }
    },

    *fetchPcontractPre({ payload }, { call, put }) {
      const res = yield call(queryListPre, payload);
      if (res.code === 200) {
        yield put({ type: 'setPaginationCurrent', payload: payload ? payload.pagination : 1 });
        yield put({ type: 'save', payload: res.data });
      }
    },

    *create({ payload }, { call, put }) {
      yield call(addData, payload);
      yield put({ type: 'reload' });
      message.success('添加成功');
    },
    *pay({ payload }, { call, put }) {
      yield call(addPayData, payload);
      yield put({ type: 'reload' });
      message.success('添加成功');
    },
    *update({ payload }, { call, put }) {
      yield call(updateData, payload);
      yield put({ type: 'reload' });
      message.success('更新成功');
    },
    *reload(action, { put, select }) {
      const pagination = yield select(state => state.payment.pagination);
      yield put({ type: 'fetch', payload: { pagination: pagination.page } });
    },
    *fetchDataById({ payload }, { call }) {
      const response = yield call(queryDataById, payload);
      return response;
    },
    *fetchSn({ payload }, { call, put }) {
      const res = yield call(queryList, payload);
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
