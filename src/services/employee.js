import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryData(params) {
  return request(`/api/employee?${stringify(params)}`);
}

export async function addData(params) {
  return request('/api/employee/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: {
      ...params,
    },
  });
}

export async function updateData(params) {
  return request('/api/employee/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: {
      ...params,
    },
  });
}
