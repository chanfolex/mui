import { message } from 'antd';
import {
  queryCustomerType,
  addCustomer,
  updateCustomer,
  queryInquirySN,
  addInquiry,
  queryInquiry,
  queryPrivateList,
  queryAllClient,
  // updateInquiry,
} from '@/services/mycustomer';
import { queryGrade } from '@/services/grade';
// import { queryProduct } from '@/services/product';

export default {
  namespace: 'customer1',
  state: {
    list: [],
    pagination: {
      total: 0,
      current: 1,
      pageSize: 10,
    },
    territorys: [],
    grades: [],
    inquirySn: '',
  },

  effects: {
    /**
     * 查询客户列表
     */
    *fetch({ payload }, { all, call, put }) {
      if (JSON.stringify(payload) !== '{}') {
        yield put({ type: 'fetchList', payload: { ...payload } });
      } else {
        const [res1, res2, res3] = yield all([
          call(queryAllClient, payload),
          call(queryCustomerType),
          call(queryGrade),
        ]);
        // const res = yield call(queryClient, payload);
        let { data1, data2, data3 } = [null, [], []];
        if (res1.code === 200) {
          data1 = res1.data;
        }
        if (res2.code === 200) {
          data2 = res2.data.list;
        }
        if (res3.code === 200) {
          data3 = res3.data.list;
        }
        yield put({ type: 'save', payload: { ...data1, territorys: data2, grades: data3 } });
      }
    },
    *fetchList({ payload }, { call, put }) {
      const res = yield call(queryAllClient, payload);
      if (res.code === 200) {
        yield put({ type: 'setPaginationCurrent', payload: payload ? payload.pagination : 1 });
        yield put({ type: 'saveList', payload: res.data });
      }
    },
    *fetchPrivateList({ payload }, { call, put }) {
      const res = yield call(queryPrivateList, payload);
      if (res.code === 200) {
        yield put({ type: 'setPaginationCurrent', payload: payload ? payload.pagination : 1 });
        yield put({ type: 'saveList', payload: res.data });
      }
    },

    *create({ payload }, { call, put }) {
      yield call(addCustomer, payload);
      yield put({ type: 'reload' });
      message.success('添加成功');
    },
    *update({ payload }, { call, put }) {
      yield call(updateCustomer, payload);
      yield put({ type: 'reload' });
      message.success('更新成功');
    },

    *updatePrivate({ payload }, { call, put }) {
      yield call(updateCustomer, payload);
      yield put({ type: 'reloadPrivate' });
      message.success('更新成功');
    },

    *reload(action, { put, select }) {
      const pagination = yield select(state => state.customer.pagination);
      yield put({ type: 'fetch', payload: { pagination: pagination.current } });
    },

    *reloadPrivate(action, { put, select }) {
      const pagination = yield select(state => state.customer.pagination);
      yield put({ type: 'fetchPrivateList', payload: { pagination: pagination.page } });
    },

    // *updateInquiry({ payload, callback }, { call }) {
    //   const response = yield call(updateInquiry, payload);
    //   if (callback) callback(response);
    // },
    /**
     * 查询客户分类
     */
    *fetchCustomerType({ payload }, { call, put }) {
      const res = yield call(queryCustomerType, payload);
      if (res.code === 200) {
        yield put({ type: 'saveTerritorys', payload: res.data });
      }
    },
    /**
     * 查询客户等级
     */
    *fetchGrade({ payload }, { call, put }) {
      const res = yield call(queryGrade, payload);
      if (res.code === 200) {
        yield put({ type: 'saveGrades', payload: res.data });
      }
    },
    /**
     * 获取询盘序号
     */
    *fetchInquirySn({ payload }, { call, put }) {
      const res = yield call(queryInquirySN, payload);
      if (res.code === 200) {
        yield put({ type: 'saveInquirySn', payload: res.data });
      }
    },
    *addInquiry({ payload, callback }, { call }) {
      const response = yield call(addInquiry, payload);
      if (callback) callback(response);
      message.success('添加成功');
    },
    *fetchInquiry({ payload }, { call }) {
      const response = yield call(queryInquiry, payload);
      return response;
    },
    // *fetchProduct({ payload }, { call }) {
    //   const response = yield call(queryProduct, payload);
    //   return response;
    // },
  },
  reducers: {
    saveList(state, action) {
      const { list, sum } = action.payload;
      const pagination = {
        total: sum,
        current: state.pagination.current,
        pageSize: 10,
      };
      return { ...state, list, pagination };
    },
    save(state, action) {
      const { list, sum, territorys, grades } = action.payload;
      const pagination = {
        total: sum,
        current: state.pagination.current,
        pageSize: 10,
      };
      return { ...state, list, pagination, territorys, grades };
    },
    setPaginationCurrent(state, action) {
      const { pagination } = state;
      pagination.current = action.payload;
      return { ...state, pagination };
    },
    saveGrades(state, action) {
      const { list } = action.payload;
      return { ...state, grades: list };
    },
    saveTerritorys(state, action) {
      const { list } = action.payload;
      return { ...state, territorys: list };
    },
    saveInquirySn(state, action) {
      return { ...state, inquirySn: action.payload };
    },
  },
};
