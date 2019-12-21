import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryUsers(params) {
  return request(`/api/user?${stringify(params)}`);
}

export async function queryCurrent() {
  return request('/api/user/getInfo');
}
// 更新个人信息
export async function updateInfo(params) {
  return request('/api/user/updateInfo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  });
}

export async function updatePwd(params) {
  return request('/api/user/updatePassword', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  });
}

export async function doLogin(params) {
  return request('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  });
}

export async function addUser(params) {
  return request('/api/user/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  });
}
export async function updateUser(params) {
  return request('/api/user/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  });
}
