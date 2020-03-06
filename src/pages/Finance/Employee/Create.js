import React, { Component } from 'react';

import { Row, Col, Form, Input, Modal, Tabs } from 'antd';

import styles from './Index.less';

const FormItem = Form.Item;
// const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

@Form.create()
export default class CreateEmployee extends Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    const { modalVisible, form, handleAdd, handleModalVisible } = this.props;

    const okHandle = () => {
      form.validateFields((errors, values) => {
        if (errors) return;
        handleAdd(values);
        form.resetFields();
      });
    };
    const onTabChange = () => {};

    return (
      <Modal
        width={800}
        className={styles.formRow}
        destroyOnClose
        title="新建员工"
        visible={modalVisible}
        maskClosable={false}
        onOk={okHandle}
        onCancel={() => handleModalVisible()}
      >
        <Tabs defaultActiveKey="1" onChange={onTabChange}>
          <TabPane tab="基础信息" key="1">
            <Row gutter={8}>
              <Col span={10}>
                <FormItem
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 18 }}
                  label="员工姓名"
                  hasFeedback
                >
                  {form.getFieldDecorator('name', {
                    rules: [{ required: true, whitespace: true, message: '名称是必填项' }],
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
                  })(<Input placeholder="请输入地址" size="large" />)}
                </FormItem>


                <FormItem
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 18 }}
                  label="身份证"
                  hasFeedback
                >
                  {form.getFieldDecorator('idcrad', {
                    rules: [{ required: false, whitespace: true, message: '名称是必填项' }],
                  })(<Input placeholder="请输入身份证" size="large" />)}
                </FormItem>

                {/* <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} label="分类">
                  {form.getFieldDecorator('category', {
                    rules: [{ required: true, message: '分类是必填项' }],
                  })(
                    <Select
                      allowClear
                      placeholder="请选择分类"
                      style={{ width: '100%' }}
                      size="large"
                    >
                      {categorys.map(el => (
                        <Option key={el.id} value={el.id}>
                          {el.name}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem> */}
              </Col>
              <Col span={14}>
                {/* <FormItem
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 19 }}
                  label="产品图片"
                  extra=""
                >
                  {form.getFieldDecorator('cover', {
                    valuePropName: 'fileList',
                    getValueFromEvent: this.handleUploadChange,
                  })(<UploadFile num={6} />)}
                </FormItem> */}

                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} label="备注">
                  {form.getFieldDecorator('intro', {})(
                    <TextArea placeholder="请输入备注" size="large" />
                  )}
                </FormItem>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Modal>
    );
  }
}
