import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';

import moment from 'moment';
import {
  Form,
  Input,
  Modal,
  Row,
  Col,
  Button,
  Divider,
  AutoComplete,
  Avatar,
  Checkbox,
  DatePicker,
} from 'antd';
import Debounce from 'lodash-decorators/debounce';
import NumericInput from '@/components/common/NumericInput';

import styles from './Index.less';

// eslint-disable-next-line no-unused-vars
let id = 0;

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = AutoComplete;

@connect(({ customer, product }) => ({
  customer,
  product,
}))
@Form.create()
export default class EditModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      curIndex: 0,
      simple: false,
      // contract: '',
      des: [{ product: null, cover: '', intro: '', price: '', num: '', extra: '' }],
    };
  }

  showModelHandler = e => {
    if (e) e.stopPropagation();
    const { record } = this.props;
    const { des } = this.state;
    const arr = record.des.concat(des);
    id = arr.length > 0 ? arr.length : 0;
    this.setState({
      visible: true,
      des: arr,
    });
  };

  hideModelHandler = () => {
    this.setState({
      visible: false,
      des: [{ product: null, cover: '', intro: '', price: '', num: '', extra: '' }],
    });
  };

  remove = k => {
    // 更新id值
    id -= 1;

    const { des } = this.state;
    const arr = [...des];
    arr.splice(k, 1);
    // console.log('arr', arr);
    this.setState({
      des: arr,
    });
  };

  add = () => {
    const { des } = this.state;
    this.setState({
      des: [...des, { product: null, cover: '', intro: '', price: '', num: '', extra: '' }],
    });
  };

  onSelect = value => {
    const {
      product: { list: productList },
    } = this.props;
    const { des } = this.state;
    const { curIndex } = this.state;
    const row = productList.filter(el => el.id === Number(value))[0];
    if (row) {
      const obj = {
        product: { id: row.id, name: row.name },
        // name: row.name,
        cover: row.cover.join(','),
        intro: row.intro,
        price: row.price,
        num: row.num,
        extra: row.extra,
      };
      const arr = [...des];
      arr.splice(curIndex, 1, obj);
      this.setState({ des: arr });
    }
  };

  handleFocus = index => {
    this.setState({
      curIndex: index,
    });
  };

  @Debounce(800)
  handleSearch = value => {
    const { dispatch } = this.props;
    if (value) {
      dispatch({ type: 'product/fetch', payload: { abbr: value } });
    }
  };

  handleUploadChange = ({ fileList }) =>
    fileList.map(file => ({
      status: file.status,
      uid: file.uid,
      url: file.response ? file.response.data : file.url,
    }));

  // 是否样品
  onSimpleChange = e => {
    this.setState({
      simple: e.target.checked,
    });
  };

  // 合同编号
  // onContractChange = e => {
  //   this.setState({
  //     contract: e.target.value,
  //   });
  // };

  okHandler = () => {
    const { simple, des } = this.state;
    const { onOk, form, record } = this.props;
    form.validateFields((errors, values) => {
      if (errors) return;
      const obj = {
        client: record.client ? record.client.id : '',
        sn: record.sn,
        sample: simple ? Number(simple) : Number(record.sample),
        packing: values.packing,
        terms: values.terms,
        delivery: moment(values.delivery).format('YYYY-MM-DD HH:mm:ss'),
        port_l: values.port_l,
        port_d: values.port_d,
        trade: values.trade,
        des: [],
      };
      const tempDes = values.keys.map((key, index) => ({
        id: des[index].id ? des[index].id : '',
        product: des[key].product ? des[key].product.id : '',
        name: des[key].product ? des[key].product.name : '',
        price: Number(values.price[key]),
        num: Number(values.num[key] ? values.num[key] : 0),
        extra: values.extra[key],
      }));
      obj.des = tempDes.filter(el => el.product !== '');
      // console.log(obj);
      onOk(obj);
      this.hideModelHandler();
    });
  };

  render() {
    const { des, visible } = this.state;
    const { form, children, record, product } = this.props;
    const { getFieldDecorator, getFieldValue } = form;

    const iniKeys = des && des.length > 0 ? des.map((el, index) => index) : [];
    getFieldDecorator('keys', { initialValue: iniKeys });
    const keys = getFieldValue('keys');

    // console.log('keys', keys);

    const total = [];
    des.forEach((el, index) => {
      const num = getFieldValue(`num[${index}]`) || el.num || 0;
      const price = getFieldValue(`price[${index}]`) || el.price || 0;
      total.push((Number(num) * Number(price)).toFixed(2));
      // console.log(num, price);
    });

    const formItemLayout = { labelCol: { span: 5 }, wrapperCol: { span: 18 } };

    const formItems = keys.map((k, index) => (
      <Fragment key={k}>
        <Divider style={{ marginTop: 0, marginBottom: 10 }} />
        <Row key={k}>
          <Col span={3}>
            {des[k].id ? (
              des[k].product && <span>{des[k].product.name}</span>
            ) : (
              <AutoComplete
                allowClear
                style={{ width: 110 }}
                onSelect={this.onSelect}
                onSearch={this.handleSearch}
                onFocus={() => this.handleFocus(index)}
                placeholder="产品首字母搜索"
                dropdownMatchSelectWidth={false}
                dropdownStyle={{ width: 200 }}
                value={des[k].product ? des[k].product.name : ''}
              >
                {product && product.list.map(el => <Option key={el.id}>{el.name}</Option>)}
              </AutoComplete>
            )}
          </Col>
          <Col span={6}>
            {des.length === 0 || des[k].cover === null || typeof des[k].cover === 'undefined'
              ? ''
              : des[k].cover
                  .split(',')
                  .map(el => (
                    <Avatar
                      key={el}
                      src={el}
                      shape="square"
                      size="large"
                      style={{ marginRight: 5, marginBottom: 5 }}
                    />
                  ))}
          </Col>
          <Col span={3}>
            <p>{des[k].intro}</p>
          </Col>
          <Col span={3}>
            <FormItem {...formItemLayout}>
              {form.getFieldDecorator(`price[${k}]`, {
                initialValue: des[k].price,
              })(<NumericInput placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col span={3}>
            <FormItem {...formItemLayout}>
              {form.getFieldDecorator(`num[${k}]`, {
                initialValue: des[k].num,
              })(<NumericInput placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col span={2}>
            <p style={{ lineHeight: '35px', padding: 0 }}>{total ? total[k] : ''}</p>
          </Col>
          <Col span={3}>
            <FormItem {...formItemLayout}>
              {form.getFieldDecorator(`extra[${k}]`, {
                initialValue: des[k].extra,
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col span={1}>
            <Button
              type="primary"
              shape="circle"
              icon="delete"
              size="small"
              onClick={() => this.remove(k, index)}
            />
          </Col>
        </Row>
      </Fragment>
    ));

    return (
      <span>
        <span onClick={this.showModelHandler}>{children}</span>
        <Modal
          width={1100}
          destroyOnClose
          centered
          title="销售合同编辑"
          bodyStyle={{ maxHeight: 'calc(100vh - 250px)', overflow: 'auto' }}
          visible={visible}
          maskClosable={false}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
        >
          <Row>
            <Col span={8}>
              <div className={styles.itemCol}>
                客户名称:{' '}
                <span style={{ color: '#333' }}>{record.client ? record.client.name : ''}</span>
              </div>
              <div className={styles.itemCol}>
                合同编号: <span style={{ color: '#333' }}>{record.sn}</span>
              </div>
            </Col>
            <Col span={8}>
              <div className={styles.itemCol}>
                询盘编号:
                <span style={{ color: '#333' }} />
              </div>
              <div className={styles.itemCol}>
                样品: <Checkbox onChange={this.onSimpleChange} checked={Boolean(record.sample)} />
              </div>
            </Col>
            <Col span={8}>
              <div className={styles.itemCol}>创建日期:</div>
              <div className={styles.itemCol} />
            </Col>
          </Row>
          {/* <Divider style={{ marginTop: 10, marginBottom: 0 }} /> */}
          <Row
            gutter={8}
            style={{ marginTop: 10, height: 40, lineHeight: '40px', backgroundColor: '#f3f3f3' }}
          >
            <Col span={3}>
              <div>产品名称</div>
            </Col>
            <Col span={6}>
              <div>图片</div>
            </Col>
            <Col span={3}>
              <div>描述</div>
            </Col>
            <Col span={3}>
              <div>单价(￥)</div>
            </Col>
            <Col span={3}>
              <div>数量</div>
            </Col>
            <Col span={2}>
              <div>总计(￥)</div>
            </Col>
            <Col span={3}>
              <div>备注</div>
            </Col>
            <Col span={1}>
              <div>操作</div>
            </Col>
          </Row>
          <Form>
            <div style={{ maxHeight: 300, overflow: 'auto' }}>
              {formItems}
              <div style={{ marginTop: 15 }}>
                <Button type="primary" shape="circle" icon="plus" size="large" onClick={this.add} />
              </div>
            </div>
            <Divider style={{ marginTop: 10, marginBottom: 10 }} />
            <Row>
              <Col span={8}>
                <FormItem label="发货港" {...formItemLayout}>
                  {form.getFieldDecorator('port_l', {
                    initialValue: record.port_l,
                  })(<Input placeholder="请输入" autoComplete="off" />)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="目的港" {...formItemLayout}>
                  {form.getFieldDecorator('port_d', {
                    initialValue: record.port_d,
                  })(<Input placeholder="请输入" autoComplete="off" />)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="发货日期" {...formItemLayout}>
                  {form.getFieldDecorator('delivery', {
                    initialValue: moment(record.delivery, 'YYYY-MM-DD HH:mm:ss'),
                  })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" placeholder="选择日期" />)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="支付条款" {...formItemLayout}>
                  {form.getFieldDecorator('terms', {
                    initialValue: record.terms,
                  })(<TextArea rows={4} placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="包装" {...formItemLayout}>
                  {form.getFieldDecorator('packing', {
                    initialValue: record.packing,
                  })(<TextArea rows={4} placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="贸易条款" {...formItemLayout}>
                  {form.getFieldDecorator('trade', {
                    initialValue: record.trade,
                  })(<TextArea rows={4} placeholder="请输入" />)}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
      </span>
    );
  }
}
