import { message } from 'antd';
import { queryRoles, addRole, updateRole } from '@/services/role';

export default {
  namespace: 'role',

  state: {
    list: [],
    pagination: {
      total: 0,
      current: 1,
      pageSize: 10,
    },
    menus: [
      {
        name: '资源管理',
        value: 1,
        children: [
          { label: '产品分类', value: 11 },
          { label: '产品类型', value: 12 },
          { label: '产品管理', value: 13 },
          { label: '客户等级', value: 14 },
        ],
      },

      {
        name: '采购管理',
        value: 2,
        children: [
          { label: '采购申请单', value: 21 },
          { label: '采购合同', value: 22 },
          { label: '采购合同', value: 23 },
          { label: '采购合同', value: 24 },
          { label: '采购合同', value: 25 },
          { label: '采购合同', value: 26 },
          { label: '采购合同', value: 27 },
          { label: '采购合同', value: 28 },
          { label: '采购合同', value: 29 },
        ],
      },
      {
        name: '销售管理',
        value: 3,
        children: [
          { label: '销售合同', value: 31 },
          { label: '客户询盘', value: 32 },
          { label: '我的客户', value: 33 },
          { label: '销售4', value: 34 },
          { label: '销售5', value: 35 },
          { label: '销售6', value: 36 },
        ],
      },
      {
        name: '系统管理',
        value: 4,
        children: [
          { label: '用户管理', value: 41 },
          { label: '角色管理', value: 42 },
          { label: '系统信息', value: 43 },
        ],
      },
      {
        name: '财务管理',
        value: 5,
        children: [
          { label: '财务审核', value: 51 },
          { label: '财务审核', value: 52 },
          { label: '财务审核', value: 53 },
          { label: '财务审核', value: 54 },
        ],
      },
      {
        name: '审核管理',
        value: 6,
        children: [
          { label: '销售合同', value: 61 },
          { label: '采购合同', value: 62 },
          { label: '单证付款', value: 63 },
          { label: '采购付款', value: 64 },
          { label: '主管合同审核', value: 65 },
          { label: '主管付款审核', value: 66 },
        ],
      },
      {
        name: '单证管理',
        value: 7,
        children: [
          { label: '单证1', value: 71 },
          { label: '单证2', value: 72 },
          { label: '单证3', value: 73 },
        ],
      },
      {
        name: '邮件管理',
        value: 8,
        children: [{ label: '发邮件', value: 81 }, { label: '收邮件', value: 82 }],
      },
      {
        name: '报表管理',
        value: 9,
        children: [
          { label: '客户报表', value: 91 },
          // { label: '产品类型', value: 12 },
          // { label: '产品管理', value: 13 },
          // { label: '客户等级', value: 14 },
        ],
      },
    ],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const res = yield call(queryRoles, payload);
      if (res.code === 200) {
        yield put({ type: 'save', payload: res.data });
      }
    },
    *create({ payload }, { call, put }) {
      const res = yield call(addRole, payload);
      if (res.code === 200) {
        yield put({ type: 'reload' });
        message.success('添加成功');
      } else {
        message.warning(res.msg);
      }
    },
    *update({ payload }, { call, put }) {
      const res = yield call(updateRole, payload);
      if (res.code === 200) {
        yield put({ type: 'reload' });
        message.success('更新成功');
      } else {
        message.warning(res.msg);
      }
    },
    *reload(_, { put, select }) {
      const pagination = yield select(state => state.customer.pagination);
      yield put({ type: 'fetch', payload: { pagination: pagination.page } });
    },
  },

  reducers: {
    save(state, action) {
      const { list, sum } = action.payload;
      if (sum) {
        const pagination = {
          total: sum,
          current: state.pagination.current,
          pageSize: 10,
        };
        return { ...state, list, pagination };
      }
      return { ...state, list: action.payload };
    },
  },
};
