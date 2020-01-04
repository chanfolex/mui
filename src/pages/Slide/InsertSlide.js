import React, { PureComponent, Fragment } from 'react';
import { Form, Input, Drawer, Tabs, Divider, Row, Col, Table, Icon } from 'antd';
import EditModal from './EditModal';

const FormItem = Form.Item;
const { TabPane } = Tabs;

@Form.create()
export default class InsertSlide extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dataList: [],
      pagination: {},
      loading: false,
    };
  }

  componentDidMount() {
    this.fetchInquiry();
  }

  fetchInquiry = (params = {}) => {
    const { dispatch, formRow } = this.props;

    this.setState({ loading: true });
    dispatch({
      type: 'contract/fetchInsertItems',
      payload: {
        ...params,
        sn: formRow.sn,
      },
    }).then(res => {
      if (res) {
        const { pagination } = this.state;
        pagination.total = res.data.sum;
        this.setState({
          loading: false,
          dataList: res.data,
          pagination,
        });
      }
    });
  };

  //  // 获取slide数据源头
  // fetchInquiry = (params = {}) => {
  //   const { dispatch, formRow } = this.props;
  //   this.setState({ loading: true });
  //   dispatch({
  //     type: 'customer/fetchInquiry',
  //     payload: {
  //       ...params,
  //       client: formRow.id,
  //     },
  //   }).then(res => {
  //     if (res.code === 200) {
  //       const { pagination } = this.state;
  //       pagination.total = res.data.sum;
  //       this.setState({
  //         loading: false,
  //         inquirys: res.data.list,
  //         pagination,
  //       });
  //     }
  //   });
  // };

  handleTabChange = () => {
    // console.log(key);
  };

  // 询盘编辑
  editHandler = (id, values) => {
    const { dispatch } = this.props;
    dispatch({ type: 'contract/update', payload: { id, ...values } });
  };

  // eslint-disable-next-line no-unused-vars
  handleTableChange = (pagination, filters, sorter) => {
    const { pagination: pagi } = this.state;
    const pager = { ...pagi };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    const param = { pagination: pagination.current };
    this.fetchInquiry(param);
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (err) return;
      this.fetchInquiry({ sn: values.abbr });
    });
  };

  emitEmpty = () => {
    const { form } = this.props;
    form.setFieldsValue({
      abbr: '',
    });
    this.fetchInquiry();
  };

  renderSimpleForm() {
    const { form } = this.props;

    const suffix = form.getFieldValue('abbr') ? (
      <Icon type="close-circle" onClick={this.emitEmpty} />
    ) : null;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <FormItem label="">
          {form.getFieldDecorator('abbr')(
            <Input suffix={suffix} placeholder="请输入sn搜索" autoComplete="off" />
          )}
        </FormItem>
      </Form>
    );
  }

  render() {
    const { visible, onClose, formRow } = this.props;
    const { dataList, pagination, loading } = this.state;

    const windowH = window.innerHeight;
    const colClass = {
      lineHeight: 1,
      marginBottom: '10px',
    };
    const spanClass = {
      display: 'inline-block',
      minWidth: '40px',
    };

    const columns = [
      {
        title: '图片',
        dataIndex: 'product.cover',
        key: 'product.cover',
        width: 100,
        render: record => <img src={record} width="50px" height="50px" alt="" />,
      },
      {
        title: '规格',
        dataIndex: 'product.shape',
        key: 'product.shape',
        width: 100,
      },
      {
        title: '名称',
        dataIndex: 'product.name',
        key: 'product.name',
        width: 100,
      },
      {
        title: '单位',
        dataIndex: 'product.type',
        key: 'product.type',
        width: 100,
      },
      {
        title: '生产企业',
        dataIndex: 'product.company',
        key: 'product.company',
        width: 100,
      },
      {
        title: '批准文号',
        dataIndex: 'product.sn',
        key: 'product.sn',
        width: 100,
      },
      {
        title: '生产日期',
        dataIndex: 'product.start',
        key: 'product.start',
        width: 100,
      },
      {
        title: '有效日期',
        dataIndex: 'product.end',
        key: 'product.end',
        width: 100,
      },
      {
        title: '售价',
        dataIndex: 'price',
        key: 'price',
        width: 100,
      },
      {
        title: '数量',
        dataIndex: 'num',
        key: 'num',
        width: 100,
      },
      {
        title: '合计',
        dataIndex: 'total',
        key: 'total',
        width: 100,
      },

      {
        title: '备注',
        dataIndex: 'extra',
        key: 'extra',
        width: 100,
      },

      {
        title: '操作',
        // width: 250,
        render: (text, record) => (
          <Fragment>
            <EditModal
              record={record}
              // eslint-disable-next-line react/jsx-no-bind
              onOk={this.editHandler.bind(null, record.id)}
            >
              <a>编辑</a>
            </EditModal>
          </Fragment>
        ),
      },

      // {
      //   title: '提交时间',
      //   dataIndex: 'ctime',
      //   key: 'ctime',
      //   render: text => <span>{text || '无'}</span>,
      // },
    ];

    return (
      <Drawer
        width="50%"
        title="出库详情"
        placement="right"
        destroyOnClose
        closable={false}
        onClose={onClose}
        visible={visible}
      >
        <Row>
          <Col span={8}>
            <div style={colClass}>
              <span style={spanClass}>订单编号:</span>
              <span style={{ color: '#333' }}> {formRow.sn}</span>
            </div>
            <div style={colClass}>
              <span style={spanClass}>客户:</span>
              <span style={{ color: '#333' }}>
                {' '}
                {formRow.supporter ? formRow.supporter.name : ''}
              </span>
            </div>
          </Col>
          <Col span={8}>
            <div style={colClass}>
              <span style={spanClass}>入库日期:</span>
              <span style={{ color: '#333' }}> {formRow.ctime}</span>
            </div>
            <div style={colClass}>
              <span style={spanClass}>创建人:</span>
              <span style={{ color: '#333' }}> {formRow.cuser.nickname}</span>
            </div>
          </Col>
          <Col span={8}>
            <div style={colClass}>
              <span style={spanClass}>总金额:</span>
              <span style={{ color: '#333' }}>{formRow.total}</span>
            </div>
            <div style={colClass}>
              <span style={spanClass}>x:</span>
              {/* <span style={{ color: '#333' }}> {formRow.grade ? formRow.grade.name : ''}</span>
              <Button type="primary" shape="round" icon="download" size="large" /> */}
            </div>
          </Col>
        </Row>
        <Divider style={{ marginTop: 10, marginBottom: 0 }} />
        <Tabs defaultActiveKey="1" onChange={this.handleTabChange}>
          <TabPane tab="商品信息" key="1">
            <Table
              rowKey="id"
              size="middle"
              columns={columns}
              dataSource={dataList}
              pagination={pagination}
              loading={loading}
              onChange={this.handleTableChange}
              scroll={{ y: windowH - 360 }}
            />
          </TabPane>
        </Tabs>

        <Row>
          <Col>
            <div style={colClass}>
              <span style={spanClass}>合计:</span>
              <span style={{ color: '#333' }}> {formRow.total}</span>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <div style={colClass}>
              <span style={spanClass}>包装:</span>
              <span style={{ color: '#333' }}> {formRow.packing}</span>
            </div>
            <div style={colClass}>
              <span style={spanClass}>制单人:</span>
              <span style={{ color: '#333' }}> {formRow.delivery}</span>
            </div>
          </Col>
          <Col span={8}>
            <div style={colClass}>
              <span style={spanClass}>审核人:</span>
              <span style={{ color: '#333' }}> {formRow.port_d}</span>
            </div>
            <div style={colClass}>
              <span style={spanClass}>备注:</span>
              <span style={{ color: '#333' }}> {formRow.terms}</span>
            </div>
          </Col>
          {/* <Col span={8}>
            <div style={colClass}>
              <span style={spanClass}>发货港:</span>
              <span style={{ color: '#333' }}> {formRow.port_l}</span>
            </div>
            <div style={colClass}>
              <span style={spanClass}>贸易条款:</span>
              <span style={{ color: '#333' }}> {formRow.trade}</span>
            </div>
          </Col> */}
        </Row>

        {/* {modalVisible && (
          <Detail
            modalVisible={modalVisible}
            handleModalVisible={this.handleModalVisible}
            formRow={currentRow}
            parentRow={formRow}
          />
        )} */}
      </Drawer>
    );
  }
}
