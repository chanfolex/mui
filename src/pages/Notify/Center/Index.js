import React, { Component } from 'react';

import { connect } from 'dva';

import { Card, Form, Table, Icon } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import TableInputSearch from '@/components/common/TableInputSearch';
import Slide from '../../Slide/NotifySlide';

import styles from './index.less';

@connect(({ notify }) => ({
  notify,
  // loading: loading.models.product,
}))
@Form.create()
class AllNotify extends Component {
  state = {
    drawerVisible: false,
    currentRecord: {},
  };

  componentDidMount() {
    this.fetchList();
  }

  // 查询询盘列表
  fetchList = (params = {}) => {
    const { dispatch } = this.props;
    dispatch({ type: 'notify/fetch', payload: params });
  };

  // 分页查询
  handleTableChange = (pagination, filters, sorter) => {
    const param = { pagination: pagination.current };
    if (sorter.columnKey === 'price') {
      param.sort = `price ${sorter.order === 'descend' ? 'desc' : 'asc'}`;
    }
    this.fetchList(param);
  };

  showDrawer = record => {
    this.setState({
      drawerVisible: true,
      currentRecord: record,
    });
  };

  onDrawerClose = () => {
    this.setState({
      drawerVisible: false,
    });
  };

  // 询盘编辑
  editHandler = (id, values) => {
    const { dispatch } = this.props;
    dispatch({ type: 'payment/update', payload: { id, ...values } });
  };

  // 询盘删除
  handleDelete = fields => {
    const { dispatch } = this.props;
    dispatch({ type: 'payment/update', payload: { id: fields.id, status: 2 } });
  };

  render() {
    const {
      dispatch,
      notify: { list, pagination },
    } = this.props;

    const { drawerVisible, currentRecord } = this.state;

    const paginationProps = { ...pagination };

    const columns = [
      {
        title: 'id',
        dataIndex: 'id',
        key: 'id',
        width: 100,
      },
      {
        title: '数据ID',
        dataIndex: 'data_id',
        key: 'data_id',
        width: 100,
      },
      {
        title: '数据类型',
        dataIndex: 'type',
        width: 100,
        key: 'type',
      },
      {
        title: '动作类型',
        dataIndex: 'action',
        width: 100,
        key: 'action',
      },
      {
        title: '发送者',
        dataIndex: 'send.nickname',
        width: 100,
        key: 'send.nickname',
      },
      {
        title: '接受者',
        dataIndex: 'rec.nickname',
        width: 100,
        key: 'rec.nickname',
      },
      {
        title: '阅读状态',
        width: 150,
        dataIndex: 'state',
        key: 'state',
        render: text => (
          <Icon
            type="check-circle"
            theme="filled"
            style={{ color: text === 1 ? '#36ab60' : '#bfbfbf' }}
          />
        ),
      },
      {
        title: '阅读时间',
        width: 150,
        dataIndex: 'ctime',
        key: 'ctime',
      },
      {
        title: 'web推送',
        width: 150,
        dataIndex: 'push',
        key: 'push',
        render: text => (
          <Icon
            type="check-circle"
            theme="filled"
            style={{ color: text === 1 ? '#36ab60' : '#bfbfbf' }}
          />
        ),
      },
      {
        title: '微信推送',
        width: 150,
        dataIndex: 'wx_push',
        key: 'wx_push',
        render: text => (
          <Icon
            type="check-circle"
            theme="filled"
            style={{ color: text === 1 ? '#36ab60' : '#bfbfbf' }}
          />
        ),
      },
      {
        title: '短信推送',
        width: 150,
        dataIndex: 'message_push',
        key: 'message_push',
        render: text => (
          <Icon
            type="check-circle"
            theme="filled"
            style={{ color: text === 1 ? '#36ab60' : '#bfbfbf' }}
          />
        ),
      },
      {
        title: '创建时间',
        width: 150,
        dataIndex: 'ctime',
        key: 'ctime',
      },
    ];

    return (
      <PageHeaderWrapper title="">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <div className={styles.tableListForm}>
                <TableInputSearch field="sn" placeholder="搜索SN" handlerEnter={this.fetchList} />
              </div>
            </div>
            <Table
              rowKey="id"
              columns={columns}
              // loading={loading}
              dataSource={list}
              pagination={paginationProps}
              onChange={this.handleTableChange}
              // scroll={{ x: 1010, y: 540 }}

              onRow={record => ({
                onDoubleClick: () => {
                  this.showDrawer(record);
                }, // 点击行
              })}
            />
          </div>
        </Card>

        {drawerVisible && (
          <Slide
            visible={drawerVisible}
            formRow={currentRecord}
            onClose={this.onDrawerClose}
            dispatch={dispatch}
          />
        )}
      </PageHeaderWrapper>
    );
  }
}

export default AllNotify;
