import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryGrade(params) {
  return request(`/api/grade?${stringify(params)}`);
}

export async function addGrade(params) {
  return request('/api/grade/create', {
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

export async function updateGrade(params) {
  return request('/api/grade/save', {
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

export async function removeGrade(params) {
  return request('/api/grade/save', {
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
