import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryData(params) {
  return request(`/api/report/settle?${stringify(params)}`);
}

export async function queryDataItems(params) {
  return request(`/api/toolexportorders/getItems?${stringify(params)}`);
}





