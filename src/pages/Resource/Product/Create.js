/* eslint-disable consistent-return */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
import React, { Component } from 'react';

import { Row, Col, Form, Input, Select, Modal, Tabs, message } from 'antd';
import UploadFile from '@/components/UploadFile';
import styles from './product.less';
import ProductItem from './ProductItem';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

let indexs = 1;

@Form.create()
export default class CreateProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectDisabled: true, // 二级分类是否禁止
      categoryId: '', // 当前选中的一级分类
      bom: [{ product: '', num: '', ids: 0 }],
    };
  }

  handleUploadChange = ({ fileList }) =>
    fileList.map(file => ({
      status: file.status,
      uid: file.uid,
      url: file.response ? file.response.data : file.url,
    }));

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
      handleSecondClassify,
      dispatch,
    } = this.props;

    const { bom } = this.state;

    const okHandle = () => {
      form.validateFields((errors, values) => {
        if (errors) return;
        values.cover = values.cover.map(el => el.url);
        // 对所有未填写的数据进行拦截
        if (!bom.every(item => item.product && item.num)) {
          // 单独对数据只有一条且都没有填写内容，进行放行。
          if (bom.length === 1 && bom[0].product === '' && bom[0].num === '') {
            handleAdd(Object.assign(values, { bom: [] }));
            form.resetFields();
            return;
          }
          return message.info('还有必填项没有未填');
        }
        handleAdd(Object.assign(values, { bom }));
        form.resetFields();
      });
    };

    const onTabChange = () => {};

    const onChangeFirstClassify = e => {
      this.setState({
        selectDisabled: e === undefined,
        categoryId: e,
      });
      this.props.form.setFields({ categorytiny: '' });
    };

    // bom添加
    const addHandle = () => {
      if (bom[bom.length - 1].product !== '' && bom[bom.length - 1].num !== '') {
        this.setState({
          bom: [...bom, { product: '', num: '', ids: indexs++ }],
        });
      } else {
        message.error('请先填写完整上一条内容');
      }
    };

    // bom删除
    const deleteHandle = i => {
      if (bom.length > 1) {
        bom.splice(i, 1);
        this.setState({
          bom,
        });
      } else {
        this.setState({
          bom: [{ product: '', num: '', ids: indexs++ }],
        });
      }
    };

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
                      onFocus={() => handleSecondClassify(this.state.categoryId, '')}
                      // eslint-disable-next-line react/destructuring-assignment
                      onSearch={e => handleSecondClassify(this.state.categoryId, e)}
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
          <TabPane tab="bom 信息" key="2">
            {bom.map((item, index) => (
              <ProductItem
                ref={`submitHandle${index}`}
                key={item.ids}
                addHandle={addHandle}
                deleteHandle={deleteHandle}
                id={index}
                bom={item}
                dispatch={dispatch}
              />
            ))}
          </TabPane>
        </Tabs>
      </Modal>
    );
  }
}
