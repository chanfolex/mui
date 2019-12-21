import React, { Component } from 'react';
import { Form, Input, Modal, Switch } from 'antd';
import styles from './examine.less';

const FormItem = Form.Item;

@Form.create()
export default class ExamineModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  showModelHandler = e => {
    if (e) e.stopPropagation();
    this.setState({
      visible: true,
    });
  };

  hideModelHandler = () => {
    this.setState({
      visible: false,
    });
  };

  okHandler = () => {
    const { onOk, form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        // eslint-disable-next-line no-param-reassign

        // eslint-disable-next-line no-param-reassign
        values.state = Number(values.state);

        onOk(values);
        this.hideModelHandler();
      }
    });
  };

  render() {
    const { visible } = this.state;
    const { form, children, record } = this.props;
    const { getFieldDecorator } = form;
    const { state } = record;

    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
    };

    return (
      <span>
        <span onClick={this.showModelHandler}>{children}</span>
        <Modal
          width={600}
          className={styles.formRow}
          destroyOnClose
          centered
          title="审核"
          bodyStyle={{ maxHeight: 'calc(100vh - 250px)', overflow: 'auto' }}
          visible={visible}
          maskClosable={false}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
        >
          <FormItem {...formItemLayout} label="状态">
            {getFieldDecorator('state', {
              rules: [{ required: true, message: '状态是必填项' }],
              valuePropName: 'checked',
              initialValue: state >= 0 ? !!state : true,
            })(<Switch size="large" checkedChildren="通过" unCheckedChildren="拒绝" />)}
          </FormItem>

          <FormItem {...formItemLayout} label="审核备注" hasFeedback>
            {getFieldDecorator('extras', {
              rules: [{ required: false, whitespace: true, message: '审核备注' }],
            })(<Input placeholder="请输入审核备注" size="large" autoComplete="off" />)}
          </FormItem>
        </Modal>
      </span>
    );
  }
}
