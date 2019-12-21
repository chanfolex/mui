import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryPlan(params) {
  return request(`/api/purchase/plan?${stringify(params)}`);
}

export async function addPlan(params) {
  return request('/api/purchase/plan', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updatePlan(params) {
  return request('/api/purchase/plan', {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    }
  })
}

export async function removePlan(params) {
  return request('/api/purchase/plan', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    }
  })
}
