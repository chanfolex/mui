import React, { Component } from 'react';

import { Row, Col, Form, Input, Select, Modal, Tabs } from 'antd';

import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

@Form.create()
export default class CreateProcedure extends Component {
  handleUploadChange = ({ fileList }) => {
    console.log('cc');
    return fileList.map(file => ({
      status: file.status,
      uid: file.uid,
      url: file.response ? file.response.data : file.url,
    }));
  };

  render() {
    const { modalVisible, form, handleAdd, handleModalVisible, categorys } = this.props;

    const okHandle = () => {
      form.validateFields((errors, values) => {
        if (errors) return;

        const param = {
          name: values.name,
          price: values.price,
          position: values.position,
          extra: values.extra,
          // beian: values.beian ? values.beian[0].url : '',
          // license: values.license ? values.license[0].url : '',
        };
        // param.des = keys.map((k, index) => ({
        //   bank: values[`bank${index}`],
        //   account: values[`account${index}`],
        //   name: values[`name${index}`],
        // }));

        handleAdd(param);
        console.log(param);
        form.resetFields();
      });
    };
    const onTabChange = () => {};

    return (
      <Modal
        width={800}
        className={styles.formRow}
        destroyOnClose
        title="新建工序"
        visible={modalVisible}
        maskClosable={false}
        onOk={okHandle}
        onCancel={() => handleModalVisible()}
      >
        <Tabs defaultActiveKey="1" onChange={onTabChange}>
          <TabPane tab="基础信息" key="1">
            <Row gutter={8}>
              <Col span={10}>
                <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="序号" hasFeedback>
                  {form.getFieldDecorator('position', {})(
                    <Input placeholder="请输入序号" size="large" />
                  )}
                </FormItem>

                <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="名称" hasFeedback>
                  {form.getFieldDecorator('name', {
                    rules: [{ required: true, whitespace: true, message: '名称是必填项' }],
                  })(<Input placeholder="请输入名称" size="large" />)}
                </FormItem>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} label="分类">
                  {form.getFieldDecorator('category', {
                    rules: [{ required: true, message: '分类是必填项' }],
                    // initialValue: formVals.category,
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
                </FormItem>

                <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="单价" hasFeedback>
                  {form.getFieldDecorator('price', {})(
                    <Input placeholder="请输入单价" size="large" />
                  )}
                </FormItem>
                <FormItem
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  label="联系人"
                  hasFeedback
                >
                  {form.getFieldDecorator('linkman', {})(
                    <Input placeholder="请输入联系人" size="large" />
                  )}
                </FormItem>
              </Col>
              <Col span={14}>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} label="备注" hasFeedback>
                  {form.getFieldDecorator('extra', {})(
                    <TextArea placeholder="备注" size="large" />
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
