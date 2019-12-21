import { stringify } from 'qs';
import request from '@/utils/request';

// 查询列表
export async function queryList(params) {
  return request(`/api/supporter?${stringify(params)}`);
}

// export async function queryPurchaseById(params) {
//   return request(`/api/supporter/getDataById?${stringify(params)}`);
// }

export async function add(params) {
  return request('/api/supporter/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: {
      ...params,
    },
  });
}

export async function queryGrade(params) {
  return request(`/api/grade/option?${stringify(params)}`);
}

export async function update(params) {
  return request('/api/supporter/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: {
      ...params,
    },
  });
}
