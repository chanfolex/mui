import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Form, Table, Button, Divider, Popconfirm } from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import RoleModal from './RoleModal';

import styles from '../system.less';

@connect(({ role }) => ({
  role,
  // loading: loading.models.customer,
}))
@Form.create()
class Role extends Component {
  state = {
    menuMap: {
      11: '产品分类',
      12: '产品类型',
      13: '产品管理',
      14: '客户等级',

      21: '供应商管理',
      22: '新增采购单',
      23: '采购3',
      24: '采购4',
      25: '采购5',
      26: '采购6',
      27: '采购7',
      28: '采购8',
      29: '采购9',

      31: '销售合同',
      32: '客户询盘',
      33: '我的客户',
      34: '公海客户',
      35: '工艺单',
      36: '新增合同',

      61: '用户管理',
      62: '角色管理',
      63: '系统信息',

      51: '财务1',
      52: '财务2',
      53: '财务3',
      54: '财务4',

    
      41: '客户报表',
    },
  };

  componentDidMount() {
    this.fetchList({ pagination: 1 });
  }

  // 查询我的客户列表
  fetchList = (params = {}) => {
    const { dispatch } = this.props;
    dispatch({ type: 'role/fetch', payload: params });
  };

  // 分页查询
  handleTableChange = pagination => {
    // pagination, filters, sorter
    // this.setState({ page: pagination.current });
    const param = { pagination: pagination.current };
    this.fetchList(param);
  };

  // 新增客户
  createHandler = fields => {
    const { dispatch } = this.props;
    dispatch({ type: 'role/create', payload: { ...fields } });
  };

  // 编辑客户
  editHandler = (id, fields) => {
    const { dispatch } = this.props;
    dispatch({ type: 'role/update', payload: { id, ...fields } });
  };

  handleDelete = fields => {
    const { dispatch } = this.props;
    dispatch({ type: 'role/update', payload: { id: fields.id, status: 2 } });
  };

  render() {
    const {
      role: { list, pagination },
    } = this.props;

    const { loading, menuMap } = this.state;

    const paginationProps = {
      // showSizeChanger: true,
      // showQuickJumper: true,
      ...pagination,
    };

    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        width: 150,
        key: 'name',
      },
      {
        title: '菜单权限',
        dataIndex: 'auth',
        key: 'auth',
        render: auth => (
          <span>
            {auth
              .split(',')
              .map(el => menuMap[el])
              .join(' | ')}
          </span>
        ),
      },
      {
        title: '操作',
        width: 130,
        // fixed: 'right',
        render: (text, record) => (
          <Fragment>
            <RoleModal
              record={record}
              // eslint-disable-next-line react/jsx-no-bind
              onOk={this.editHandler.bind(null, record.id)}
            >
              <a>编辑</a>
            </RoleModal>
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
              <RoleModal record={{}} onOk={this.createHandler}>
                <Button icon="plus" type="primary" size="large">
                  新建
                </Button>
              </RoleModal>
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

export default Role;
