import { stringify } from 'qs';
import request from '@/utils/request';

/**
 * 查询通知
 */
export async function queryNotices() {
  return request('/api/notify');
}

/**
 * 未读通知 10条
 */
export async function queryNoticesUnRead() {
  return request('/api/notify/unread');
}
/**
 * 未读通知数量
 */
export async function queryNoticesUnReadCount() {
  return request('/api/notify/unreadCount');
}

/**
 * 查询推送通知
 */
export async function queryNoticePush() {
  return request('/api/notify/push');
}
/**
 * 菜单通知
 */
export async function queryMenuNotice() {
  return request(`/api/notify/sidebar`);
}

export async function queryProjectNotice() {
  return request('/api/notify/unread');
}

export async function queryActivities() {
  return request('/api/dashboard/fake_chart_data');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/dashboard/fake_chart_data');
}

export async function queryTags() {
  return request('/api/dashboard/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/notify?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/dashboard/fake_chart_data?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/dashboard/fake_chart_data?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/dashboard/fake_chart_data?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'update',
    },
  });
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

// export async function queryNotices() {
//   return request('/api/notices');
// }

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}
