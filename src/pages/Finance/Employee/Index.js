import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
// import moment from 'moment';
import { Card, Form, Input, Table, Button, message, Divider, Popconfirm } from 'antd';

// import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import CreateData from './Create';
import UpdateData from './Update';
import TableInputSearch from '@/components/common/TableInputSearch';
import Slide from '../../Slide/ProductSlide';

import styles from './Index.less';

// const { Option } = Select;

@connect(({ employee, user }) => ({
  employee,
  currentUser: user.currentUser,
  // loading: loading.models.product,
}))
@Form.create()
class EmployeeIndex extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    stepFormValues: {},
    abbr: '',
    category: '',
    drawerVisible: false,
    currentRecord: {},
    // loading: false,
  };

  componentDidMount() {
    this.fetchList();
    // 查询分类

    // dispatch({
    //   type: 'product/fetchSupporterOption',
    // }).then(res => {
    //   if (res.code === 200) {
    //     this.setState({
    //       supporters: res.data,
    //     });
    //   }
    // });
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

  content = index => (
    <div>
      <Input placeholder="请输入员工名称" />
      <p style={{ margin: 0, paddingTop: 10, textAlign: 'right' }}>
        <Button size="small" onClick={() => this.hide(index)}>
          取消
        </Button>
        &nbsp;&nbsp;
        <Button type="primary" size="small">
          保存
        </Button>
      </p>
    </div>
  );

  // 查询产品列表
  fetchList = (params = {}) => {
    const { dispatch } = this.props;
    const { category, abbr } = this.state;
    const param = { ...params };
    if (category) param.category = category;
    if (abbr) param.abbr = abbr;
    dispatch({ type: 'employee/fetch', payload: param });
  };

  // 分页查询
  handleTableChange = (pagination, filters, sorter) => {
    const { abbr } = this.state;
    const param = { pagination: pagination.current };
    if (sorter.columnKey === 'price') {
      param.sort = `price ${sorter.order === 'descend' ? 'desc' : 'asc'}`;
    }
    if (abbr) param.abbr = abbr;
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

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  // 新增
  handleAdd = fields => {
    const {
      dispatch,
      employee: { pagination },
    } = this.props;
    dispatch({
      type: 'employee/add',
      payload: {
        ...fields,
      },
      callback: () => {
        this.fetchList({ pagination: pagination.current });
        message.success('添加成功');
        this.handleModalVisible();
      },
    });
  };

  handleUpdate = fields => {
    const {
      dispatch,
      employee: { pagination },
    } = this.props;
    dispatch({
      type: 'employee/update',
      payload: {
        ...fields,
      },
      callback: () => {
        this.fetchList({ pagination: pagination.current });
        message.success('保存成功');
        this.handleUpdateModalVisible();
      },
    });
  };

  handleDelete = fields => {
    const {
      dispatch,
      employee: { pagination },
    } = this.props;
    dispatch({
      type: 'employee/update',
      payload: {
        id: fields.id,
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
    this.setState({ category: val }, () => {
      this.fetchList();
    });
  };

  // handleEdit(e, index) {
  //   e.preventDefault();
  //   const {
  //     form: { getFieldValue, resetFields },
  //     product: { list },
  //     dispatch,
  //   } = this.props;
  //   const name = getFieldValue('productName');
  //   // console.log(name, index);
  //   const obj = list[index];
  //   obj.name = name;
  //   obj.category = obj.category ? obj.category.id : null;
  //   dispatch({
  //     type: 'employee/update',
  //     payload: obj,
  //     callback() {
  //       message.success('产品名称更新成功');
  //     },
  //   });
  //   // 重置输入框状态
  //   resetFields();
  // }

  render() {
    const {
      employee: { list, pagination },
      dispatch,
      currentUser,
    } = this.props;
    const {
      modalVisible,
      updateModalVisible,
      stepFormValues,
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
    const paginationProps = {
      // showSizeChanger: true,
      // showQuickJumper: true,
      ...pagination,
    };

    const columns = [
      {
        title: '编码',
        dataIndex: 'barsn',
        width: 100,
        key: 'barsn',
      },

      {
        title: '名称',
        dataIndex: 'name',
        width: 150,
        key: 'name',
      },

      {
        title: '备注',
        width: 200,
        dataIndex: 'intro',
        key: 'intro',
        render: text => <p>{text}</p>,
      },
      {
        title: '创建日期',
        width: 200,
        dataIndex: 'ctime',
        key: 'ctime',
        render: text => <p>{text}</p>,
      },
      {
        title: '操作',
        width: 120,
        fixed: 'right',
        render: (text, record) => (
          <Fragment>
            {currentUser.role.id === 1 ||
            currentUser.role.id === 13 ||
            currentUser.role.id === 20 ||
            currentUser.role.id === 18 ? (
              <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a>
            ) : (
              <a onClick={() => this.handleUpdateModalVisible(true, record)} disabled>
                编辑
              </a>
            )}

            <Divider type="vertical" />
            <Popconfirm
              title="你确定删除吗?"
              onConfirm={() => this.handleDelete(record)}
              okText="是"
              cancelText="否"
            >
              {currentUser.role.id === 1 ||
              currentUser.role.id === 13 ||
              currentUser.role.id === 20 ||
              currentUser.role.id === 18 ? (
                <a href="#">删除</a>
              ) : (
                <a href="#" disabled>
                  删除
                </a>
              )}
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
              {/* <Select
                size="large"
                style={{ width: 200, marginRight: 20 }}
                placeholder="选择产品分类"
                allowClear
                onChange={this.handleCategoryChange}
              >
                {categorys.map(el => (
                  <Option key={el.id} value={el.id}>
                    {el.name}
                  </Option>
                ))}
              </Select> */}
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

        {modalVisible && (
          <CreateData {...parentMethods} modalVisible={modalVisible} dispatch={dispatch} />
        )}
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateData
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
            dispatch={dispatch}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default EmployeeIndex;
