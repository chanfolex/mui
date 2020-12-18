import { stringify } from 'qs';
import request from '@/utils/request';

export async function querySupporterOption(params) {
  return request(`/api/supporter/option?${stringify(params)}`);
}

export async function queryTypeOption(params) {
  return request(`/api/type/option?${stringify(params)}`);
}
export async function queryGradeOption(params) {
  return request(`/api/grade/option?${stringify(params)}`);
}
export async function queryProduct(params) {
  return request(`/api/product?${stringify(params)}`);
}

export async function queryEmployeeOption(params) {
  return request(`/api/employee/option?${stringify(params)}`);
}

export async function addProduct(params) {
  return request('/api/product/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: {
      ...params,
      // method: 'post',
    },
  });
}

export async function getSn(params) {
  return request(`/api/product/getsn?${stringify(params)}`);
}

export async function queryClientOption(params) {
  return request(`/api/client/option?${stringify(params)}`);
}
export async function updateProduct(params) {
  return request('/api/product/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: {
      ...params,
      // method: 'update',
    },
  });
}

export async function removeProduct(params) {
  return request('/api/product', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: {
      ...params,
      // method: 'delete',
    },
  });
}
