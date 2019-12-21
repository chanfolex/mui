import { stringify } from 'qs';
import request from '@/utils/request';

// 查询编码
export async function getPurchaseSN() {
  return request('/api/prepurchase/getsn');
}

// 查询列表
export async function queryList(params) {
  return request(`/api/purchase?${stringify(params)}`);
}

// 查询列表
export async function queryAllItems(params) {
  return request(`/api/prepurchase/getAllItems?${stringify(params)}`);
}

// 查询列表
export async function queryListPre(params) {
  return request(`/api/purchase/preList?${stringify(params)}`);
}

// 查询列表
export async function queryCategoryOption(params) {
  return request(`/api/payment/companys?${stringify(params)}`);
}

// 查询列表
export async function queryStorageOption(params) {
  return request(`/api/payment/storage/option?${stringify(params)}`);
}

// 查询列表
export async function queryPurchase(params) {
  return request(`/api/prepurchase?${stringify(params)}`);
}

export async function queryPurchaseById(params) {
  return request(`/api/prepurchase/getDataById?${stringify(params)}`);
}

export async function insertPrePay(params) {
  return request('/api/payment/insertPrePay', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: {
      ...params,
    },
  });
}

export async function addPurchase(params) {
  return request('/api/prepurchase/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: {
      ...params,
    },
  });
}
export async function addContract(params) {
  return request('/api/purchase/create', {
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
export async function queryContractBySn(params) {
  return request(`/api/purchase/getItems?${stringify(params)}`);
}

// 查询列表
export async function queryPreItems(params) {
  return request(`/api/prepurchase/getItems?${stringify(params)}`);
}

export async function updatePurchase(params) {
  return request('/api/prepurchase/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: {
      ...params,
    },
  });
}

export async function examine(params) {
  return request('/api/purchase/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: {
      ...params,
    },
  });
}
