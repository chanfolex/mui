import React, { Component, Fragment } from 'react';
// import Link from 'umi/link';
import { connect } from 'dva';
// import moment from 'moment';

import { Card, Form, Table, Divider, Popconfirm } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import TableInputSearch from '@/components/common/TableInputSearch';
import EditModal from './EditModal';
import CreateCraftModal from './CreateCraftModal';
import ContractSlide from '../../Slide/InsertSlide';
import styles from '../sales.less';

@connect(({ salesContract }) => ({
  salesContract,
  // loading: loading.models.product,
}))
@Form.create()
class SaleContract extends Component {
  state = {
    drawerVisible: false,
    currentRecord: {},
    sn: '',
  };

  componentDidMount() {
    this.fetchList();
  }

  // 查询询盘列表
  fetchList = (params = {}) => {
    const { dispatch } = this.props;
    dispatch({ type: 'salesContract/fetchPrivate', payload: params });
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
    const { sn } = this.state;
    const param = { pagination: pagination.current, private: 1 };
    if (sn) param.sn = sn;
    this.fetchList(param);
  };

  // 询盘编辑
  editHandler = (id, values) => {
    const { dispatch } = this.props;
    dispatch({ type: 'salesContract/update', payload: { id, ...values } });
  };

  // 生成合同
  // contractHandler = values => {
  //   const { dispatch } = this.props;
  //   dispatch({ type: 'salesContract/createContractorders', payload: { ...values } });
  // };

  // 创建工艺单
  createCraftHandler = values => {
    const { dispatch } = this.props;
    dispatch({ type: 'salesContract/createCraft', payload: { ...values } });
  };

  // 询盘删除
  handleDelete = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'salesContract/delete',
      payload: { id: fields.id, sn: fields.sn, status: 2 },
    });
  };

  render() {
    const {
      dispatch,
      salesContract: { list, pagination },
    } = this.props;
    const { drawerVisible, currentRecord } = this.state;
    const paginationProps = { ...pagination };

    const columns = [
      {
        title: 'SN',
        dataIndex: 'sn',
        key: 'sn',
        width: 200,
      },
      {
        title: '类型',
        dataIndex: 'client.territory',
        width: 100,
        key: 'client.territory',
        render: text => <span>{text === 1 ? '内销' : '外销'}</span>,
      },

      {
        title: '格式',
        width: 100,
        dataIndex: 'sample',
        key: 'sample',
        render: text => <span>{text === 1 ? '样品' : '普通'}</span>,
      },
      {
        title: '客户',
        width: 150,
        dataIndex: 'client.name',
        key: 'client.name',
      },
      {
        title: '种类',
        width: 150,
        dataIndex: 'count',
        key: 'count',
      },
      {
        title: '总金额',
        // width: 150,
        dataIndex: 'total',
        key: 'total',
        // render: text => <span>${total}</span>,
      },
      {
        title: '发货日期',
        width: 150,
        dataIndex: 'delivery',
        key: 'delivery',
      },

      {
        title: '创建人',
        // width: 150,
        dataIndex: 'cuser.name',
        key: 'cuser.name',
      },
      {
        title: '创建时间',
        // width: 300,
        dataIndex: 'ctime',
        key: 'ctime',
      },
      {
        title: '操作',
        // width: 250,
        render: (text, record) => (
          <Fragment>
            <CreateCraftModal record={record} onOk={this.createCraftHandler}>
              <a>制作工艺单</a>
            </CreateCraftModal>
            <Divider type="vertical" />

            <a onClick={() => this.showDrawer(record)}>详情</a>

            <Divider type="vertical" />

            <EditModal
              record={record}
              // eslint-disable-next-line react/jsx-no-bind
              onOk={this.editHandler.bind(null, record.id)}
            >
              <a>编辑</a>
            </EditModal>
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
              {/* <Link to="/purchase/list/add">
                <Button icon="plus" type="primary" size="large">新建</Button>
              </Link> */}
              <div className={styles.tableListForm}>
                <TableInputSearch
                  field="sn"
                  placeholder="搜索SN"
                  handlerEnter={val => this.handleSearch(val)}
                />
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
          <ContractSlide
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

export default SaleContract;
