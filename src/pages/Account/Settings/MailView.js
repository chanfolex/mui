import React, { Component } from 'react';
import { FormattedMessage } from 'umi/locale';
import { Form, Input, Button } from 'antd';
import { connect } from 'dva';
import styles from './BaseView.less';
// import GeographicView from './GeographicView';
// import PhoneView from './PhoneView';
// import { getTimeDistance } from '@/utils/utils';

const FormItem = Form.Item;
// const { Option } = Select;

// 头像组件 方便以后独立，增加裁剪之类的功能

// const validatorGeographic = (rule, value, callback) => {
//   const { province, city } = value;
//   if (!province.key) {
//     callback('Please input your province!');
//   }
//   if (!city.key) {
//     callback('Please input your city!');
//   }
//   callback();
// };

// const validatorPhone = (rule, value, callback) => {
//   const values = value.split('-');
//   if (!values[0]) {
//     callback('Please input your area code!');
//   }
//   if (!values[1]) {
//     callback('Please input your phone number!');
//   }
//   callback();
// };

@connect(({ user }) => ({
  currentUser: user.currentUser,
}))
@Form.create()
class BaseView extends Component {
  componentDidMount() {
    // this.setBaseInfo();
  }

  setBaseInfo = () => {
    const { currentUser, form } = this.props;
    Object.keys(form.getFieldsValue()).forEach(key => {
      const obj = {};
      obj[key] = currentUser[key] || null;
      form.setFieldsValue(obj);
    });
  };

  getAvatarURL() {
    const { currentUser } = this.props;
    if (currentUser.avatar) {
      return currentUser.avatar;
    }
    const url = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
    return url;
  }

  getViewDom = ref => {
    this.view = ref;
  };

  avatarChange = ({ file }) => {
    if (file.status === 'done') {
      const { dispatch, currentUser } = this.props;
      dispatch({
        type: 'user/setCurrentUser',
        payload: { ...currentUser, avatar: file.response.data },
      });
    }
  };

  updatePwd = values => {
    const { dispatch } = this.props;
    // console.log(values);
    dispatch({
      type: 'user/updatePwd',
      payload: values,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form, currentUser } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        const user = {
          ...currentUser,
          mail_server: values.mail_server,
          mail_account: values.mail_account,
          mail_pwd: values.mail_pwd,
        };
        dispatch({
          type: 'user/updateMailInfo',
          payload: user,
        });
      }
    });
  };

  handleMailConnect = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'user/connectDo' });
  };

  render() {
    const {
      currentUser,
      form: { getFieldDecorator },
    } = this.props;

    // const formItemLayout = {
    //   labelCol: { span: 6 },
    //   wrapperCol: { span: 18 },
    // };

    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        <div className={styles.left}>
          <Form layout="vertical" onSubmit={this.handleSubmit} hideRequiredMark>
            <FormItem label="邮箱账号">
              {getFieldDecorator('mail_account', {
                rules: [
                  {
                    type: 'email',
                    message: '无效邮箱',
                  },
                  {
                    required: true,
                    message: '输入邮箱',
                  },
                ],
                initialValue: currentUser.mail_account,
              })(<Input />)}
            </FormItem>
            <FormItem label="邮箱密码">
              {getFieldDecorator('mail_pwd', {
                rules: [
                  {
                    message: '无效邮箱密码',
                  },
                  {
                    required: true,
                    message: '输入邮箱密码',
                  },
                ],
                initialValue: currentUser.mail_pwd,
              })(<Input />)}
            </FormItem>
            <FormItem label="收件服务器">
              {getFieldDecorator('mail_server', {
                rules: [
                  {
                    message: '无效收件服务器',
                  },
                  {
                    required: true,
                    message: '输入收件服务器',
                  },
                ],
                initialValue: currentUser.mail_server,
              })(<Input />)}
            </FormItem>

            {/* <FormItem label={formatMessage({ id: 'app.settings.basic.profile' })}>
              {getFieldDecorator('profile', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.profile-message' }, {}),
                  },
                ],
              })(
                <Input.TextArea
                  placeholder={formatMessage({ id: 'app.settings.basic.profile-placeholder' })}
                  rows={4}
                />
              )}
            </FormItem> */}
            {/* <FormItem label={formatMessage({ id: 'app.settings.basic.country' })}>
              {getFieldDecorator('country', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.country-message' }, {}),
                  },
                ],
              })(
                <Select style={{ maxWidth: 220 }}>
                  <Option value="China">中国</Option>
                </Select>
              )}
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.settings.basic.geographic' })}>
              {getFieldDecorator('geographic', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.geographic-message' }, {}),
                  },
                  {
                    validator: validatorGeographic,
                  },
                ],
              })(<GeographicView />)}
            </FormItem> */}
            {/* <FormItem label={formatMessage({ id: 'app.settings.basic.address' })}>
              {getFieldDecorator('address', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.address-message' }, {}),
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.settings.basic.phone' })}>
              {getFieldDecorator('phone', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.phone-message' }, {}),
                  },
                  { validator: validatorPhone },
                ],
              })(<PhoneView />)}
            </FormItem> */}
            <Button type="primary" htmlType="submit">
              <FormattedMessage
                id="app.settings.basic.update-mail"
                defaultMessage="Update Information"
              />
            </Button>
          </Form>

          <Button icon="refresh" type="primary" size="large" onClick={this.handleMailConnect}>
            连接测试
          </Button>
        </div>
        {/* <div className={styles.right}>
          <AvatarView avatar={this.getAvatarURL()} onChange={this.avatarChange} />
        </div> */}
      </div>
    );
  }
}

export default BaseView;
