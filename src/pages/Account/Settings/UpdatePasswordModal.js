import React, { Component } from 'react';
import { Form, Input, Modal } from 'antd';

const FormItem = Form.Item;

@Form.create()
export default class UpdatePasswordModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      confirmDirty: false,
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

  handleConfirmBlur = e => {
    const { value } = e.target;
    const { confirmDirty } = this.state;
    this.setState({ confirmDirty: confirmDirty || !!value });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次密码不一致');
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    const { confirmDirty } = this.state;
    if (value && confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  okHandler = () => {
    const { onOk, form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        // eslint-disable-next-line no-param-reassign
        delete values.confirm;
        onOk(values);
        this.hideModelHandler();
      }
    });
  };

  render() {
    const { visible } = this.state;
    const { form, children } = this.props;
    const { getFieldDecorator } = form;

    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
    };

    return (
      <span>
        <span onClick={this.showModelHandler}>{children}</span>
        <Modal
          width={600}
          destroyOnClose
          centered
          title="密码修改"
          bodyStyle={{ maxHeight: 'calc(100vh - 250px)', overflow: 'auto' }}
          visible={visible}
          maskClosable={false}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
        >
          <FormItem {...formItemLayout} label="原密码" hasFeedback>
            {getFieldDecorator('ypassword', {
              rules: [{ required: true, whitespace: true, message: '原密码是必填项' }],
            })(<Input type="password" placeholder="请输入原密码" size="large" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="新密码" hasFeedback>
            {getFieldDecorator('password', {
              rules: [
                { required: true, whitespace: true, message: '新密码是必填项' },
                {
                  validator: this.validateToNextPassword,
                },
              ],
            })(<Input type="password" placeholder="请输入新密码" size="large" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="确认密码" hasFeedback>
            {getFieldDecorator('confirm', {
              rules: [
                { required: true, whitespace: true, message: '确认密码是必填项' },
                {
                  validator: this.compareToFirstPassword,
                },
              ],
            })(
              <Input
                type="password"
                placeholder="请输入确认密码"
                onBlur={this.handleConfirmBlur}
                size="large"
              />
            )}
          </FormItem>
        </Modal>
      </span>
    );
  }
}
