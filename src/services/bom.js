import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryData(params) {
  return request(`/api/bom?${stringify(params)}`);
}

export async function addData(params) {
  return request('/api/bom/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: {
      ...params,
    },
  });
}

export async function queryOption(params) {
  return request(`/api/bom/option?${stringify(params)}`);
}


export async function queryItems(params) {
    return request(`/api/bom/getItems?${stringify(params)}`);
  }


export async function updateData(params) {
  return request('/api/bom/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: {
      ...params,
    },
  });
}
