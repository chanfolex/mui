import { queryData, addData, updateData, queryOption,getSN,queryDataItems,deleteData } from '@/services/report_settle';

export default {
  namespace: 'report_settle',
  state: {
    list: [],
    pagination: {
      total: 0,
      current: 1,
      pageSize: 10,
    },
    contractSn:'',
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
    *fetchSn({ payload }, { call, put }) {
      const res = yield call(getSN, payload);
      if (res.code === 200) {
        yield put({ type: 'saveSn', payload: res.data });
      }
    },

    *fetchItems({ payload }, { call }) {
      const response = yield call(queryDataItems, payload);
      return response;
    },
    *update({ payload, callback }, { call }) {
      const response = yield call(updateData, payload);
      if (callback) callback(response);
    },
    *delete({ payload, callback }, { call }) {
      const response = yield call(deleteData, payload);
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

    saveSn(state, action) {
      return { ...state, contractSn: action.payload };
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
