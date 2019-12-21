import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryTypes(params) {
  return request(`/api/type?${stringify(params)}`);
}

export async function addTypes(params) {
  return request('/api/type/create', {
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

export async function updateTypes(params) {
  return request('/api/type/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: {
      ...params,
      method: 'update',
    }
  })
}

export async function removeTypes(params) {
  return request('/api/type/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: {
      ...params,
      method: 'delete',
    }
  })
}
