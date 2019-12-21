import { stringify } from 'qs';
import request from '@/utils/request';

// 查询列表
export async function queryInsertList(params) {
  return request(`/api/prepurchase?${stringify(params)}`);
}

export async function deleteInsert(params) {
  return request('/api/prepurchase/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: {
      ...params,
    },
  });
}

export async function deleteExport(params) {
  return request('/api/orders/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: {
      ...params,
    },
  });
}

export async function queryExportList(params) {
  return request(`/api/orders?${stringify(params)}`);
}

export async function queryDataById(params) {
  return request(`/api/process/getDataById?${stringify(params)}`);
}

export async function add(params) {
  return request('/api/process/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: {
      ...params,
    },
  });
}

// 查询列表
export async function queryItemsBySn(params) {
  return request(`/api/process/getItems?${stringify(params)}`);
}

export async function updateData(params) {
  return request('/api/process/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: {
      ...params,
    },
  });
}
