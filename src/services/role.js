import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryRoles(params) {
  return request(`/api/role?${stringify(params)}`);
}

export async function addRole(params) {
  return request('/api/role/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  });
}
export async function updateRole(params) {
  return request('/api/role/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  });
}
