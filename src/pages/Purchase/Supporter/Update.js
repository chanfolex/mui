import React, { Component } from 'react';

import { Row, Col, Form, Input, Select, Modal, Tabs } from 'antd';

// eslint-disable-next-line import/extensions
import UploadFile from '@/components/UploadFile';
import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

@Form.create()
export default class UpdateSupporter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      banksItems: props.values.des || [],
      formVals: {
        id: props.values.id,
        name: props.values.name,
        address: props.values.address,
        cover: props.values.cover,
        beian: props.values.beian,
        license: props.values.license,
        linkman: props.values.linkman,
        mail: props.values.mail,
        website: props.values.website,
        fax: props.values.fax,
        tel: props.values.tel,
        job: props.values.job,
        intro: props.values.intro,
        production: props.values.production,
        extra: props.values.extra,
        bank: props.values.bank,
        category: props.values.category ? props.values.category.id : '',
        account: props.values.account,
      },
    };
  }

  componentDidMount() {
    // const { form } = this.props;
    // const { formVals } = this.state;
    // form.setFieldsValue({
    //   cover: formVals.cover.uid: index,
    //     name: `image`,
    //     status: 'done',
    //     url: el,
    // });
  }

  handleUploadChange = ({ fileList }) =>
    // file
    fileList.map(file => ({
      status: file.status,
      uid: file.uid,
      url: file.response ? file.response.data : file.url,
    }));

  render() {
    const { banksItems, formVals } = this.state;
    const {
      updateModalVisible,
      form,
      handleUpdate,
      handleUpdateModalVisible,
      categorys,
    } = this.props;
    const { getFieldDecorator, getFieldValue } = form;

    const iniKeys = banksItems && banksItems.length > 0 ? banksItems.map((k, index) => index) : [];
    getFieldDecorator('keys', { initialValue: iniKeys });
    const keys = getFieldValue('keys');

    const okHandle = () => {
      form.validateFields((errors, values) => {
        if (errors) return;
        const param = {
          id: formVals.id,
          name: values.name,
          category: values.category,
          price: values.price,
          address: values.address,
          linkman: values.linkman,
          job: values.job,
          tel: values.tel,
          bank: values.bank,
          extra: values.extra,
          production: values.production,
          website: values.website,
          fax: values.fax,
          mail: values.mail,
          account: values.account,
          // eslint-disable-next-line no-nested-ternary
          cover: values.cover ? values.cover[0].url : formVals.cover ? formVals.cover : '',
          // eslint-disable-next-line no-nested-ternary
          beian: values.beian ? values.beian[0].url : formVals.beian ? formVals.beian : '',
          // eslint-disable-next-line no-nested-ternary
          license: values.license
            ? values.license[0].url
            : formVals.license
              ? formVals.license
              : '',
        };
        // eslint-disable-next-line no-param-reassign
        param.des = keys.map((k, index) => ({
          // id: values[`id${index}`] ? values[`id${index}`]: '',
          bank: values[`bank${index}`],
          account: values[`account${index}`],
          name: values[`name${index}`],
        }));

        handleUpdate(param);
        form.resetFields();
      });
    };

    const onTabChange = () => {};

    return (
      <Modal
        width={800}
        className={styles.formRow}
        destroyOnClose
        title="编辑供应商"
        visible={updateModalVisible}
        maskClosable={false}
        onOk={okHandle}
        onCancel={() => handleUpdateModalVisible()}
      >
        <Tabs defaultActiveKey="1" onChange={onTabChange}>
          <TabPane tab="基础信息" key="1">
            <Row gutter={8}>
              <Col span={10}>
                <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="名称" hasFeedback>
                  {form.getFieldDecorator('name', {
                    rules: [{ required: true, whitespace: true, message: '名称是必填项' }],
                    initialValue: formVals.name,
                  })(<Input placeholder="请输入名称" size="large" />)}
                </FormItem>

                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} label="分类">
                  {form.getFieldDecorator('category', {
                    rules: [{ required: true, message: '分类是必填项' }],
                    initialValue: formVals.category,
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
                  {form.getFieldDecorator('address', {
                    initialValue: formVals.address,
                  })(<TextArea placeholder="地址" size="large" />)}
                </FormItem>
                <FormItem
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  label="联系人"
                  hasFeedback
                >
                  {form.getFieldDecorator('linkman', {
                    initialValue: formVals.linkman,
                  })(<Input placeholder="请输入联系人" size="large" />)}
                </FormItem>
                <FormItem
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  label="法人代表"
                  hasFeedback
                >
                  {form.getFieldDecorator('job', {
                    initialValue: formVals.job,
                  })(<Input placeholder="请输入法人代表" size="large" />)}
                </FormItem>
                <FormItem
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  label="联系电话"
                  hasFeedback
                >
                  {form.getFieldDecorator('tel', {
                    initialValue: formVals.tel,
                  })(<Input placeholder="请输入联系电话" size="large" />)}
                </FormItem>
              </Col>
              <Col span={14}>
                <FormItem
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  label="对公银行"
                  hasFeedback
                >
                  {form.getFieldDecorator('bank', {
                    initialValue: formVals.bank,
                  })(<Input placeholder="对公账号" size="large" />)}
                </FormItem>
                <FormItem
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  label="对公账号"
                  hasFeedback
                >
                  {form.getFieldDecorator('account', {
                    initialValue: formVals.account,
                  })(<Input placeholder="请填写对公账号" size="large" />)}
                </FormItem>
                <FormItem
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  label="经营范围"
                  hasFeedback
                >
                  {form.getFieldDecorator('production', {
                    initialValue: formVals.production,
                  })(<TextArea placeholder="请输入" size="large" />)}
                </FormItem>

                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} label="备注" hasFeedback>
                  {form.getFieldDecorator('extra', {
                    initialValue: formVals.extra,
                  })(<TextArea placeholder="备注" size="large" />)}
                </FormItem>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="证件信息" key="2">
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label="营业执照" extra="">
              <img src={formVals.cover} alt="" width="100" height="100" />
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
              <img src={formVals.beian} alt="" width="100" height="100" />
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
              <img src={formVals.license} alt="" width="100" height="100" />
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
