import { message } from 'antd';
import { add, queryList, update, queryGrade } from '@/services/supporter';

export default {
  namespace: 'supporter',
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
    *fetch({ payload }, { call, put }) {
      const res = yield call(queryList, payload);
      if (res.code === 200) {
        yield put({ type: 'setPaginationCurrent', payload: payload ? payload.pagination : 1 });
        yield put({ type: 'save', payload: res.data });
      }
    },
    *fetchGradeOption({ payload }, { call }) {
      const response = yield call(queryGrade, payload);
      return response;
    },

    *create({ payload, callback }, { call, put }) {
      const res = yield call(add, payload);
      if (res.code === 200) {
        yield put({ type: 'reload' });
        message.success('添加成功');
        if (callback) callback();
      } else {
        message.success(res.msg);
      }
    },

    *update({ payload, callback }, { call, put }) {
      const res = yield call(update, payload);
      if (res.code === 200) {
        yield put({ type: 'reload' });
        message.success('更新成功');
        if (callback) callback();
      } else {
        message.success(res.msg);
      }
    },

    *reload(action, { put, select }) {
      const pagination = yield select(state => state.supporter.pagination);
      yield put({ type: 'fetch', payload: { pagination: pagination.page } });
      yield put({ type: 'saveRecord', payload: null });
    },
    // *fetchPurchaseById({ payload }, { call, put }) {
    //   const res = yield call(queryPurchaseById, payload);
    //   if (res.code === 200) {
    //     yield put({ type: 'saveRecord', payload: res.data });
    //     const supporters = res.data.des.filter(el => el.supporter !== null).map(el => el.supporter);
    //     yield put({ type: 'product/setSupporters', payload: supporters });
    //   }
    // },

    // *createContractorders({ payload }, { call, put }) {
    //   yield call(addContractorders, payload);
    //   yield put({ type: 'reload' });
    //   message.success('添加成功');
    // },
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
