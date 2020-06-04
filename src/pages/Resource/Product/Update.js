import React, { Component } from 'react';

import { Row, Col, Form, Input, Select, Modal, Tabs, message } from 'antd';

import UploadFile from '@/components/UploadFile';
import styles from './product.less';
import ProductItem from './ProductItem';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

@Form.create()
export default class UpdateProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formVals: {
        id: props.values.id,
        name: props.values.name,
        shape: props.values.shape,
        barsn: props.values.barsn,
        cover: props.values.cover,
        pack: props.values.pack,
        price: props.values.price,
        price_fob: props.values.price_fob,
        num: props.values.num,
        bom: props.values.bom.length > 0 ? props.values.bom : [{ product: '', num: '' }],
        // start: props.values.start,
        // end: props.values.end,
        intro: props.values.intro,
        category: props.values.category ? props.values.category.id : '',
        categorytiny: props.values.categorytiny ? props.values.categorytiny.id : '',
        supporter: props.values.supporter ? props.values.supporter.id : '',
        unit: props.values.unit ? props.values.unit.id : '',
      },
      selectDisabled: false, // 二级分类是否禁止
      categoryId: '', // 当前选中的一级分类
    };
  }

  componentDidMount() {
    const { form } = this.props;
    const { formVals } = this.state;
    form.setFieldsValue({
      cover: formVals.cover.map((el, index) => ({
        uid: index,
        name: `image_${index}`,
        status: 'done',
        url: el,
      })),
    });
    // eslint-disable-next-line react/destructuring-assignment
    this.props.handleFirstClassify('');
    this.setState({
      // eslint-disable-next-line react/destructuring-assignment
      categoryId: this.props.values.category.id,
    });
    // eslint-disable-next-line react/destructuring-assignment
    this.props.handleSecondClassify(this.props.values.category.id, '');
  }

  handleUploadChange = ({ fileList }) =>
    // file
    fileList.map(file => ({
      status: file.status,
      uid: file.uid,
      url: file.response ? file.response.data : file.url,
    }));

  render() {
    const { formVals } = this.state;
    const {
      updateModalVisible,
      form,
      handleUpdate,
      handleUpdateModalVisible,
      categorys,
      categorytinys,
      units,
      supporters,
      handleFirstClassify,
      handleSecondClassify,
      dispatch,
    } = this.props;
    const okHandle = () => {
      form.validateFields((errors, values) => {
        if (errors) return;
        // eslint-disable-next-line no-param-reassign
        // eslint-disable-next-line no-param-reassign
        values.cover = values.cover.map(el => el.url);
        // eslint-disable-next-line no-param-reassign
        values.id = formVals.id;
        const bomData = formVals.bom[0].product === '' ? [] : formVals.bom;
        handleUpdate(Object.assign(values, { bom: bomData }));
        form.resetFields();
      });
    };
    const onTabChange = () => {};

    const onChangeFirstClassify = e => {
      this.setState({
        // eslint-disable-next-line react/no-unused-state
        selectDisabled: e === undefined,
        // eslint-disable-next-line react/no-unused-state
        categoryId: e,
      });
      // eslint-disable-next-line react/destructuring-assignment
      this.props.form.setFields({ categorytiny: '' });
    };

    // tabs2添加
    const addHandle = () => {
      // eslint-disable-next-line no-shadow
      const { formVals } = this.state;
      if (
        formVals.bom[formVals.bom.length - 1].product !== '' &&
        formVals.bom[formVals.bom.length - 1].num !== ''
      ) {
        const data = Object.assign(formVals, {
          bom: [...formVals.bom, { product: '', num: '' }],
        });
        this.setState({
          formVals: data,
        });
      } else {
        message.error('请填写完整产品后再添加');
      }
    };

    // tabs2删除
    const deleteHandle = i => {
      // eslint-disable-next-line no-shadow
      const { formVals } = this.state;
      if (formVals.bom.length > 1) {
        formVals.bom.splice(i, 1);
        this.setState({
          formVals,
        });
      } else {
        message.warning('请至少保留一项产品');
      }
    };

    return (
      <Modal
        width={800}
        className={styles.formRow}
        destroyOnClose
        title="编辑产品"
        visible={updateModalVisible}
        maskClosable={false}
        onOk={okHandle}
        onCancel={() => handleUpdateModalVisible()}
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
                    initialValue: formVals.barsn,
                  })(<Input placeholder="请输入存货编码" size="large" />)}
                </FormItem>
                <FormItem
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 18 }}
                  label="存货名称"
                  hasFeedback
                >
                  {form.getFieldDecorator('name', {
                    rules: [{ required: true, whitespace: true, message: '存货名称是必填项' }],
                    initialValue: formVals.name,
                  })(<Input placeholder="请输入存货名称" size="large" />)}
                </FormItem>

                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} label="客户">
                  {form.getFieldDecorator('supporter', {
                    rules: [{ required: true, message: '客户是必填项' }],
                    initialValue: formVals.supporter,
                  })(
                    <Select
                      allowClear
                      placeholder="请选择客户"
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

                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} label="分类">
                  {form.getFieldDecorator('category', {
                    rules: [{ required: true, message: '分类是必填项' }],
                    initialValue: formVals.category,
                  })(
                    <Select
                      allowClear
                      showSearch
                      placeholder="请选择分类"
                      style={{ width: '100%' }}
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
                    initialValue: formVals.categorytiny,
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

                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} label="规格" hasFeedback>
                  {form.getFieldDecorator('shape', {
                    initialValue: formVals.shape,
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
                  {form.getFieldDecorator('unit', {
                    rules: [{ required: true, message: '单位是必填项' }],
                    initialValue: formVals.unit,
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
                  {form.getFieldDecorator('start', {
                    initialValue: formVals.start,
                  })(<Input placeholder="请输入生产日期" size="large" />)}
                </FormItem>
                <FormItem
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 18 }}
                  label="有效日期"
                  hasFeedback
                >
                  {form.getFieldDecorator('end', {
                    initialValue: formVals.end,
                  })(<Input placeholder="请输入有效日期" size="large" />)}
                </FormItem> */}
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} label="包装" hasFeedback>
                  {form.getFieldDecorator('pack', {
                    initialValue: formVals.pack,
                    rules: [
                      {
                        required: true,
                        message: '必须是数字类型',
                      },
                    ],
                  })(<Input placeholder="请输入包装计量（/箱）" size="large" type="number" />)}
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
                    initialValue: formVals.price,
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
                    initialValue: formVals.price_fob,
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
                    initialValue: formVals.num,
                  })(<Input placeholder="库存数量" size="large" />)}
                </FormItem>

                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} label="备注">
                  {form.getFieldDecorator('intro', {
                    initialValue: formVals.intro,
                  })(<TextArea placeholder="请输入备注" size="large" />)}
                </FormItem>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="bom 信息" key="2">
            {formVals.bom.map((item, index) => (
              <ProductItem
                ref={`submitHandle${index}`}
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                addHandle={addHandle}
                deleteHandle={deleteHandle}
                id={index}
                bom={item}
                dispatch={dispatch}
              />
            ))}
          </TabPane>
          {/* <TabPane tab="供应商信息" key="2">
            <div className="supporter">
              {supporters.length > 0 &&
                supporters.map((el, index) => (
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
                    size="large"
                    icon="plus"
                    onClick={this.addSupporter}
                  />
                </p>
              )}
            </div>
          </TabPane> */}
        </Tabs>
      </Modal>
    );
  }
}
