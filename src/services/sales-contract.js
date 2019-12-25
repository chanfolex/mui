import { stringify } from 'qs';
// eslint-disable-next-line import/extensions
import request from '@/utils/request';

// 查询销售合同编码
export async function getSalesContractSN() {
  return request('/api/orders/getsn');
}
export async function getPurchaseContractSN() {
  return request('/api/prepurchase/getsn');
}

// 查询列表
export async function querySalesContract(params) {
  return request(`/api/orders?${stringify(params)}`);
}

// 查询列表
export async function querySalesContractPrivate(params) {
  return request(`/api/orders/privateList?${stringify(params)}`);
}
// 查询列表
export async function queryInsertBySn(params) {
  return request(`/api/prepurchase/getItems?${stringify(params)}`);
}

// 查询列表
export async function queryExportBySn(params) {
  return request(`/api/orders/getItems?${stringify(params)}`);
}

export async function addSalesContract(params) {
  return request('/api/orders/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: {
      ...params,
    },
  });
}

export async function queryClientOption(params) {
  return request(`/api/client/option?${stringify(params)}`);
}
export async function queryUserOption(params) {
  return request(`/api/user/option?${stringify(params)}`);
}

export async function queryStorageOption(params) {
  return request(`/api/storage/option?${stringify(params)}`);
}

export async function queryCategoryOption(params) {
  return request(`/api/category/option?${stringify(params)}`);
}

export async function queryClientOptionPrivate(params) {
  return request(`/api/client/option?${stringify(params)}`);
}

export async function updateSalesContract(params) {
  return request('/api/orders/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: {
      ...params,
    },
  });
}
export async function deleteSalesContract(params) {
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

export async function addCraft(params) {
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
