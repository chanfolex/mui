import React, { Component } from 'react';

import { Row, Col, Form, Input, Modal, Tabs } from 'antd';

import styles from './Index.less';

const FormItem = Form.Item;
// const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

@Form.create()
export default class UpdateEmployee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formVals: {
        id: props.values.id,
        name: props.values.name,
        address: props.values.address,
        idcard: props.values.idcard,
      },
    };
  }

  componentDidMount() {
    // const { form } = this.props;
    // const { formVals } = this.state;
  }

  handleUploadChange = ({ fileList }) =>
    // file
    fileList.map(file => ({
      status: file.status,
      uid: file.uid,
      url: file.response ? file.response.data : file.url,
    }));

  render() {
    const { formVals } = this.state;
    const { updateModalVisible, form, handleUpdate, handleUpdateModalVisible } = this.props;

    const okHandle = () => {
      form.validateFields((errors, values) => {
        if (errors) return;
         values.id = formVals.id;
        handleUpdate(values);
        form.resetFields();
      });
    };
    const onTabChange = () => {};

    return (
      <Modal
        width={800}
        className={styles.formRow}
        destroyOnClose
        title="编辑"
        visible={updateModalVisible}
        maskClosable={false}
        onOk={okHandle}
        onCancel={() => handleUpdateModalVisible()}
      >
        <Tabs defaultActiveKey="1" onChange={onTabChange}>
          <TabPane tab="基础信息" key="1">
            <Row gutter={8}>
              <Col span={10}>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} label="名称" hasFeedback>
                  {form.getFieldDecorator('name', {
                    rules: [{ required: true, whitespace: true, message: '名称是必填项' }],
                    initialValue: formVals.name,
                  })(<Input placeholder="请输入名称" size="large" />)}
                </FormItem>

                <FormItem
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 18 }}
                  label="地址"
                  hasFeedback
                >
                  {form.getFieldDecorator('address', {
                    rules: [{ required: false, whitespace: true, message: '名称是必填项' }],
                    initialValue: formVals.address,
                  })(<Input placeholder="请输入地址" size="large" />)}
                </FormItem>


                <FormItem
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 18 }}
                  label="身份证"
                  hasFeedback
                >
                  {form.getFieldDecorator('idcard', {
                    rules: [{ required: false, whitespace: true, message: '名称是必填项' }],
                    initialValue: formVals.idcard,
                  })(<Input placeholder="请输入身份证" size="large" />)}
                </FormItem>



                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} label="备注">
                  {form.getFieldDecorator('intro', {
                    initialValue: formVals.intro,
                  })(<TextArea placeholder="请输入备注" size="large" />)}
                </FormItem>


              </Col>
            </Row>
          </TabPane>
          {/* <TabPane tab="供应商信息" key="2">
            <div className="supporter">
              {supporters.length > 0 &&
                supporters.map((el, index) => (
                  <div key={el.id} className={styles.supporterRow}>
                    <div className={styles.supporterText}>
                      <span className={styles.supporterNum}>{index + 1}</span>
                      <span>{el.name}</span>
                      <Icon
                        type="delete"
                        onClick={() => this.removeSupporter(index)}
                        style={{
                          fontSize: 18,
                          position: 'absolute',
                          right: 10,
                          top: 10,
                          cursor: 'pointer',
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>
            <div style={{ paddingTop: 20, paddingLeft: 40 }}>
              {isAdd ? (
                <Select
                  size="large"
                  showSearch
                  labelInValue
                  allowClear
                  // value={this.state.value}
                  placeholder="输入供应商拼音首字母进行搜索"
                  style={{ width: '100%' }}
                  defaultActiveFirstOption={false}
                  showArrow={false}
                  filterOption={false}
                  onSearch={this.handleSearch}
                  onChange={this.handleChange}
                  notFoundContent={spinState ? <Spin /> : '暂无数据'}
                >
                  {supporterOptions.map(d => (
                    <Option key={d.id} value={d.id}>
                      {d.name}
                    </Option>
                  ))}
                </Select>
              ) : (
                <p>
                  <Button
                    type="primary"
                    shape="circle"
                    size="large"
                    icon="plus"
                    onClick={this.addSupporter}
                  />
                </p>
              )}
            </div>
          </TabPane> */}
        </Tabs>
      </Modal>
    );
  }
}
