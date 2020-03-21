import React, { Component } from 'react';

import { Row, Col, Form, Input, Select, Modal, Tabs } from 'antd';
import UploadFile from '@/components/UploadFile';
import styles from './product.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

@Form.create()
export default class CreateProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectDisabled: true, // 二级分类是否禁止
      categoryId:'' // 当前选中的一级分类
    };
  }

  handleUploadChange = ({ fileList }) => {
    console.log('cc');
    return fileList.map(file => ({
      status: file.status,
      uid: file.uid,
      url: file.response ? file.response.data : file.url,
    }));
  };

  render() {

    const {
      modalVisible,
      form,
      handleAdd,
      handleModalVisible,
      categorys,
      categorytinys,
      units,
      supporters,
      handleFirstClassify,
      handleSecondClassify
    } = this.props;

    const okHandle = () => {
      form.validateFields((errors, values) => {
        if (errors) return;
        // eslint-disable-next-line no-param-reassign
        // eslint-disable-next-line no-param-reassign
        values.cover = values.cover.map(el => el.url);
        handleAdd(values);
        form.resetFields();
      });
    };
    const onTabChange = () => {};

    const onChangeFirstClassify = (e) =>{
      this.setState({
        // eslint-disable-next-line react/no-unused-state
        selectDisabled: e === undefined,
        categoryId: e
      })
      // eslint-disable-next-line react/destructuring-assignment
      this.props.form.setFields({"categorytiny":""})
    }

    return (
      <Modal
        width={800}
        className={styles.formRow}
        destroyOnClose
        title="新建产品"
        visible={modalVisible}
        maskClosable={false}
        onOk={okHandle}
        onCancel={() => handleModalVisible()}
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
                  {form.getFieldDecorator('barsn', {
                    rules: [{ required: false, whitespace: true, message: '是必填项' }],
                  })(<Input placeholder="请输入存货编码" size="large" />)}
                </FormItem>
                <FormItem
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 18 }}
                  label="存货名称"
                  hasFeedback
                >
                  {form.getFieldDecorator('name', {
                    rules: [{ required: true, whitespace: true, message: '名称是必填项' }],
                  })(<Input placeholder="请输入存货名称" size="large" />)}
                </FormItem>

                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} label="客户">
                  {form.getFieldDecorator('supporter', {
                    rules: [{ required: true, message: '请选择客户' }],
                  })(
                    <Select
                      allowClear
                      placeholder="请选客户"
                      style={{ width: '100%' }}
                      size="large"
                    >
                      {supporters.map(el => (
                        <Option key={el.id} value={el.id}>
                          {el.name}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>

                {/* 对以下代码进行修改 */}

                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} label="分类">
                  {form.getFieldDecorator('category', {
                    rules: [{ required: true, message: '分类是必填项' }],
                  })(
                    <Select
                      allowClear
                      showSearch
                      placeholder="请选择分类"
                      style={{ width: '100%' }}
                      autoClearSearchValue
                      size="large"
                      filterOption={false}
                      onSearch={e => handleFirstClassify(e)}
                      onChange={e => onChangeFirstClassify(e)}
                      onFocus={() => handleFirstClassify('')}
                    >
                      {categorys.map(el => (
                        <Option key={el.id} value={el.id}>
                          {el.name}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>

                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} label="二级分类">
                  {form.getFieldDecorator('categorytiny', {
                    rules: [{ required: true, message: '分类是必填项' }],
                  })(
                    <Select
                      allowClear
                      showSearch
                      placeholder="请选择分类"
                      style={{ width: '100%' }}
                      size="large"
                      filterOption={false}
                      // eslint-disable-next-line react/destructuring-assignment
                      onFocus={() => handleSecondClassify(this.state.categoryId,'')}
                      // eslint-disable-next-line react/destructuring-assignment
                      onSearch={e => handleSecondClassify(this.state.categoryId,e)}
                      // eslint-disable-next-line react/destructuring-assignment
                      disabled={this.state.selectDisabled}
                    >
                      {categorytinys.map(el => (
                        <Option key={el.id} value={el.id}>
                          {el.name}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>

                {/* 对以上代码进行修改 */}

                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} label="规格" hasFeedback>
                  {form.getFieldDecorator('shape', {
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
                  })(<Input placeholder="请输入规格" size="large" />)}
                </FormItem>

                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} label="单位">
                  {form.getFieldDecorator('type', {
                    rules: [{ required: true, message: '单位是必填项' }],
                  })(
                    <Select
                      allowClear
                      placeholder="请选择单位"
                      style={{ width: '100%' }}
                      size="large"
                    >
                      {units.map(el => (
                        <Option key={el.id} value={el.id}>
                          {el.name}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>

                {/* <FormItem
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 18 }}
                  label="生产日期"
                  hasFeedback
                >
                  {form.getFieldDecorator('start', {})(
                    <Input placeholder="请输入生产日期" size="large" />
                  )}
                </FormItem>
                <FormItem
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 18 }}
                  label="有效日期"
                  hasFeedback
                >
                  {form.getFieldDecorator('end', {})(
                    <Input placeholder="请输入有效日期" size="large" />
                  )}
                </FormItem> */}
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} label="包装" hasFeedback>
                  {form.getFieldDecorator('pack', {
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
                  })(<Input placeholder="请输入包装计量（/箱）" size="large" />)}
                </FormItem>

                <FormItem
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 18 }}
                  label="最新成本"
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
                  })(<Input placeholder="请输入最新成本" size="large" />)}
                </FormItem>
                <FormItem
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 18 }}
                  label="参考成本"
                  hasFeedback
                >
                  {form.getFieldDecorator('price_fob', {
                    rules: [
                      {
                        required: false,
                        type: 'number',
                        message: '必须是数字类型',
                        transform(value) {
                          return value ? Number(value) : '';
                        },
                      },
                    ],
                  })(<Input placeholder="请输入参考成本" size="large" />)}
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
                <FormItem
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 18 }}
                  label="库存数量"
                  hasFeedback
                >
                  {form.getFieldDecorator('num', {
                    rules: [
                      {
                        required: false,
                        type: 'number',
                        message: '必须是数字类型',
                        transform(value) {
                          return value ? Number(value) : '';
                        },
                      },
                    ],
                  })(<Input placeholder="库存数量" size="large" />)}
                </FormItem>

                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} label="备注">
                  {form.getFieldDecorator('intro', {})(
                    <TextArea placeholder="请输入备注" size="large" />
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
