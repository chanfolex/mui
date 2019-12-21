import { queryGrade, addGrade, updateGrade, removeGrade } from '@/services/grade';

export default {
  namespace: 'grade',
  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryGrade, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *add({ payload }, { call }) {
      const response = yield call(addGrade, payload);
      return response;
    },
    *update({ payload }, { call }) {
      const response = yield call(updateGrade, payload);
      return response;
    },
    *delete({ payload }, { call }) {
      const response = yield call(removeGrade, payload);
      return response;
    },
  },
  reducers: {
    save(state, action) {
      if (action.payload.code === 200) {
        const data = {
          list: action.payload.data.list,
          pagination: {
            total: action.payload.data.sum,
            pageSize: 10,
            current: 1,
          },
        };
        return {
          ...state,
          data,
        };
      }
      return state;
    },
    add(state) {
      return {
        ...state,
      };
    },
  },
};
