import { message } from 'antd';
import {
  queryUsers,
  queryCurrent,
  addUser,
  updateUser,
  updateInfo,
  updatePwd,
} from '@/services/user';

export default {
  namespace: 'user',

  state: {
    list: [],
    pagination: {
      total: 0,
      current: 1,
      pageSize: 10,
    },
    currentUser: {},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const res = yield call(queryUsers, payload);
      if (res.code === 200) {
        yield put({ type: 'save', payload: res.data });
      }
    },
    *fetchCurrent(_, { call, put }) {
      const res = yield call(queryCurrent);
      if (res && res.code === 200) {
        yield put({
          type: 'saveCurrentUser',
          payload: res.data,
        });
      }
    },
    *create({ payload }, { call, put }) {
      const res = yield call(addUser, payload);
      if (res.code === 200) {
        yield put({ type: 'reload' });
        message.success('添加成功');
      } else {
        message.warning(res.msg);
      }
    },
    *update({ payload }, { call, put }) {
      const res = yield call(updateUser, payload);
      if (res.code === 200) {
        yield put({ type: 'reload' });
        message.success('更新成功');
      } else {
        message.warning(res.msg);
      }
    },
    *updateInfo({ payload }, { call, put }) {
      const user = {
        avatar: payload.avatar,
        mail: payload.mail,
        phone: payload.phone,
        nickname: payload.nickname,
      };
      const res = yield call(updateInfo, user);
      if (res.code === 200) {
        yield put({ type: 'setCurrentUser', payload });
        message.success('更新成功');
      } else {
        message.warning(res.msg);
      }
    },
    *updateMailInfo({ payload }, { call, put }) {
      const user = {
        mail_server: payload.mail_server,
        mail_pwd: payload.mail_pwd,
        mail_account: payload.mail_account,
      };
      const res = yield call(updateInfo, user);
      if (res.code === 200) {
        yield put({ type: 'setCurrentUser', payload });
        message.success('更新成功');
      } else {
        message.warning(res.msg);
      }
    },
    *updatePwd({ payload }, { call, put }) {
      const res = yield call(updatePwd, payload);
      if (res.code === 200) {
        message.success('更新成功');
        yield put({ type: 'login/logout' });
      } else {
        message.warning(res.msg);
      }
    },

    *reload(_, { put, select }) {
      const pagination = yield select(state => state.customer.pagination);
      yield put({ type: 'fetch', payload: { pagination: pagination.page } });
    },
    *setCurrentUser({ payload }, { put }) {
      yield put({
        type: 'saveCurrentUser',
        payload,
      });
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
      return {
        ...state,
        list,
        pagination,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
  },
};
