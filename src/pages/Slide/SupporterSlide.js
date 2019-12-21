import React, { PureComponent } from 'react';
import { Form, Input, Drawer, Tabs, Divider, Row, Col, Icon } from 'antd';

const FormItem = Form.Item;
const { TabPane } = Tabs;

@Form.create()
export default class SupporterSlide extends PureComponent {
  componentDidMount() {
    this.fetchData();
  }

  fetchData = (params = {}) => {
    const { dispatch, formRow } = this.props;

    dispatch({
      type: 'notify/fetchDataById',
      payload: {
        ...params,
        id: formRow.id,
      },
    });
  };

  handleTabChange = () => {
    // console.log(key);
  };

  // eslint-disable-next-line no-unused-vars

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

    const colClass = {
      lineHeight: 1,
      marginBottom: '10px',
    };
    const spanClass = {
      display: 'inline-block',
      minWidth: '40px',
    };

    return (
      <Drawer
        width="50%"
        title="客户详情"
        placement="right"
        destroyOnClose
        closable={false}
        onClose={onClose}
        visible={visible}
      >
        <Row>
          <Col span={8}>
            <div style={colClass}>
              <span style={spanClass}>客户名称:</span>
              <span style={{ color: '#333' }}> {formRow.name}</span>
            </div>
            <div style={colClass}>
              <span style={spanClass}>类型:</span>
              <span style={{ color: '#333' }}> {formRow.type}</span>
            </div>

            <div style={colClass}>
              <span style={spanClass}>对公银行:</span>
              <span style={{ color: '#333' }}> {formRow.bank}</span>
            </div>
            <div style={colClass}>
              <span style={spanClass}>对公账号:</span>
              <span style={{ color: '#333' }}> {formRow.account}</span>
            </div>
          </Col>

          <Col span={8}>
            <div style={colClass}>
              <span style={spanClass}>联系人:</span>
              <span style={{ color: '#333' }}>{formRow.linkman}</span>
            </div>
            <div style={colClass}>
              <span style={spanClass}>联系地址:</span>
              <span style={{ color: '#333' }}>{formRow.address} </span>
            </div>
            <div style={colClass}>
              <span style={spanClass}>经营范围:</span>
              <span style={{ color: '#333' }}> {formRow.production}</span>
            </div>
            <div style={colClass}>
              <span style={spanClass}>备注:</span>
              <span style={{ color: '#333' }}> {formRow.account}</span>
            </div>
          </Col>
          <Col span={8}>
            <div style={colClass}>
              <span style={spanClass}>法人代表:</span>
              <span style={{ color: '#333' }}> {formRow.linkman}</span>
            </div>
            <div style={colClass}>
              <span style={spanClass}>联系电话:</span>
              <span style={{ color: '#333' }}> {formRow.tel}</span>
            </div>
          </Col>
        </Row>
        <Divider style={{ marginTop: 10, marginBottom: 0 }} />
        <Tabs defaultActiveKey="1" onChange={this.handleTabChange}>
          <TabPane tab="证件详情" key="1">
            <img src={formRow.cover} alt="" width="200" height="300" />
            <img src={formRow.beian} alt="" width="200" height="300" />
            <img src={formRow.license} alt="" width="200" height="300" />
          </TabPane>
        </Tabs>
        <Divider style={{ marginTop: 20, marginBottom: 20 }} />
        <Row>
          <Col span={8}>
            <div style={colClass}>
              <span style={spanClass}>添加人:</span>
              <span style={{ color: '#333' }}> {formRow.cuser.nickname}</span>
            </div>
            <div style={colClass}>
              <span style={spanClass}>创建时间:</span>
              <span style={{ color: '#333' }}> {formRow.ctime}</span>
            </div>
          </Col>
        </Row>
      </Drawer>
    );
  }
}
