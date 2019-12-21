import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Checkbox, Switch } from 'antd';
import styles from '../system.less';

const FormItem = Form.Item;
// const { Option } = Select;

@connect(({ role }) => ({
  role,
}))
@Form.create()
export default class RoleModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      checks: props.role.menus.map(() => false),
      checkedMenus: props.role.menus.map(() => []),
    };
  }

  showModelHandler = e => {
    if (e) e.stopPropagation();
    const { record, role } = this.props;
    const checkedAuth = [];
    // 编辑
    if (record.auth) {
      role.menus.forEach((el, index) => {
        checkedAuth[index] = record.auth
          .split(',')
          .filter(child => new RegExp(`^${el.value}\\d`).test(child))
          .map(num => Number(num));
      });
    }
    this.setState({
      visible: true,
      checks: record.auth
        ? role.menus.map((el, index) => checkedAuth[index].length > 0)
        : role.menus.map(() => true),
      checkedMenus: record.auth ? checkedAuth : role.menus.map(() => []),
    });
  };

  hideModelHandler = () => {
    this.setState({
      visible: false,
      checkedMenus: [],
      checks: [],
    });
  };

  onSwitchChange = (checked, index) => {
    const { checks } = this.state;
    checks.splice(index, 1, checked);
    this.setState({
      checks,
    });
  };

  onCheckboxGroupChange = (values, index) => {
    const { checkedMenus } = this.state;
    checkedMenus.splice(index, 1, values);
    this.setState({
      checkedMenus,
    });
  };

  okHandler = () => {
    const { onOk, form } = this.props;
    const { checks, checkedMenus } = this.state;
    form.validateFields((err, values) => {
      if (!err) {
        const arr = [];
        checks.forEach((el, index) => {
          const item = checkedMenus[index];
          if (el && item.length > 0) {
            arr.push(checkedMenus[index]);
          }
        });
        // eslint-disable-next-line no-param-reassign
        values.auth = arr.join(',');
        onOk(values);
        this.hideModelHandler();
      }
    });
  };

  render() {
    const { visible, checks, checkedMenus } = this.state;
    const {
      form,
      children,
      record,
      role: { menus },
    } = this.props;
    const { getFieldDecorator } = form;
    const { name } = record;

    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
    };

    const box = {
      marginBottom: '5px',
      padding: '0 10px',
      background: 'rgb(247, 247, 247)',
      borderRadius: '4px',
    };

    return (
      <span>
        <span onClick={this.showModelHandler}>{children}</span>
        <Modal
          width={650}
          className={styles.formRow}
          destroyOnClose
          centered
          title={name ? '编辑角色' : '新建角色'}
          bodyStyle={{ maxHeight: 'calc(100vh - 350px)', overflow: 'auto' }}
          visible={visible}
          maskClosable={false}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
        >
          <FormItem {...formItemLayout} label="名称" hasFeedback>
            {getFieldDecorator('name', {
              rules: [{ required: true, whitespace: true, message: '名称是必填项' }],
              initialValue: name,
            })(<Input placeholder="请输入名称" size="large" autoComplete="off" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="菜单" hasFeedback>
            {menus.map((menu, index) => (
              <div key={menu.value} style={box}>
                <p style={{ margin: 0 }}>
                  {menu.name}{' '}
                  <Switch
                    size="small"
                    defaultChecked={checks[index]}
                    onChange={checked => this.onSwitchChange(checked, index)}
                  />
                </p>
                {checks[index] && (
                  <div>
                    {
                      <Checkbox.Group
                        options={menu.children}
                        defaultValue={checkedMenus[index]}
                        onChange={values => this.onCheckboxGroupChange(values, index)}
                      />
                    }
                  </div>
                )}
              </div>
            ))}
          </FormItem>
        </Modal>
      </span>
    );
  }
}
