import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { stringify } from 'qs';
// import { fakeAccountLogin, getFakeCaptcha } from '@/services/api';
import { doLogin } from '@/services/user';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';
// import { join } from 'path';

export default {
  namespace: 'login',

  state: {
    token: '',
    auth: '',
    nickname: '',
    role: '',
  },

  effects: {
    *login({ payload }, { call, put }) {
      // const response = yield call(fakeAccountLogin, payload);
      const res = yield call(doLogin, payload);

      // Login successfully
      if (res.code === 200) {
        yield put({ type: 'changeLoginStatus', payload: res.data });
        reloadAuthorized();
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.startsWith('/#')) {
              redirect = redirect.substr(2);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        yield put(routerRedux.replace(redirect || '/'));
      } else {
        message.warning(res.msg);
      }
    },

    // *getCaptcha({ payload }, { call }) {
    //   yield call(getFakeCaptcha, payload);
    // },

    *logout(_, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          token: '',
          auth: '',
        },
      });
      reloadAuthorized();
      localStorage.removeItem('token');
      yield put(
        routerRedux.push({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        })
      );
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      const auth = payload.auth.split(',').map(el => Number(el));
      setAuthority(auth);
      localStorage.setItem('token', payload.token);
      return {
        ...state,
        token: payload.token,
        auth: payload.auth,
        nickname: payload.nickname,
        role: payload.role,
      };
    },
  },
};
