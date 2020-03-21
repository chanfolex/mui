import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
// import moment from 'moment';
import { Card, Form, Input, Select, Table, Button, message, Divider, Popconfirm } from 'antd';
import Zmage from 'react-zmage';
// import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import TableInputSearch from '@/components/common/TableInputSearch';
import CreateProduct from './Create';
import UpdateProduct from './Update';
import GetCard from './GetCard';
import Slide from '../../Slide/ProcedureSlide';

import styles from './product.less';

const { Option } = Select;

@connect(({ product, user }) => ({
  product,
  currentUser: user.currentUser,
  // loading: loading.models.product,
}))
@Form.create()
class Product extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    getcardModalVisible: false,
    stepFormValues: {},
    categorys: [],
    categorytinys: [],
    units: [],
    supporters: [],
    abbr: '',
    category: '',
    drawerVisible: false,
    currentRecord: {},
    // loading: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;

    this.fetchList();

    dispatch({
      type: 'product/fetchSupporterOption',
    }).then(res => {
      if (res.code === 200) {
        this.setState({
          supporters: res.data,
        });
      }
    });

    dispatch({
      type: 'product/fetchTypeOption',
    }).then(res => {
      if (res.code === 200) {
        this.setState({
          units: res.data,
        });
      }
    });
  }

  // 查询一级分类
  handleFirstClassify = value => {
    const { dispatch } = this.props;
    dispatch({
      type: 'product/fetchCategoryOption',
      payload: { abbr: value },
    }).then(res => {
      if (res.code === 200) {
        this.setState({
          categorys: res.data,
        });
      }
    });
  };

  // 查询二级分类
  // 发送参数category 查询二级分类
  handleSecondClassify = (id, value) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'product/fetchCategoryTinyOption',
      payload: { abbr: value, category: id },
    }).then(res => {
      if (res.code === 200) {
        this.setState({
          categorytinys: res.data,
        });
      }
    });
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

  content = index => (
    <div>
      <Input placeholder="请输入产品名称" />
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
    dispatch({ type: 'product/fetch', payload: param });
  };

  // 分页查询
  handleTableChange = (pagination, filters, sorter) => {
    const { abbr, category } = this.state;
    const param = { pagination: pagination.current };
    if (sorter.columnKey === 'price') {
      param.sort = `price ${sorter.order === 'descend' ? 'desc' : 'asc'}`;
    }
    if (abbr) param.abbr = abbr;
    if (category) param.category = category;
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

  handleGetModalVisible = (flag, record) => {
    this.setState({
      getcardModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  // 新增产品
  handleAdd = fields => {
    const {
      dispatch,
      product: { pagination },
    } = this.props;
    dispatch({
      type: 'product/add',
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
      product: { pagination },
    } = this.props;
    dispatch({
      type: 'product/update',
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

  handleAddcard = fields => {
    const {
      dispatch,
      product: { pagination },
    } = this.props;
    dispatch({
      type: 'card/add',
      payload: {
        ...fields,
      },
      callback: () => {
        this.fetchList({ pagination: pagination.current });
        message.success('开卡成功');
        this.handleGetModalVisible();
      },
    });
  };

  handleDelete = fields => {
    const {
      dispatch,
      product: { pagination },
    } = this.props;
    dispatch({
      type: 'product/update',
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

  handleEdit(e, index) {
    e.preventDefault();
    const {
      form: { getFieldValue, resetFields },
      product: { list },
      dispatch,
    } = this.props;
    const name = getFieldValue('productName');
    // console.log(name, index);
    const obj = list[index];
    obj.name = name;
    obj.category = obj.category ? obj.category.id : null;
    dispatch({
      type: 'product/update',
      payload: obj,
      callback() {
        message.success('产品名称更新成功');
      },
    });
    // 重置输入框状态
    resetFields();
  }

  render() {
    const {
      product: { list, pagination },
      dispatch,
      currentUser,
    } = this.props;
    const {
      modalVisible,
      updateModalVisible,
      getcardModalVisible,
      stepFormValues,
      categorys,
      units,
      supporters,
      drawerVisible,
      categorytinys,
      currentRecord,
    } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      handleFirstClassify: this.handleFirstClassify,
      handleSecondClassify: this.handleSecondClassify,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
      handleAddcard: this.handleAddcard,
      handleGetModalVisible: this.handleGetModalVisible,
      handleFirstClassify: this.handleFirstClassify,
      handleSecondClassify: this.handleSecondClassify,
    };
    const paginationProps = {
      // showSizeChanger: true,
      // showQuickJumper: true,
      ...pagination,
    };

    const columns = [
      {
        title: '存货编码',
        dataIndex: 'barsn',
        width: 100,
        key: 'barsn',
      },
      {
        title: '图片',
        dataIndex: 'cover',
        width: 200,
        key: 'cover',
        render: cover =>
          cover.length === 0 ? (
            <div style={{ width: 80, height: 80, lineHeight: 80 }} />
          ) : (
            <Zmage
              src={cover[0]}
              style={{ display: 'inline-block', width: 80, height: 80 }}
              alt=""
            />
          ),
      },
      {
        title: '存货名称',
        dataIndex: 'name',
        width: 150,
        key: 'name',
      },
      {
        title: '规格',
        dataIndex: 'shape',
        width: 150,
        key: 'shape',
      },
      {
        title: '库存数量',
        dataIndex: 'num',
        width: 150,
        key: 'num',
      },
      {
        title: '计量单位',
        dataIndex: 'unit',
        width: 150,
        key: 'unit',
        render: unit => <span>{unit ? unit.name : '无'}</span>,
      },
      {
        title: '包装(箱)',
        dataIndex: 'pack',
        width: 150,
        key: 'pack',
      },

      {
        title: '供应商',
        dataIndex: 'supporter',
        width: 200,
        key: 'supporter',
        render: supporter => <span>{supporter ? supporter.name : '无'}</span>,
        // render: (text, record) => (
        //   <div>
        //     {record.supporter.map(element => (
        //       <p style={{ margin: 0 }} key={element.name}>
        //         {element.name}
        //       </p>
        //     ))}
        //   </div>
        // ),
      },

      {
        title: '分类',
        dataIndex: 'category',
        width: 150,
        key: 'category',
        render: category => <span>{category ? category.name : '无'}</span>,
      },

      // {
      //   title: '库存数量',
      //   width: 150,
      //   dataIndex: 'num',
      //   key: 'num',
      //   sorter: true,
      // },
      {
        title: '最新成本',
        width: 150,
        dataIndex: 'price',
        key: 'price',
        sorter: true,
      },
      {
        title: '生产企业',
        width: 150,
        dataIndex: 'company',
        key: 'company',
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
            <a onClick={() => this.showDrawer(record)}>工序列表</a>
            <Divider type="vertical" />

            <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a>

            <Divider type="vertical" />
            <a onClick={() => this.handleGetModalVisible(true, record)}>开卡</a>
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
              <Select
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
              </Select>
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
          <CreateProduct
            {...parentMethods}
            modalVisible={modalVisible}
            categorys={categorys}
            categorytinys={categorytinys}
            units={units}
            supporters={supporters}
            dispatch={dispatch}
          />
        )}
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateProduct
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
            categorys={categorys}
            categorytinys={categorytinys}
            units={units}
            supporters={supporters}
            dispatch={dispatch}
          />
        ) : null}

        {stepFormValues && Object.keys(stepFormValues).length ? (
          <GetCard
            {...updateMethods}
            getcardModalVisible={getcardModalVisible}
            values={stepFormValues}
            categorys={categorys}
            units={units}
            supporters={supporters}
            dispatch={dispatch}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default Product;
