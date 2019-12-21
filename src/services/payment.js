import { stringify } from 'qs';
import request from '@/utils/request';

export async function addData(params) {
  return request('/api/payment/create', {
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

export async function addPayData(params) {
  return request('/api/payment/create', {
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

export async function queryDataById(params) {
  return request(`/api/payment/getDataById?${stringify(params)}`);
}

// 查询列表
export async function queryList(params) {
  return request(`/api/payment?${stringify(params)}`);
}

// 查询列表
export async function queryListPre(params) {
  return request(`/api/payment/preList?${stringify(params)}`);
}

export async function queryPcontract(params) {
  return request(`/api/payment?${stringify(params)}`);
}

export async function updateData(params) {
  return request('/api/payment/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: {
      ...params,
    },
  });
}
