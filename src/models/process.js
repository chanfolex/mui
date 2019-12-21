import { message } from 'antd';
import {
  queryItemsBySn,
  queryInsertList,
  queryExportList,
  updateData,
  deleteInsert,
  deleteExport,
} from '@/services/process';

export default {
  namespace: 'process',
  state: {
    list: [],
    pagination: {
      total: 0,
      current: 1,
      pageSize: 10,
    },
    record: null,
    sn: '',
  },

  effects: {
    *fetchInsert({ payload }, { call, put }) {
      const res = yield call(queryInsertList, payload);
      if (res.code === 200) {
        yield put({ type: 'setPaginationCurrent', payload: payload ? payload.pagination : 1 });
        yield put({ type: 'save', payload: res.data });
      }
    },

    *fetchExport({ payload }, { call, put }) {
      const res = yield call(queryExportList, payload);
      if (res.code === 200) {
        yield put({ type: 'setPaginationCurrent', payload: payload ? payload.pagination : 1 });
        yield put({ type: 'save', payload: res.data });
      }
    },

    *fetchItems({ payload }, { call }) {
      const response = yield call(queryItemsBySn, payload);
      return response;
    },

    *update({ payload }, { call, put }) {
      yield call(updateData, payload);
      yield put({ type: 'reload' });
      message.success('更新成功');
    },

    *deleteInsert({ payload }, { call, put }) {
      yield call(deleteInsert, payload);
      yield put({ type: 'reload' });
      message.success('更新成功');
    },

    *deleteExport({ payload }, { call, put }) {
      yield call(deleteExport, payload);
      yield put({ type: 'reload' });
      message.success('更新成功');
    },

    *reload(action, { put, select }) {
      const pagination = yield select(state => state.process.pagination);
      yield put({ type: 'fetch', payload: { pagination: pagination.page } });
      yield put({ type: 'saveRecord', payload: null });
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
    saveRecord(state, action) {
      return { ...state, ...{ record: action.payload } };
    },
    saveSn(state, action) {
      return { ...state, sn: action.payload };
    },
  },
};
