import { notification } from 'antd';
import {
  queryNoticesUnRead,
  queryNoticePush,
  queryMenuNotice,
  queryNoticesUnReadCount,
} from '@/services/api';

export default {
  namespace: 'global',

  state: {
    collapsed: false,
    notices: [],
    menusTips: null,
  },

  effects: {
    *fetchNotices(_, { call, put }) {
      const res = yield call(queryNoticesUnRead);
      yield put({
        type: 'saveNotices',
        payload: res.data,
      });
      yield put({
        type: 'user/changeNotifyCount',
        payload: res.data.length,
      });
    },
    *fetchNoticesCount(_, { call, put }) {
      const res = yield call(queryNoticesUnReadCount);
      yield put({
        type: 'user/changeNotifyCount',
        payload: res.data,
      });
    },
    *clearNotices({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count = yield select(state => state.global.notices.length);
      yield put({
        type: 'user/changeNotifyCount',
        payload: count,
      });
    },
    *fetchNoticesPush(_, { call }) {
      const res = yield call(queryNoticePush);
      if (res.code === 200) {
        const openNotification = item => {
          const key = item.id;
          // eslint-disable-next-line react/react-in-jsx-scope
          // const btn = (<Button type="primary" size="small" onClick={() => notification.close(key)}>Confirm</Button>);
          notification[item.type]({
            message: item.title,
            description: item.content,
            // btn,
            key,
          });
        };
        res.data.forEach(el => {
          openNotification(el);
        });
      }
      return res;
    },
    *fetchMenuNotices({ payload }, { call, put }) {
      const res = yield call(queryMenuNotice, payload);
      yield put({
        type: 'saveMenuNotices',
        payload: res.data,
      });
    },
  },

  reducers: {
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveNotices(state, { payload }) {
      return {
        ...state,
        notices: payload,
      };
    },
    saveMenuNotices(state, { payload }) {
      return {
        ...state,
        menusTips: payload,
      };
    },
    saveClearedNotices(state, { payload }) {
      return {
        ...state,
        notices: state.notices.filter(item => item.type !== payload),
      };
    },
  },

  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
