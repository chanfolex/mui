import React, { Component } from 'react';

import { Row, Col, Form, Input, Modal, Tabs } from 'antd';

import styles from './product.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const { TabPane } = Tabs;

@Form.create()
export default class GetCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formVals: {
        id: props.values.id,
        name: props.values.name,
        sn: props.values.sn,
      },
    };
  }

  componentDidMount() {
    // const { formVals } = this.state;
  }

  render() {
    const { formVals } = this.state;
    const {
      form,
      handleAddcard,
      getcardModalVisible,
      handleGetModalVisible,
    } = this.props;

    const okHandle = () => {
      form.validateFields((errors, values) => {
        if (errors) return;
        // eslint-disable-next-line no-param-reassign
        // eslint-disable-next-line no-param-reassign
        // eslint-disable-next-line no-param-reassign
        values.product = formVals.id;
        handleAddcard(values);
        form.resetFields();
      });
    };
    const onTabChange = () => {};

    return (
      <Modal
        width={800}
        className={styles.formRow}
        destroyOnClose
        title="开流通卡"
        visible={getcardModalVisible}
        maskClosable={false}
        onOk={okHandle}
        onCancel={() => handleGetModalVisible()}
      >
        <Tabs defaultActiveKey="1" onChange={onTabChange}>
          <TabPane tab="基础信息" key="1">
            <Row gutter={8}>
              <Col span={10}>
                <FormItem
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 18 }}
                  label="存货编码"
                  hasFeedback
                >
                  {formVals.sn}
                </FormItem>
                <FormItem
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 18 }}
                  label="产品名称"
                  hasFeedback
                >
                  {formVals.name}
                </FormItem>

                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} label="流通卡号">
                  {form.getFieldDecorator('sn', {})(
                    <TextArea placeholder="请输入卡号" size="large" />
                  )}
                </FormItem>
                <FormItem
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 18 }}
                  label="投产数量"
                  hasFeedback
                >
                  {form.getFieldDecorator('num', {
                    rules: [
                      {
                        required: true,
                        type: 'number',
                        message: '必须是数字类型',
                        transform(value) {
                          return value ? Number(value) : '';
                        },
                      },
                    ],
                  })(<Input placeholder="请输入投产数量" size="large" />)}
                </FormItem>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Modal>
    );
  }
}
