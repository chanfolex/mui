import React, { Component, Fragment } from 'react';

import { connect } from 'dva';
import { Card, Form, Table, Button, Divider, Icon, Popconfirm } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import TableInputSearch from '@/components/common/TableInputSearch';
import Create from './Create';
import Update from './Update';
import styles from './index.less';
// import ExamineModal from '../../Slide/ExamineModal';
import Slide from '../../Slide/ClientSlide';

@connect(({ customer1 }) => ({
  customer1,
  // loading: loading.models.product,
}))
@Form.create()
class Client extends Component {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    stepFormValues: {},
    categorys: [],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    this.fetchList();

    // 查询分类
    dispatch({
      type: 'product/fetchGradeOption',
    }).then(res => {
      if (res.code === 200) {
        this.setState({
          categorys: res.data,
        });
      }
    });
  }

  // 查询询盘列表
  fetchList = (params = {}) => {
    const { dispatch } = this.props;
    dispatch({ type: 'customer1/fetch', payload: params });
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

  // 新增
  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'customer1/create',
      payload: {
        ...fields,
      },
      callback: () => {
        this.handleModalVisible();
      },
    });
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'customer1/update',
      payload: {
        ...fields,
      },
      callback: () => {
        // const { page } = this.state;
        // this.fetchList({ pagination: page });
        // message.success('保存成功');
        this.handleUpdateModalVisible();
      },
    });
  };

  // 分页查询
  handleTableChange = (pagination, filters, sorter) => {
    const param = { pagination: pagination.current };
    if (sorter.columnKey === 'price') {
      param.sort = `price ${sorter.order === 'descend' ? 'desc' : 'asc'}`;
    }
    this.fetchList(param);
  };

  // 询盘编辑
  editHandler = (id, values) => {
    const { dispatch } = this.props;
    dispatch({ type: 'customer1/update', payload: { id, ...values } });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  // 审核通道
  examineHandler = (id, fields) => {
    const { dispatch } = this.props;
    dispatch({ type: 'customer1/update', payload: { id, ...fields } });
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  // 询盘删除
  handleDelete = fields => {
    const { dispatch } = this.props;
    dispatch({ type: 'customer1/update', payload: { id: fields.id, status: 2 } });
  };

  render() {
    const {
      customer1: { list, pagination },
      dispatch,
    } = this.props;

    const {
      modalVisible,
      updateModalVisible,
      stepFormValues,
      categorys,
      drawerVisible,
      currentRecord,
    } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };

    const paginationProps = { ...pagination };

    const columns = [
      {
        title: '名称',
        width: 250,
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '类型',
        dataIndex: 'category',
        width: 150,
        key: 'category',
        render: category => <span>{category ? category.name : '无'}</span>,
      },
      {
        title: '地址',
        width: 150,
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '联系人',
        width: 150,
        dataIndex: 'linkman',
        key: 'linkman',
      },
      {
        title: '联系电话',
        width: 150,
        dataIndex: 'tel',
        key: 'tel',
      },
      {
        title: '主营',
        width: 150,
        dataIndex: 'production',
        key: 'production',
      },
      {
        title: '备注',
        width: 150,
        dataIndex: 'extra',
        key: 'extra',
      },
      {
        title: '营业执照',
        dataIndex: 'cover',
        width: 100,
        key: 'cover',
        render: cover =>
          cover.length === 0 ? (
            <div style={{ width: 80, height: 80, lineHeight: 80 }} />
          ) : (
            <img src={cover} style={{ display: 'inline-block', width: 80, height: 80 }} alt="" />
          ),
      },
      {
        title: '备案',
        dataIndex: 'beian',
        width: 100,
        key: 'beian',
        render: beian =>
          beian.length === 0 ? (
            <div style={{ width: 80, height: 80, lineHeight: 80 }} />
          ) : (
            <img src={beian} style={{ display: 'inline-block', width: 80, height: 80 }} alt="" />
          ),
      },
      {
        title: '许可证',
        dataIndex: 'license',
        width: 100,
        key: 'license',
        render: license =>
          license.length === 0 ? (
            <div style={{ width: 80, height: 80, lineHeight: 80 }} />
          ) : (
            <img src={license} style={{ display: 'inline-block', width: 80, height: 80 }} alt="" />
          ),
      },

      {
        title: '添加人',
        width: 100,
        dataIndex: 'cuser.name',
        key: 'cuser.name',
      },

      {
        title: '资质审核',
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
        title: '添加时间',
        width: 130,
        dataIndex: 'ctime',
        key: 'ctime',
      },
      {
        title: '操作',
        width: 200,
        // fixed: 'right',
        render: (text, record) => (
          <Fragment>
            {/* <ExamineModal record={record} onOk={this.examineHandler.bind(null, record.id)}>
              <a>审核</a>
            </ExamineModal> */}

            <Divider type="vertical" />

            <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a>

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
              <Button
                icon="plus"
                type="primary"
                size="large"
                onClick={() => this.handleModalVisible(true)}
              >
                新建
              </Button>
              <div className={styles.tableListForm}>
                <TableInputSearch
                  field="abbr"
                  placeholder="首字母搜索"
                  handlerEnter={this.fetchList}
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
              onRow={record => ({
                onDoubleClick: () => {
                  this.showDrawer(record);
                }, // 点击行
              })}
              // scroll={{ x: 1010, y: 540 }}
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

        {modalVisible && (
          <Create
            {...parentMethods}
            modalVisible={modalVisible}
            categorys={categorys}
            dispatch={dispatch}
          />
        )}
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <Update
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
            categorys={categorys}
            dispatch={dispatch}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default Client;
