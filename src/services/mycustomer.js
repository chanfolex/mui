import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryCustomerType() {
  return request('/api/territory');
}

// 查询客户列表
export async function queryClient(params) {
  return request(`/api/client?${stringify(params)}`);
}

// 查询客户列表
export async function queryAllClient(params) {
  return request(`/api/client/allList?${stringify(params)}`);
}

// 查询客户列表
export async function queryPrivateList(params) {
  return request(`/api/client/privateList?${stringify(params)}`);
}
export async function addCustomer(params) {
  return request('/api/client/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: {
      ...params,
    },
  });
}

export async function updateCustomer(params) {
  return request('/api/client/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: {
      ...params,
    },
  });
}
export async function addInquiry(params) {
  return request('/api/inquiry/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: {
      ...params,
    },
  });
}
// 查询询盘编码
export async function queryInquirySN() {
  return request('/api/inquiry/getsn');
}
// 查询询盘记录
export async function queryInquiry(params) {
  return request(`/api/inquiry?${stringify(params)}`);
}
// 询盘记录更新
export async function updateInquiry(params) {
  return request('/api/inquiry/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: {
      ...params,
    },
  });
}
