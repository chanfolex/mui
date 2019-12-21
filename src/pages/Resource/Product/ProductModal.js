import React, { Component } from 'react';

import { Row, Col, Form, Input, Icon, Select, Button, Modal, Tabs, Spin } from 'antd';
import Debounce from 'lodash-decorators/debounce';
import UploadFile from '@/components/UploadFile';
import styles from './product.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

@Form.create()
export default class ProductModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      isAdd: false,
      supporters: [], // {id: 1, name: 'a'},
      supporterOptions: [],
      spinState: false,
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
    const { supporters } = this.state;
    form.validateFields((err, values) => {
      if (!err) {
        // eslint-disable-next-line no-param-reassign
        values.supporter = supporters;
        // eslint-disable-next-line no-param-reassign
        values.cover = values.cover.map(el => el.url);
        onOk(values);
        this.hideModelHandler();
      }
    });
  };

  addSupporter = () => {
    this.setState({
      isAdd: true,
    });
  };

  @Debounce(800)
  handleSearch = keywords => {
    if (keywords) {
      this.setState({
        supporterOptions: [],
        spinState: true,
      });

      const { dispatch } = this.props;
      dispatch({
        type: 'product/fetchSupporterOption',
        payload: {
          abbr: keywords,
        },
      }).then(res => {
        this.setState({
          supporterOptions: res.data.map(el => ({ id: el.id, name: el.name })),
          spinState: false,
        });
      });
    }
  };

  removeSupporter = index => {
    const { supporters } = this.state;
    this.setState({
      supporters: supporters.filter((_, i) => i !== index),
    });
  };

  handleChange = obj => {
    const { supporters } = this.state;
    this.setState({
      supporters: [...supporters, { id: obj.key, name: obj.label }],
      isAdd: false,
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
    const { visible, supporters, supporterOptions, isAdd, spinState } = this.state;
    const { form, children, categorys } = this.props;

    return (
      <span>
        <span onClick={this.showModelHandler}>{children}</span>
        <Modal
          width={800}
          className={styles.formRow}
          destroyOnClose
          title="新建产品"
          visible={visible}
          maskClosable={false}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
        >
          <Tabs defaultActiveKey="1">
            <TabPane tab="基础信息" key="1">
              <Row gutter={8}>
                <Col span={10}>
                  <FormItem
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 18 }}
                    label="名称"
                    hasFeedback
                  >
                    {form.getFieldDecorator('name', {
                      rules: [{ required: true, whitespace: true, message: '名称是必填项' }],
                    })(<Input placeholder="请输入产品名称" size="large" />)}
                  </FormItem>
                  <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} label="分类">
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
                  </FormItem>
                  <FormItem
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 18 }}
                    label="单价"
                    hasFeedback
                  >
                    {form.getFieldDecorator('price', {
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
                    })(<Input placeholder="请输入产品价格" size="large" />)}
                  </FormItem>
                  <FormItem
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 18 }}
                    label="型号"
                    hasFeedback
                  >
                    {form.getFieldDecorator('shape', {})(
                      <Input placeholder="请输入产品型号" size="large" />
                    )}
                  </FormItem>
                  <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} label="描述">
                    {form.getFieldDecorator('intro')(<TextArea placeholder="请输入" />)}
                  </FormItem>
                </Col>
                <Col span={14}>
                  <FormItem
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 19 }}
                    label="产品图片"
                    extra=""
                  >
                    {form.getFieldDecorator('cover', {
                      valuePropName: 'fileList',
                      getValueFromEvent: this.handleUploadChange,
                    })(<UploadFile num={6} />)}
                  </FormItem>
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="供应商信息" key="2">
              <div className="supporter">
                {supporters.map((el, index) => (
                  <div key={el.id} className={styles.supporterRow}>
                    <div className={styles.supporterText}>
                      <span className={styles.supporterNum}>{index + 1}</span>
                      <span>{el.name}</span>
                      <Icon
                        type="delete"
                        onClick={() => this.removeSupporter(index)}
                        style={{
                          fontSize: 18,
                          position: 'absolute',
                          right: 10,
                          top: 10,
                          cursor: 'pointer',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ paddingTop: 20, paddingLeft: 40 }}>
                {isAdd ? (
                  <Select
                    size="large"
                    showSearch
                    labelInValue
                    allowClear
                    // value={this.state.value}
                    placeholder="输入供应商拼音首字母进行搜索"
                    style={{ width: '100%' }}
                    defaultActiveFirstOption={false}
                    showArrow={false}
                    filterOption={false}
                    onSearch={this.handleSearch}
                    onChange={this.handleChange}
                    notFoundContent={spinState ? <Spin /> : '暂无数据'}
                  >
                    {supporterOptions.map(d => (
                      <Option key={d.id} value={d.id}>
                        {d.name}
                      </Option>
                    ))}
                  </Select>
                ) : (
                  <p>
                    <Button
                      type="primary"
                      shape="circle"
                      icon="plus"
                      size="large"
                      onClick={this.addSupporter}
                    />
                  </p>
                )}
              </div>
            </TabPane>
          </Tabs>
        </Modal>
      </span>
    );
  }
}
