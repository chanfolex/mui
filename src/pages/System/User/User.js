import React, { Component, Fragment } from 'react';
import { connect } from 'dva';

import { Card, Form, Switch, Table, Button, Divider, Popconfirm } from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import UserModal from './UserModal';
import TableInputSearch from '@/components/common/TableInputSearch';

import styles from '../system.less';

// const FormItem = Form.Item;
// const { Option } = Select;

@connect(({ user, role }) => ({
  user,
  role,
  // loading: loading.models.customer,
}))
@Form.create()
class User extends Component {
  state = {
    abbr: '',
  };

  componentDidMount() {
    this.fetchList();
  }

  // 查询我的客户列表
  fetchList = (params = {}) => {
    const { dispatch } = this.props;
    dispatch({ type: 'user/fetch', payload: params });
    dispatch({ type: 'role/fetch' });
  };

  handleSearch = val => {
    this.setState(
      {
        ...val,
      },
      () => {
        this.fetchList(val || null);
      }
    );
  };

  // 分页查询
  handleTableChange = pagination => {
    const { abbr } = this.state;
    const param = { pagination: pagination.current };
    if (abbr) param.abbr = abbr;
    this.fetchList(param);
  };

  // 新增客户
  createHandler = fields => {
    const { dispatch } = this.props;
    dispatch({ type: 'user/create', payload: { ...fields } });
  };

  // 编辑客户
  editHandler = (id, fields) => {
    const { dispatch } = this.props;
    dispatch({ type: 'user/update', payload: { id, ...fields } });
  };

  handleDelete = fields => {
    const { dispatch } = this.props;
    dispatch({ type: 'user/update', payload: { id: fields.id, status: 2 } });
  };

  onSwitchChange = (value, record) => {
    const { dispatch } = this.props;
    // eslint-disable-next-line no-param-reassign
    delete record.create_time;
    dispatch({
      type: 'user/update',
      payload: { ...record, role: record.role.id, state: Number(value) },
    });
    // console.log(`switch to ${value}`, record);
  };

  render() {
    const {
      user: { list, pagination },
      role,
      // form,
    } = this.props;

    const { loading } = this.state;

    const paginationProps = {
      // showSizeChanger: true,
      // showQuickJumper: true,
      ...pagination,
    };

    const columns = [
      {
        title: '工号',
        width: 200,
        dataIndex: 'workno',
        key: 'workno',
      },
      {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
        width: 150,
      },
      {
        title: '头像',
        dataIndex: 'avatar',
        key: 'avatar',
        width: 100,
        render: avatar => <img src={avatar} style={{ width: 50, height: 50 }} alt="" />,
      },
      {
        title: '角色',
        dataIndex: 'role.name',
        width: 150,
        key: 'role.name',
      },

      {
        title: '昵称',
        width: 150,
        dataIndex: 'nickname',
        key: 'nickname',
      },
      {
        title: '电话',
        width: 180,
        dataIndex: 'phone',
        key: 'phone',
      },
      {
        title: '邮箱',
        width: 200,
        dataIndex: 'mail_account',
        key: 'mail_account',
      },
      {
        title: 'OpenID',
        width: 200,
        dataIndex: 'openid',
        key: 'openid',
      },
      {
        title: '创建时间',
        width: 150,
        dataIndex: 'ctime',
        key: 'ctime',
      },
      {
        title: '状态',
        width: 150,
        dataIndex: 'state',
        key: 'state',
        render: (state, record) => (
          <Switch
            size="small"
            defaultChecked={Boolean(state)}
            onChange={val => this.onSwitchChange(val, record)}
          />
        ),
      },
      {
        title: '操作',
        width: 130,
        // fixed: 'right',
        render: (text, record) => (
          <Fragment>
            <UserModal
              record={record}
              roles={role.list}
              // eslint-disable-next-line react/jsx-no-bind
              onOk={this.editHandler.bind(null, record.id)}
            >
              <a>编辑</a>
            </UserModal>
            <Divider type="vertical" />
            <Popconfirm
              title="你确定删除吗?"
              okText="是"
              cancelText="否"
              onConfirm={() => this.handleDelete(record)}
            >
              <a href="#">删除</a>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];
    return (
      <PageHeaderWrapper title="">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <UserModal record={{}} roles={role.list} onOk={this.createHandler}>
                <Button icon="plus" type="primary" size="large">
                  新建
                </Button>
              </UserModal>
              <div className={styles.tableListForm}>
                <TableInputSearch
                  field="abbr"
                  placeholder="首字母搜索"
                  handlerEnter={val => this.handleSearch(val)}
                />
              </div>
            </div>
            <Table
              rowKey="id"
              columns={columns}
              loading={loading}
              dataSource={list}
              pagination={paginationProps}
              onChange={this.handleTableChange}
              // scroll={{ x: 1070, y: 540 }}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default User;
