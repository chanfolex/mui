import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryData(params) {
  return request(`/api/procedure?${stringify(params)}`);
}

export async function addData(params) {
  return request('/api/procedure/create', {
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
  return request('/api/procedure/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: {
      ...params,
    },
  });
}

export async function queryDataItems(params) {
  return request(`/api/procedure/getItems?${stringify(params)}`);
}

export async function removeData(params) {
  return request('/api/procedure/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: {
      ...params,
    },
  });
}
