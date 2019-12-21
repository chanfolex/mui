import { routerRedux } from 'dva/router';
import { message } from 'antd';
import {
  getPurchaseSN,
  addPurchase,
  queryPurchase,
  updatePurchase,
  queryPurchaseById,
  queryContractBySn,
  addContract,
  queryList,
} from '@/services/purchase';

export default {
  namespace: 'purchase',
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
      const res = yield call(queryPurchase, payload);
      if (res.code === 200) {
        yield put({ type: 'setPaginationCurrent', payload: payload ? payload.pagination : 1 });
        yield put({ type: 'save', payload: res.data });
      }
    },

    *fetchContract({ payload }, { call, put }) {
      const res = yield call(queryList, payload);
      if (res.code === 200) {
        yield put({ type: 'setPaginationCurrent', payload: payload ? payload.pagination : 1 });
        yield put({ type: 'save', payload: res.data });
      }
    },
    *fetchItems({ payload }, { call }) {
      const response = yield call(queryContractBySn, payload);
      return response;
    },
    *create({ payload }, { call, put }) {
      yield call(addPurchase, payload);
      yield put(
        routerRedux.push({
          pathname: '/purchase/list',
        })
      );
      yield put({ type: 'reload' });
      message.success('添加成功');
    },
    *createContract({ payload }, { call, put }) {
      yield call(addContract, payload);
      yield put(
        routerRedux.push({
          pathname: '/purchase/create',
        })
      );
      yield put({ type: 'reload' });
      message.success('添加成功');
    },
    *update({ payload }, { call, put }) {
      yield call(updatePurchase, payload);
      yield put(
        routerRedux.push({
          pathname: '/purchase/list',
        })
      );

      yield put({ type: 'reload' });
      message.success('更新成功');
    },

    // *insertPrepay({ payload }, { call, put }) {
    //   const res = yield call(examine, payload);
    //   if (res.code === 200) {
    //     yield put({ type: 'reload' });
    //     message.success('更新成功');
    //   } else {
    //     message.warning(res.msg);
    //   }
    // },

    *reload(action, { put, select }) {
      const pagination = yield select(state => state.purchase.pagination);
      yield put({ type: 'fetch', payload: { pagination: pagination.page } });
      yield put({ type: 'saveRecord', payload: null });
    },
    *fetchPurchaseById({ payload }, { call, put }) {
      const res = yield call(queryPurchaseById, payload);
      if (res.code === 200) {
        yield put({ type: 'saveRecord', payload: res.data });
        const supporters = res.data.des.filter(el => el.supporter !== null).map(el => el.supporter);
        yield put({ type: 'product/setSupporters', payload: supporters });
      }
    },
    *fetchSn({ payload }, { call, put }) {
      const res = yield call(getPurchaseSN, payload);
      if (res.code === 200) {
        yield put({ type: 'saveSn', payload: res.data });
      }
    },
    *setRecord({ payload }, { put }) {
      yield put({ type: 'saveRecord', payload });
    },
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
