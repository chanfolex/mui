import React, { Component } from 'react';
import { Form, Input, Select, Modal, Switch } from 'antd';
import UploadFile from '@/components/UploadFile';
import styles from '../system.less';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
export default class UserModal extends Component {
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

  handleUploadChange = ({ fileList }) =>
    // console.log('cc');
    fileList.map(file => ({
      status: file.status,
      uid: file.uid,
      url: file.response ? file.response.data : file.url,
    }));

  okHandler = () => {
    const { onOk, form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        // eslint-disable-next-line no-param-reassign
        values.avatar = values.avatar ? values.avatar[0].url : '';
        // eslint-disable-next-line no-param-reassign
        values.state = Number(values.state);

        // console.log(values);
        onOk(values);
        this.hideModelHandler();
      }
    });
  };

  render() {
    const { visible } = this.state;
    const { form, children, record, roles } = this.props;
    const { getFieldDecorator } = form;
    const { username, role, phone, mail, nickname, workno, state } = record;

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
          title={username ? '编辑用户' : '新建用户'}
          bodyStyle={{ maxHeight: 'calc(100vh - 250px)', overflow: 'auto' }}
          visible={visible}
          maskClosable={false}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
        >
          <FormItem {...formItemLayout} label="工号" hasFeedback>
            {getFieldDecorator('workno', {
              rules: [{ required: true, whitespace: true, message: '名称是必填项' }],
              initialValue: workno,
            })(<Input placeholder="请输入工号" size="large" autoComplete="off" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="姓名" hasFeedback>
            {getFieldDecorator('username', {
              rules: [{ required: true, whitespace: true, message: '名称是必填项' }],
              initialValue: username,
            })(<Input placeholder="请输入名称" size="large" autoComplete="off" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="昵称">
            {getFieldDecorator('nickname', {
              initialValue: nickname || '',
            })(<Input placeholder="请输入昵称" size="large" autoComplete="off" />)}
          </FormItem>
          {/* <FormItem {...formItemLayout} label="密码">
            {getFieldDecorator('password', {
              rules: [{ required: true, whitespace: true, message: '密码是必填项' }],
              initialValue: password || '123456',
            })(<Input placeholder="请输入密码" size="large" />)}
          </FormItem> */}
          <FormItem {...formItemLayout} label="电话" hasFeedback>
            {getFieldDecorator('phone', {
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
              initialValue: phone,
            })(<Input placeholder="请输入电话" size="large" autoComplete="off" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="角色">
            {getFieldDecorator('role', role ? { initialValue: role.id } : {})(
              <Select allowClear placeholder="请选择角色" style={{ width: '100%' }} size="large">
                {roles &&
                  roles.map(el => (
                    <Option key={el.id} value={el.id}>
                      {el.name}
                    </Option>
                  ))}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="邮箱">
            {getFieldDecorator('mail', {
              initialValue: mail || '',
            })(<Input placeholder="请输入邮箱" size="large" autoComplete="off" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="头像">
            {form.getFieldDecorator('avatar', {
              valuePropName: 'fileList',
              getValueFromEvent: this.handleUploadChange,
            })(<UploadFile num={6} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="状态">
            {getFieldDecorator('state', {
              rules: [{ required: true, message: '状态是必填项' }],
              valuePropName: 'checked',
              initialValue: state >= 0 ? !!state : true,
            })(<Switch checkedChildren="启用" unCheckedChildren="停用" />)}
          </FormItem>
        </Modal>
      </span>
    );
  }
}
