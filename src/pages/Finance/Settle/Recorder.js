import React, { Component, Fragment } from 'react';

import { connect } from 'dva';
import { Card, Form, Table, Button, Divider, message,Popconfirm,Select } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import TableInputSearch from '@/components/common/TableInputSearch';
import styles from './index.less';
import Slide from '../../Slide/Material/ImportSlide';
import PrintModal from '../../Print/Product/PrintExportModal';

@connect(({ settle }) => ({
    settle,
  // loading: loading.models.product,
}))
@Form.create()
class ProductExportOrders extends Component {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    categorys: [],
    abbr: '',
    client: '',
    stepFormValues: {},
    drawerVisible: false,
    currentRecord: {},
  };

 
  componentDidMount() {
    const { dispatch } = this.props;

    this.fetchList();
    // 查询分类
    dispatch({
      type: 'product/fetchClientOption',
    }).then(res => {
      if (res.code === 200) {
        this.setState({
          categorys: res.data,
        });
      }
    });

    
  }

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


   // 查询列表
   fetchList = (params = {}) => {
    const { dispatch } = this.props;
    const { client, abbr } = this.state;
    const param = { ...params };
    if (client) param.client = client;
    if (abbr) param.abbr = abbr;
    dispatch({ type: 'settle/fetch', payload: param });
  };


  handleDelete = fields => {
    const {
      dispatch,
      settle: { pagination },
    } = this.props;
    dispatch({
      type: 'settle/delete',
      payload: {
        id: fields.id,
        sn:fields.sn,
        status: 2,
      },
      callback: res => {
        if (res.code === 200) {
          this.fetchList({ pagination: pagination.current });
          message.success('删除成功');
        }
      },
    });
  };

   // 分类选择查询
   handleCategoryChange = val => {
    // const params = val ? {} : {};
    this.setState({ client: val }, () => {
      this.fetchList();
    });
  };

  // 分页查询
  handleTableChange = (pagination, filters, sorter) => {
    const { abbr, client } = this.state;
    const param = { pagination: pagination.current };
    if (sorter.columnKey === 'price') {
      param.sort = `price ${sorter.order === 'descend' ? 'desc' : 'asc'}`;
    }
    if (abbr) param.abbr = abbr;
    if (client) param.client = client;
    this.fetchList(param);
  };

  handleSearch = val => {
    this.setState(
      {
        ...val,
      },
      () => {
        this.fetchList();
      }
    );
  };




  render() {
    const {
        settle: { list, pagination },
      dispatch,
    } = this.props;

    const {
      drawerVisible,
      currentRecord,
      categorys,
    } = this.state;

    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };

    const paginationProps = { ...pagination };

    const columns = [
      {
        title: '订单编号',
        width: 150,
        dataIndex:'sn',
        key: 'sn',
      },
      {
        title: '供应商',
        width: 250,
        dataIndex:'client.name',
        key: 'client.name',
      },
       {
        title: '合计',
        width: 150,
        dataIndex:'sum',
        key: 'sum',
      },
    
      {
        title: '添加人',
        width: 100,
        dataIndex:'employee.nickname',
        key: 'employee.nickname',
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
        fixed: 'right',
        render: (text, record) => (
          <Fragment>
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
            <Select
                size="large"
                style={{ width: 200, marginRight: 20 }}
                placeholder="选择客户"
                allowClear
                onChange={this.handleCategoryChange}
              >
                {categorys.map(el => (
                  <Option key={el.id} value={el.id}>
                    {el.name}
                  </Option>
                ))}
              </Select>
              <div className={styles.tableListForm}>
                <TableInputSearch
                  field="sn"
                  placeholder="订单编号搜索"
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
              scroll={{ x: 1500, y: 650 }}
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

export default ProductExportOrders;
