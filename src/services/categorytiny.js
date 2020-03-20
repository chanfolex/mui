import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryCategory(params) {
  return request(`/api/category?${stringify(params)}`);
}

export async function queryCategoryTinyOption(params) {
  return request(`/api/categorytiny/option?${stringify(params)}`);
}



