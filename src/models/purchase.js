import { routerRedux } from 'dva/router';
import { message } from 'antd';
import {
  getPurchaseSN,
  addPurchase,
  queryPurchase,
  updatePurchase,
  queryPurchaseById,
  queryContractBySn,
  queryStorageOption,
  examine,
  queryPreItems,
} from '@/services/purchase';

export default {
  namespace: 'prepurchase',
  state: {
    list: [],
    pagination: {
      total: 0,
      current: 1,
      pageSize: 10,
    },
    storages: [],
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

    *fetchItems({ payload }, { call }) {
      const response = yield call(queryContractBySn, payload);
      return response;
    },

    *fetchPreItems({ payload }, { call }) {
      const response = yield call(queryPreItems, payload);
      return response;
    },

    // *fetchStorageOption({ payload }, { call }) {
    //   const response = yield call(queryStorageOption, payload);
    //   return response;
    // },

    *fetchStorageOption({ payload }, { call, put }) {
      const res = yield call(queryStorageOption, payload);
      if (res.code === 200) {
        yield put({ type: 'saveStorage', payload: res.data });
      }
      return res;
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

    *examine({ payload }, { call, put }) {
      const res = yield call(examine, payload);
      if (res.code === 200) {
        yield put({ type: 'reload' });
        message.success('更新成功');
      } else {
        message.warning(res.msg);
      }
    },

    *reload(action, { put, select }) {
      const pagination = yield select(state => state.prepurchase.pagination);
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

    saveStorage(state, action) {
      return { ...state, storages: action.payload };
    },

    saveRecord(state, action) {
      return { ...state, ...{ record: action.payload } };
    },
    saveSn(state, action) {
      return { ...state, sn: action.payload };
    },
  },
};
