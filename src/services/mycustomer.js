import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryCustomerType() {
  return request('/api/territory');
}

// 查询客户列表
export async function queryList(params) {
  return request(`/api/client?${stringify(params)}`);
}

export async function add(params) {
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

export async function update(params) {
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
