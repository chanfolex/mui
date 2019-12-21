import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryCategory(params) {
  return request(`/api/category?${stringify(params)}`);
}

export async function queryCategoryOption(params) {
  return request(`/api/category/option?${stringify(params)}`);
}

export async function addCategory(params) {
  return request('/api/category', {
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

export async function updateCategory(params) {
  return request('/api/category', {
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

export async function removeCategory(params) {
  return request('/api/category', {
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
