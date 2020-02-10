import React, { Component, Fragment } from 'react';

import { connect } from 'dva';
import {
  Card,
  Form,
  Table,
  Button,
  Divider,
  Popconfirm,
  Modal,
  AutoComplete,
  InputNumber,
  Icon,
  message,
  Select,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import TableInputSearch from '@/components/common/TableInputSearch';
// eslint-disable-next-line no-unused-vars
import CreateSupporter from './Create';
import UpdateSupporter from './Update';
import styles from './index.less';
// import ExamineModal from '../../Slide/ExamineModal';
import Slide from '../../Slide/SupporterSlide';

const { Option } = Select;

@connect(({ settle }) => ({
  settle,
  // loading: loading.models.product,
}))
@Form.create()
class Settle extends Component {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    stepFormValues: {},
    categorys: [],
    drawerVisible: false,
    currentRecord: {},
    staffDataSource: [],
    searchStaffData: [],
    cardDataSource: [],
    searchCardData: [],
    totalStaffSource: [],
    procedureDataList: [],
    cardData: {},
    cardInfoValue: '',
    cardListSource: [
      {
        index: 1,
        price: '',
        qualifiedNum: 0,
        staff: '',
        procedure: '',
        staffValue: '',
      },
    ],
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

  // 查询询盘列表
  fetchList = (params = {}) => {
    const { dispatch } = this.props;
    dispatch({ type: 'settle/fetch', payload: params });
  };

  // 新增
  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'settle/add',
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
      type: 'settle/update',
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
    dispatch({ type: 'settle/update', payload: { id, ...values } });
  };

  // 生成合同
  contractHandler = values => {
    const { dispatch } = this.props;
    dispatch({ type: 'settle/createContractorders', payload: { ...values } });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  // 审核通道
  examineHandler = (id, fields) => {
    const { dispatch } = this.props;
    dispatch({ type: 'settle/update', payload: { id, ...fields } });
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
    dispatch({ type: 'settle/update', payload: { id: fields.id, status: 2 } });
  };

  onCardSearch = value => {
    const { dispatch } = this.props;
    dispatch({
      type: 'card/fetchOption',
      payload: {
        abbr: value,
      },
    }).then(result => {
      console.log(result);
      this.setState({
        cardDataSource: result.data.map(item => item.sn),
        searchCardData: result.data,
      });
    });
  };

  staffSearch = value => {
    const { dispatch } = this.props;
    const { totalStaffSource } = this.state;
    dispatch({
      type: 'employee/fetchOption',
      payload: {
        abbr: value,
      },
    }).then(result => {
      totalStaffSource.push(...result.data);
      this.setState({
        staffDataSource: result.data.map(item => item.name),
        totalStaffSource,
        searchStaffData: result.data,
      });
    });
  };

  onStaffChange = (value, index) => {
    const { cardListSource } = this.state;
    cardListSource[index].staffValue = value;
  };

  selectStaff = (value, index) => {
    const { cardListSource, searchStaffData } = this.state;
    let nameSource = '';
    searchStaffData.forEach(item => {
      if (item.name === value) {
        nameSource = item;
      }
    });
    cardListSource[index].staff = nameSource;
    this.setState({ cardListSource });
  };

  selectProcedure = (value, index) => {
    const { procedureDataList, cardListSource } = this.state;
    let procedureSource = '';
    procedureDataList.forEach(item => {
      if (item.id === value) procedureSource = item;
    });
    cardListSource[index].procedure = procedureSource;
    this.setState({ cardListSource });
  };

  cardSelect = value => {
    const { searchCardData } = this.state;
    searchCardData.forEach(item => {
      if (item.sn === value) {
        this.setState({ cardData: item });
      }
    });
    this.getProcedureList();
  };

  getProcedureList = () => {
    const { cardData } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'procedure/fetchOption',
      payload: {
        product: cardData.product,
      },
    }).then(result => {
      this.setState({
        procedureDataList: result.data,
      });
    });
  };

  addCardList = () => {
    const { cardListSource } = this.state;
    cardListSource.push({
      index: cardListSource.length + 1,
      price: '',
      qualifiedNum: 0,
      staff: '',
      procedure: '',
      staffValue: '',
    });
    this.setState({ cardListSource });
  };

  // eslint-disable-next-line consistent-return
  removeCardList = index => {
    const { cardListSource } = this.state;
    if (cardListSource.length <= 1) return message.info('必须存在操作行');
    cardListSource.splice(index, 1);
    cardListSource.map((item, i) => {
      // eslint-disable-next-line no-param-reassign
      if (i >= index) item.index = Number(item.index) - 1;
      return item;
    });
    this.setState({ cardListSource });
  };

  getQualifiedNum = (value, index) => {
    const { cardListSource } = this.state;
    cardListSource[index].qualifiedNum = value;
    this.setState({ cardListSource });
  };

  modalVisibleCancel = () => {
    this.setState({
      modalVisible: false,
    });
  };

  cardInfoChange = value => {
    this.setState({
      cardInfoValue: value,
    });
  };

  // eslint-disable-next-line consistent-return
  workSubmit = () => {
    const { dispatch } = this.props;
    const { cardListSource, totalStaffSource, cardData } = this.state;
    if (
      !cardListSource.every(item => item.procedure && item.staff && item.qualifiedNum) ||
      !cardListSource.every(item => totalStaffSource.some(less => less.name === item.staffValue))
    )
      return message.info('还有必填项未填');
    const params = cardListSource.map(item => ({
      procedure: item.procedure && item.procedure.id,
      employee: item.staff && item.staff.id,
      price: item.procedure && item.procedure.price,
      num: item.qualifiedNum,
      total: Number(item.procedure && item.procedure.price) * Number(item.qualifiedNum),
    }));
    dispatch({
      type: 'settle/add',
      payload: {
        des: params,
        card: cardData.id,
      },
    }).then(result => {
      if (result.code === 200) {
        message.success('添加成功');
        this.setState({
          staffDataSource: [],
          searchStaffData: [],
          cardDataSource: [],
          searchCardData: [],
          procedureDataList: [],
          cardInfoValue: '',
          cardData: {},
          cardListSource: [
            {
              index: 1,
              price: '',
              qualifiedNum: 0,
              staff: '',
              procedure: '',
              staffValue: '',
            },
          ],
          modalVisible: false,
        });
      }
    });
  };

  render() {
    const {
      settle: { list, pagination },
      dispatch,
    } = this.props;

    const {
      modalVisible,
      updateModalVisible,
      stepFormValues,
      categorys,
      drawerVisible,
      currentRecord,
      cardDataSource,
      cardData,
      cardListSource,
      staffDataSource,
      procedureDataList,
      cardInfoValue,
      totalStaffSource,
    } = this.state;

    // const parentMethods = {
    //   handleAdd: this.handleAdd,
    //   handleModalVisible: this.handleModalVisible,
    // };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };

    const paginationProps = { ...pagination };

    const numTotal = cardListSource.reduce((preTotal, item) => {
      if (item.qualifiedNum && item.procedure) {
        // eslint-disable-next-line no-param-reassign
        preTotal += Number(item.procedure && item.procedure.price) * Number(item.qualifiedNum);
      }
      return preTotal;
    }, 0);
    const columns = [
      {
        title: '流通卡号',
        width: 150,
        dataIndex: 'card.sn',
        key: 'card.sn',
      },
      {
        title: '产品名称',
        width: 250,
        dataIndex: 'product.name',
        key: 'product.name',
      },
      {
        title: '员工',
        width: 150,
        dataIndex: 'employee.name',
        key: 'employee.name',
      },
      {
        title: '工序名称',
        width: 150,
        dataIndex: 'procedure.name',
        key: 'procedure.name',
      },
      {
        title: '工序单价',
        width: 150,
        dataIndex: 'price',
        key: 'price',
      },
      {
        title: '数量',
        width: 150,
        dataIndex: 'num',
        key: 'num',
      },
      {
        title: '合计',
        width: 150,
        dataIndex: 'total',
        key: 'total',
      },
      {
        title: '备注',
        width: 150,
        dataIndex: 'extra',
        key: 'extra',
      },
      // {
      //   title: '备案',
      //   dataIndex: 'beian',
      //   width: 150,
      //   key: 'beian',
      //   render: beian =>
      //     beian.length === 0 ? (
      //       <div style={{ width: 80, height: 80, lineHeight: 80 }} />
      //     ) : (
      //       <Zmage src={beian} style={{ display: 'inline-block', width: 80, height: 80 }} alt="" />
      //     ),
      // },
      // {
      //   title: '许可证',
      //   dataIndex: 'license',
      //   width: 150,
      //   key: 'license',
      //   render: license =>
      //     license.length === 0 ? (
      //       <div style={{ width: 80, height: 80, lineHeight: 80 }} />
      //     ) : (
      //       <Zmage
      //         src={license}
      //         style={{ display: 'inline-block', width: 80, height: 80 }}
      //         alt=""
      //       />
      //     ),
      // },
      {
        title: '添加人',
        width: 100,
        dataIndex: 'cuser.name',
        key: 'cuser.name',
      },
      // {
      //   title: '资质审核',
      //   width: 150,
      //   dataIndex: 'state',
      //   key: 'state',
      //   render: text => (
      //     <Icon
      //       type="check-circle"
      //       theme="filled"
      //       style={{ color: text === 1 ? '#36ab60' : '#bfbfbf' }}
      //     />
      //   ),
      // },

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

    const cardColumns = [
      {
        title: '序号',
        width: 50,
        dataIndex: 'index',
        key: 'index',
      },
      {
        title: '工序',
        width: 200,
        dataIndex: 'procedure',
        key: 'procedure',
        render: (text, record, index) => (
          <div>
            {text ? (
              <Icon type="check" style={{ color: '#1DA57A' }} />
            ) : (
              <Icon type="close" style={{ color: 'red' }} />
            )}
            <Select
              style={{ width: 120, marginLeft: 10 }}
              loading
              onSelect={value => this.selectProcedure(value, index)}
              value={text.id}
            >
              {procedureDataList.map(item => (
                <Option value={item.id}>{item.name}</Option>
              ))}
            </Select>
          </div>
        ),
      },
      {
        title: '单价',
        width: 100,
        key: 'price',
        render: (text, record) => {
          if (record.procedure) return <div>{record.procedure && record.procedure.price}</div>;
          return null;
        },
      },
      {
        title: '员工',
        width: 200,
        dataIndex: 'staffValue',
        key: 'staffValue',
        render: (text, record, index) => (
          <div>
            {totalStaffSource.some(item => item.name === text) ? (
              <Icon type="check" style={{ color: '#1DA57A' }} />
            ) : (
              <Icon type="close" style={{ color: 'red' }} />
            )}
            <AutoComplete
              dataSource={staffDataSource}
              style={{ width: 150, marginLeft: 10 }}
              value={text}
              onChange={value => this.onStaffChange(value, index)}
              onSelect={value => this.selectStaff(value, index)}
              onSearch={this.staffSearch}
              placeholder="员工首字母搜索"
            />
          </div>
        ),
      },
      {
        title: '合格数',
        width: 200,
        dataIndex: 'qualifiedNum',
        key: 'qualifiedNum',
        render: (text, record, index) => (
          <div>
            {text ? (
              <Icon type="check" style={{ color: '#1DA57A' }} />
            ) : (
              <Icon type="close" style={{ color: 'red' }} />
            )}
            <InputNumber
              style={{ marginLeft: 10 }}
              defaultValue={0}
              min={0}
              value={text}
              onChange={value => this.getQualifiedNum(value, index)}
            />
          </div>
        ),
      },
      {
        title: '合计',
        width: 100,
        key: 'total',
        render: (text, record) => {
          if (record.procedure) {
            return Number(record.procedure && record.procedure.price) * Number(record.qualifiedNum);
          }
          return null;
        },
      },
      {
        title: '操作',
        render: (text, record, index) => (
          <div>
            <Button
              type="danger"
              shape="circle"
              icon="delete"
              onClick={() => this.removeCardList(index)}
            />
          </div>
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
              scroll={{ x: 1500, y: 540 }}
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

        {/* {modalVisible && (
          <CreateSupporter
            {...parentMethods}
            modalVisible={modalVisible}
            categorys={categorys}
            dispatch={dispatch}
          />
        )} */}
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateSupporter
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
            categorys={categorys}
            dispatch={dispatch}
          />
        ) : null}
        <Modal
          title="工序结算"
          visible={modalVisible}
          width={1000}
          onOk={this.handleOk}
          onCancel={this.modalVisibleCancel}
          footer={[
            <Button key="back" onClick={this.modalVisibleCancel}>
              取消
            </Button>,
            <Button key="submit" type="primary" onClick={this.workSubmit}>
              提交
            </Button>,
          ]}
        >
          <div style={{ height: 50, display: 'flex', alignItems: 'center' }}>
            <div>流通卡号</div>
            <div>
              <AutoComplete
                dataSource={cardDataSource}
                style={{ width: 200, marginLeft: 20 }}
                onSelect={this.cardSelect}
                value={cardInfoValue}
                onChange={this.cardInfoChange}
                onSearch={this.onCardSearch}
                placeholder="流通卡号搜索"
              />
            </div>
          </div>
          <div
            style={{
              height: 50,
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', flex: 1 }}>
              <div>流通卡号</div>
              <div style={{ marginLeft: 20 }}>{cardData.sn}</div>
            </div>
            <div style={{ display: 'flex', flex: 1 }}>
              <div>产品名称</div>
              <div style={{ marginLeft: 20 }}>{}</div>
            </div>
            <div style={{ display: 'flex', flex: 1 }}>
              <div>开卡日期</div>
              <div style={{ marginLeft: 20 }}>{cardData.create_time}</div>
            </div>
          </div>
          <Divider />
          <div>
            <Table
              rowKey="id"
              size="middle"
              columns={cardColumns}
              dataSource={cardListSource}
              pagination={false}
              onChange={this.handleTableChange}
              footer={() => (
                <div>
                  <Button type="primary" shape="circle" icon="plus" onClick={this.addCardList} />
                </div>
              )}
            />
          </div>
          <div
            style={{
              display: 'flex',
              height: 50,
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
            }}
          >
            合计: {numTotal}
          </div>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default Settle;
