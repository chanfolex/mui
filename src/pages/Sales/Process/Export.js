import React, { Component, Fragment } from 'react';

import { connect } from 'dva';

import { Card, Form, Table, Popconfirm,Divider} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import TableInputSearch from '@/components/common/TableInputSearch';
import Slide from '../../Slide/ExportSlide';
import PrintModal from '../../Print/PrintExportModal';

import styles from './Index.less';

@connect(({ process }) => ({
  process,
  // loading: loading.models.product,
}))
@Form.create()
class ProcessExport extends Component {
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
    dispatch({ type: 'process/fetchExport', payload: params });
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
    dispatch({ type: 'process/update', payload: { id, ...values } });
  };

  // 生成合同
  contractHandler = values => {
    const { dispatch } = this.props;
    dispatch({ type: 'process/createContractorders', payload: { ...values } });
  };

  // 询盘删除
  handleDelete = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'process/deleteExport',
      payload: { id: fields.id, sn: fields.sn, status: 2 },
    });
  };

  render() {
    const {
      dispatch,
      process: { list, pagination },
    } = this.props;

    const { drawerVisible, currentRecord } = this.state;

    const paginationProps = { ...pagination };

    const columns = [
      {
        title: 'SN',
        dataIndex: 'sn',
        key: 'sn',
        width: 250,
      },
      {
        title: '客户',
        width: 150,
        dataIndex: 'client.name',
        key: 'client.name',
      },
   
       {
        title: '经手人',
        width: 150,
        dataIndex: 'cuser.nickname',
        key: 'cuser.nickname',
      },
      {
        title: '创建时间',
        width: 300,
        dataIndex: 'ctime',
        key: 'ctime',
      },
      {
        title: '操作',
        width: 150,
        fixed: 'right',
        render: (text, record) => (
          <Fragment>
            {/* <Divider type="vertical" />
            <EditModal
              record={record}
              // eslint-disable-next-line react/jsx-no-bind
              onOk={this.editHandler.bind(null, record.id)}
            >
              <a>编辑</a>
            </EditModal>
            <Divider type="vertical" /> */}
            <PrintModal record={record}>
              <a>打印</a>
            </PrintModal>
            <Divider type="vertical" />
            <Popconfirm
              title="你确定删除吗?"
              onConfirm={() => this.handleDelete(record)}
              okText="是"
              cancelText="否"
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
              scroll={{ x: 1400, y: 540 }}
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

export default ProcessExport;
