import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryData(params) {
  return request(`/api/card?${stringify(params)}`);
}

export async function queryOption(params) {
  return request(`/api/card/option?${stringify(params)}`);
}

export async function addData(params) {
  return request('/api/card/create', {
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
  return request('/api/card/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: {
      ...params,
    },
  });
}
