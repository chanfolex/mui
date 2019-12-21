import React, { PureComponent } from 'react';
import { Form, Input, Drawer, Tabs, Divider, Row, Col, Table, Icon, message, Button } from 'antd';

const FormItem = Form.Item;
const { TabPane } = Tabs;

@Form.create()
export default class PurchaseSlide extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dataList: [],
      pagination: {},
      loading: false,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = (params = {}) => {
    const { dispatch, formRow } = this.props;

    this.setState({ loading: true });
    dispatch({
      type: 'porder/fetchItems',
      payload: {
        ...params,
        sn: formRow.sn,
        posn: formRow.posn,
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

  handleDelete = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'customer/updateInquiry',
      payload: {
        id: fields.id,
        status: 2,
      },
      callback: res => {
        if (res.code === 200) {
          const { pagination } = this.state;
          this.fetchData({ pagination: pagination.current });
          message.success('删除成功');
        }
      },
    });
  };

  handleTabChange = () => {
    // console.log(key);
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
    this.fetchData(param);
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (err) return;
      this.fetchData({ sn: values.abbr });
    });
  };

  emitEmpty = () => {
    const { form } = this.props;
    form.setFieldsValue({
      abbr: '',
    });
    this.fetchData();
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
        title: '销售合同',
        dataIndex: 'csn',
        key: 'csn',
        width: 100,
      },
      {
        title: '图片',
        dataIndex: 'product.cover',
        key: 'product.cover',
        width: 100,
        render: record => <img src={record} width="50px" height="50px" alt="" />,
      },
      {
        title: '型号',
        dataIndex: 'product.shape',
        key: 'product.shape',
        width: 100,
      },
      {
        title: '名称',
        dataIndex: 'product.name',
        key: 'product.name',
        width: 200,
      },
      {
        title: '单价',
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
        title: '运费',
        dataIndex: 'express',
        key: 'express',
        width: 100,
      },
      {
        title: '合计',
        dataIndex: 'total',
        key: 'total',
        width: 200,
      },

      {
        title: '备注',
        dataIndex: 'extra',
        key: 'extra',
        width: 200,
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
        title="合同详情"
        placement="right"
        destroyOnClose
        closable={false}
        onClose={onClose}
        visible={visible}
      >
        <Row>
          <Col span={8}>
            <div style={colClass}>
              <span style={spanClass}>合同编号:</span>
              <span style={{ color: '#333' }}> {formRow.sn}</span>
            </div>
            <div style={colClass}>
              <span style={spanClass}>供应商:</span>
              <span style={{ color: '#333' }}>
                {' '}
                {formRow.supporter ? formRow.supporter.name : ''}
              </span>
            </div>
          </Col>
          <Col span={8}>
            <div style={colClass}>
              <span style={spanClass}>合同日期:</span>
              <span style={{ color: '#333' }}> {formRow.ctime}</span>
            </div>
            <div style={colClass}>
              <span style={spanClass}>签署日期:</span>
              <span style={{ color: '#333' }}> {formRow.stime}</span>
            </div>
          </Col>
          <Col span={8}>
            <div style={colClass}>
              <span style={spanClass}>类型:</span>
              <span style={{ color: '#333' }}>
                {' '}
                {formRow.territory ? formRow.territory.name : ''}
              </span>
            </div>
            <div style={colClass}>
              <span style={spanClass}>合同导出:</span>
              <span style={{ color: '#333' }}> {formRow.grade ? formRow.grade.name : ''}</span>
              <Button type="primary" shape="round" icon="download" size="large" />
            </div>
          </Col>
        </Row>
        <Divider style={{ marginTop: 10, marginBottom: 0 }} />
        <Tabs defaultActiveKey="1" onChange={this.handleTabChange}>
          <TabPane tab="产品列表" key="1">
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
          <Col span={8}>
            <div style={colClass}>
              <span style={spanClass}>包装:</span>
              <span style={{ color: '#333' }}> {formRow.packing}</span>
            </div>
            <div style={colClass}>
              <span style={spanClass}>发货日期:</span>
              <span style={{ color: '#333' }}> {formRow.deliver}</span>
            </div>
          </Col>
          <Col span={8}>
            <div style={colClass}>
              <span style={spanClass}>交货地:</span>
              <span style={{ color: '#333' }}> {formRow.location}</span>
            </div>
            <div style={colClass}>
              <span style={spanClass}>付款:</span>
              <span style={{ color: '#333' }}> {formRow.payment}</span>
            </div>
          </Col>
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
