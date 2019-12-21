import { stringify } from 'qs';
import request from '@/utils/request';

// 查询列表
export async function queryList(params) {
  return request(`/api/notify/getList?${stringify(params)}`);
}

export async function queryDataById(params) {
  return request(`/api/notify/getDataById?${stringify(params)}`);
}

export async function updateData(params) {
  return request('/api/notify/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: {
      ...params,
    },
  });
}
