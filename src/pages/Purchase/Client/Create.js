import React, { Component } from 'react';

import { Row, Col, Form, Input, Select, Modal, Tabs } from 'antd';
import UploadFile from '@/components/UploadFile';
import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

@Form.create()
export default class CreateClient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      banksItems: [],
    };
  }

  add = () => {
    const { banksItems } = this.state;
    this.setState({
      banksItems: [...banksItems, { name: '', bank: '', account: '' }],
    });
    console.log(banksItems);
  };

  remove = k => {
    const { banksItems } = this.state;
    this.setState({
      banksItems: banksItems.filter((_, i) => i !== k),
    });
  };

  handleUploadChange = ({ fileList }) => {
    console.log('cc');
    return fileList.map(file => ({
      status: file.status,
      uid: file.uid,
      url: file.response ? file.response.data : file.url,
    }));
  };

  render() {
    const { banksItems } = this.state;
    const { modalVisible, form, handleAdd, handleModalVisible, categorys } = this.props;

    const { getFieldDecorator, getFieldValue } = form;

    const iniKeys = banksItems && banksItems.length > 0 ? banksItems.map((k, index) => index) : [];
    getFieldDecorator('keys', { initialValue: iniKeys });
    const keys = getFieldValue('keys');

    const okHandle = () => {
      form.validateFields((errors, values) => {
        if (errors) return;

        const param = {
          name: values.name,
          category: values.category,
          address: values.address,
          linkman: values.linkman,
          tel: values.tel,
          bank: values.bank,
          extra: values.extra,
          production: values.production,
          website: values.website,
          fax: values.fax,
          mail: values.mail,
          job: values.job,
          account: values.account,
          cover: values.cover ? values.cover[0].url : '',
          beian: values.beian ? values.beian[0].url : '',
          license: values.license ? values.license[0].url : '',
        };
        param.des = keys.map((k, index) => ({
          bank: values[`bank${index}`],
          account: values[`account${index}`],
          name: values[`name${index}`],
        }));

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
        title="新建供应商"
        visible={modalVisible}
        maskClosable={false}
        onOk={okHandle}
        onCancel={() => handleModalVisible()}
      >
        <Tabs defaultActiveKey="1" onChange={onTabChange}>
          <TabPane tab="基础信息" key="1">
            <Row gutter={8}>
              <Col span={10}>
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

                <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="地址" hasFeedback>
                  {form.getFieldDecorator('address', {})(
                    <Input placeholder="请输入地址" size="large" />
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
                <FormItem
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  label="法人代表"
                  hasFeedback
                >
                  {form.getFieldDecorator('job', {})(
                    <Input placeholder="请输入法人代表" size="large" />
                  )}
                </FormItem>
                <FormItem
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  label="联系电话"
                  hasFeedback
                >
                  {form.getFieldDecorator('tel', {})(
                    <Input placeholder="请输入联系电话" size="large" />
                  )}
                </FormItem>
              </Col>
              <Col span={14}>
                <FormItem
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  label="对公银行"
                  hasFeedback
                >
                  {form.getFieldDecorator('bank', {})(
                    <Input placeholder="对公账号" size="large" />
                  )}
                </FormItem>
                <FormItem
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  label="对公账号"
                  hasFeedback
                >
                  {form.getFieldDecorator('account', {})(
                    <Input placeholder="请填写对公账号" size="large" />
                  )}
                </FormItem>
                <FormItem
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  label="经营范围"
                  hasFeedback
                >
                  {form.getFieldDecorator('production', {})(
                    <TextArea placeholder="请输入" size="large" />
                  )}
                </FormItem>

                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} label="备注" hasFeedback>
                  {form.getFieldDecorator('extra', {})(
                    <TextArea placeholder="备注" size="large" />
                  )}
                </FormItem>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="证件信息" key="2">
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label="营业执照" extra="">
              {form.getFieldDecorator('cover', {
                valuePropName: 'fileList',
                getValueFromEvent: this.handleUploadChange,
              })(<UploadFile num={1} />)}
            </FormItem>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 19 }}
              label="二类医疗器械备案"
              extra=""
            >
              {form.getFieldDecorator('beian', {
                valuePropName: 'fileList',
                getValueFromEvent: this.handleUploadChange,
              })(<UploadFile num={1} />)}
            </FormItem>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 19 }}
              label="食品经营许可证"
              extra=""
            >
              {form.getFieldDecorator('license', {
                valuePropName: 'fileList',
                getValueFromEvent: this.handleUploadChange,
              })(<UploadFile num={1} />)}
            </FormItem>
          </TabPane>
        </Tabs>
      </Modal>
    );
  }
}
