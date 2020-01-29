import React, { PureComponent } from 'react';
import { Form, Input, Drawer, Tabs, Divider, Row, Col, Table, Icon } from 'antd';

const FormItem = Form.Item;
const { TabPane } = Tabs;

@Form.create()
export default class ProcedureSlide extends PureComponent {
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
      type: 'procedure/fetchItems',
      payload: {
        ...params,
        product: formRow.id,
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
        title: '序号',
        dataIndex: 'position',
        key: 'position',
        width: 100,
      },
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        width: 100,
      },
      {
        title: '单价',
        dataIndex: 'price',
        key: 'price',
        width: 100,
      },

      {
        title: '备注',
        dataIndex: 'extra',
        key: 'extra',
        width: 200,
      },

      {
        title: '提交时间',
        dataIndex: 'ctime',
        key: 'ctime',
        render: text => <span>{text || '无'}</span>,
      },
    ];

    return (
      <Drawer
        width="50%"
        title="库存详情"
        placement="right"
        destroyOnClose
        closable={false}
        onClose={onClose}
        visible={visible}
      >
        <Row>
          <Col span={8}>
            <div style={colClass}>
              <span style={spanClass}>存货名称:</span>
              <span style={{ color: '#333' }}> {formRow.name}</span>
            </div>
            {/* <div style={colClass}>
              <span style={spanClass}>类型:</span>
              <span style={{ color: '#333' }}> {formRow.name}</span>
            </div>

            <div style={colClass}>
              <span style={spanClass}>供应商:</span>
              {/* <span style={{ color: '#333' }}> {formRow.supporter.name}</span> */}
          </Col>

          {/* <Col span={8}>
            <div style={colClass}>
              <span style={spanClass}>规格型号:</span>
              <span style={{ color: '#333' }}>{formRow.product.shape}</span>
            </div>
            <div style={colClass}>
              <span style={spanClass}>计量单位:</span>
              <span style={{ color: '#333' }}>{formRow.product.unit.name} </span>
            </div>
            <div style={colClass}>
              <span style={spanClass}>生产企业:</span>
              <span style={{ color: '#333' }}> {formRow.product.company}</span>
            </div>
            <div style={colClass}>
              <span style={spanClass}>生产许可证:</span>
              <span style={{ color: '#333' }}> {formRow.product.license}</span>
            </div>
          </Col>
          <Col span={8}>
            <div style={colClass}>
              <span style={spanClass}>库存数量:</span>
              <span style={{ color: '#333' }}> {formRow.product.num}</span>
            </div>
            <div style={colClass}>
              <span style={spanClass}>备注:</span>
              <span style={{ color: '#333' }}> {formRow.product.extra}</span>
            </div>
          </Col> */}
        </Row>
        <Divider style={{ marginTop: 10, marginBottom: 0 }} />
        <Tabs defaultActiveKey="1" onChange={this.handleTabChange}>
          <TabPane tab="工序列表" key="1">
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

        {/* <Row>
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
        </Row> */}

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
