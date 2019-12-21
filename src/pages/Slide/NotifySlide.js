import React, { PureComponent } from 'react';
import { Form, Input, Drawer, Tabs, Divider, Row, Col, Icon } from 'antd';

const FormItem = Form.Item;
const { TabPane } = Tabs;

@Form.create()
export default class NotifySlide extends PureComponent {
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
        title="通知详情"
        placement="right"
        destroyOnClose
        closable={false}
        onClose={onClose}
        visible={visible}
      >
        <Row>
          <Col span={8}>
            <div style={colClass}>
              <span style={spanClass}>di:</span>
              <span style={{ color: '#333' }}> {formRow.id}</span>
            </div>
            <div style={colClass}>
              <span style={spanClass}>x:</span>
              <span style={{ color: '#333' }}> {formRow.supporter}</span>
            </div>
          </Col>

          <Col span={8}>
            <div style={colClass}>
              <span style={spanClass}>x:</span>
              <span style={{ color: '#333' }}>{formRow.money}</span>
            </div>
            <div style={colClass}>
              <span style={spanClass}>x:</span>
              <span style={{ color: '#333' }}>{formRow.extra} </span>
            </div>
          </Col>
          <Col span={8}>
            <div style={colClass}>
              <span style={spanClass}>x:</span>
              <span style={{ color: '#333' }}> {formRow.ctime}</span>
            </div>
            <div style={colClass}>
              <span style={spanClass}>x:</span>
              <span style={{ color: '#333' }}> {formRow.extra}</span>
            </div>
          </Col>
        </Row>
        <Divider style={{ marginTop: 10, marginBottom: 0 }} />
        <Tabs defaultActiveKey="1" onChange={this.handleTabChange}>
          <TabPane tab="信息详情" key="1">
            <img src={formRow.bill} alt="" />
          </TabPane>
        </Tabs>
        <Divider style={{ marginTop: 20, marginBottom: 20 }} />
        <Row>
          <Col span={8}>
            <div style={colClass}>
              <span style={spanClass}>备注:</span>
              <span style={{ color: '#333' }}> {formRow.extra}</span>
            </div>
            <div style={colClass}>
              <span style={spanClass}>x:</span>
              <span style={{ color: '#333' }}> {formRow.ordate}</span>
            </div>
          </Col>
        </Row>
      </Drawer>
    );
  }
}
