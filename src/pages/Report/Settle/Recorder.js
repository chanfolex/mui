import React, { Component, Fragment } from 'react';

import { connect } from 'dva';
import moment from 'moment';
import { Card, Form, Table, Button, Divider, message, Popconfirm, Select, DatePicker } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import TableInputSearch from '@/components/common/TableInputSearch';
import styles from '../Index.less';
import Slide from '../../Slide/SettleSlide';
// import PrintModal from '../../Print/Report/ToolGet/ExportModal';
const { MonthPicker } = DatePicker;

@connect(({ report_settle }) => ({
  report_settle,
  // loading: loading.models.product,
}))
@Form.create()
class ReportSettle extends Component {
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

  onDateChange = (date, dateString) => {
    this.setState({
      client: dateString,
    });
    this.fetchList();
    console.log(this.state.client);
  };

  // 查询列表
  fetchList = (params = {}) => {
    const { dispatch } = this.props;
    const { client, abbr } = this.state;
    const param = { ...params };
    if (client) param.client = client;
    if (abbr) param.abbr = abbr;
    dispatch({ type: 'report_settle/fetch', payload: param });
  };

  handleDelete = fields => {
    const {
      dispatch,
      report_settle: { pagination },
    } = this.props;
    dispatch({
      type: 'report_settle/delete',
      payload: {
        id: fields.id,
        sn: fields.sn,
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
      report_settle: { list, pagination },
      dispatch,
    } = this.props;

    const { drawerVisible, currentRecord, categorys } = this.state;

    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };

    const paginationProps = { ...pagination };

    const columns = [
      {
        title: '姓名',
        width: 100,
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '合计',
        width: 100,
        dataIndex: 'total',
        key: 'total',
      },
      {
        title: '时间',
        width: 100,
        dataIndex: 'mapdate',
        key: 'mapdate',
      },

      {
        title: '操作',
        width: 100,
        fixed: 'right',
        render: (text, record) => (
          <Fragment>
            {/* <PrintModal record={record}>
              <a>打印</a>
            </PrintModal> */}
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderWrapper title="">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              {/* <Select
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
              
              */}

              <MonthPicker
                format="YYYY-MM"
                onChange={this.onDateChange}
                placeholder="选择单据时间"
                defaultValue={moment()}
              />

              <div className={styles.tableListForm}>
                <TableInputSearch
                  field="abbr"
                  placeholder="员工姓名拼音首字母"
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

export default ReportSettle;
