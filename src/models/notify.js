import { message } from 'antd';
import { queryList, updateData, queryDataById } from '@/services/notify';

export default {
  namespace: 'notify',
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
      const res = yield call(queryList, payload);
      if (res.code === 200) {
        yield put({ type: 'setPaginationCurrent', payload: payload ? payload.pagination : 1 });
        yield put({ type: 'save', payload: res.data });
      }
    },
    *update({ payload }, { call, put }) {
      yield call(updateData, payload);
      yield put({ type: 'reload' });
      message.success('更新成功');
    },
    *reload(action, { put, select }) {
      const pagination = yield select(state => state.notify.pagination);
      yield put({ type: 'fetch', payload: { pagination: pagination.page } });
    },
    *fetchDataById({ payload }, { call }) {
      const response = yield call(queryDataById, payload);
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
  },
};
