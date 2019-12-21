import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryData(params) {
  return request(`/api/storage?${stringify(params)}`);
}

export async function addData(params) {
  return request('/api/storage/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateData(params) {
  return request('/api/storage/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function removeData(params) {
  return request('/api/storage/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: {
      ...params,
      method: 'delete',
    },
  });
}
