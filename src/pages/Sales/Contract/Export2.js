import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';

import { Row, Col, Card, Form, Input, DatePicker, Button, AutoComplete, Divider } from 'antd';
import Debounce from 'lodash-decorators/debounce';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import NumericInput from '@/components/common/NumericInput';

import styles from './Index.less';

// eslint-disable-next-line no-unused-vars
let id = 0;
// const { TextArea } = Input;
const FormItem = Form.Item;
const { Option } = AutoComplete;
const { TextArea } = Input;

@connect(({ purchase, salesContract, product }) => ({
  purchase,
  salesContract,
  product,
  // loading: loading.effects['chart/fetch'],
}))
@Form.create()
class ContractInsert extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ordate: '',
      curIndex: 0,
      client: '',
      simple: false,
      // sn: '',
      des: [{ name: '', shape: '', cover: '', intro: '', price: '', num: '', extra: '' }],
    };
  }

  componentDidMount() {
    const { des } = this.state;
    const { dispatch } = this.props;
    id = des.length;
    dispatch({ type: 'purchase/fetchSn' });
  }

  remove = k => {
    // 更新id值
    id -= 1;
    const { des } = this.state;
    const arr = [...des];
    arr.splice(k, 1);
    console.log('arr', arr);
    this.setState({
      des: arr,
    });
  };

  add = () => {
    const { des } = this.state;
    this.setState({
      des: [...des, { name: '', cover: '', intro: '', price: '', num: '', extra: '' }],
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
        name: row.name,
        product: row.id,
        cover: row.cover.join(','),
        license: row.license,
        company: row.company,
        type: row.type,
        start: row.start,
        end: row.end,
        intro: row.intro,
        price: row.price,
        shape: row.shape,
        sn: row.sn,
        currentnum: row.num,
        extra: row.extra,
      };

      const arr = [...des];
      arr.splice(curIndex, 1, obj);
      this.setState({ des: arr });
      console.log(arr);
    }
  };

  // 是否样品
  onSimpleChange = e => {
    this.setState({
      simple: e.target.checked,
    });
  };

  handleFocus = index => {
    this.setState({
      curIndex: index,
    });
  };

  // 表单提交
  handleSubmit = e => {
    e.preventDefault();
    const {
      form,
      dispatch,
      purchase: { sn },
    } = this.props;
    const { ordate, client, des, simple } = this.state;
    form.validateFields((err, values) => {
      if (!err) {
        const obj = {
          sn,
          ordate,
          client,
          sample: Number(simple),
          packing: values.packing,
          terms: values.terms,
          delivery: moment(values.delivery).format('YYYY-MM-DD'),
          port_l: values.port_l,
          port_d: values.port_d,
          trade: values.trade,
          des: des.map((el, index) => {
            const idx = values.keys[index];
            const formVal = {
              product: el.product ? el.product : '',
              price: Number(values.price[idx]),
              num: values.num[idx],
            };
            return formVal;
          }),
        };
        dispatch({ type: 'salesContract/create', payload: obj });
        // console.log(values, obj);
      }
    });
  };

  // 合同搜索
  @Debounce(800)
  handleSearch = value => {
    const { dispatch } = this.props;
    if (value) {
      dispatch({ type: 'product/fetch', payload: { abbr: value } });
    }
  };

  @Debounce(500)
  handleClientSearch = value => {
    const { dispatch } = this.props;
    if (value) {
      dispatch({ type: 'salesContract/fetchClientOption', payload: { abbr: value } });
    }
  };

  onSelectClient = value => {
    this.setState({
      client: value,
    });
  };

  onDateChange = (date, dateString) => {
    this.setState({
      ordate: dateString,
    });
  };

  // // 合同编号
  // onContractChange = e => {
  //   this.setState({
  //     sn: e.target.value,
  //   });
  // };

  render() {
    const {
      product,
      salesContract,
      purchase: { sn },
      form,
    } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const formItemLayout = { labelCol: { span: 5 }, wrapperCol: { span: 18 } };
    const { des } = this.state;

    const iniKeys = des && des.length > 0 ? des.map((el, index) => index) : [];
    // console.log(des)
    // console.log(iniKeys)
    getFieldDecorator('keys', { initialValue: iniKeys });
    const keys = getFieldValue('keys');
    // console.log('keys', keys);
    const total = [];
    des.forEach((el, index) => {
      const num = getFieldValue(`num[${index}]`) || el.num;
      const price = getFieldValue(`price[${index}]`) || el.price;
      total.push((Number(num) * Number(price)).toFixed(2));
      // console.log(num, price, express);
    });

    const formItems = keys.map((k, index) => (
      <Fragment key={k}>
        <Row className={styles.rowTableForm} style={{ minHeight: 50, lineHeight: '50px' }}>
          <Col span={2}>
            <div>{k + 1}</div>
          </Col>

          <Col span={2}>
            <FormItem {...formItemLayout}>
              {des[k].name ? (
                <span>{des[k].name}</span>
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
                >
                  {product &&
                    product.list.map(el => (
                      <Option key={el.id}>
                        {el.shape}-{el.name}
                      </Option>
                    ))}
                </AutoComplete>
              )}
            </FormItem>
          </Col>

          <Col span={1}>
            <FormItem {...formItemLayout}>
              <span>{des[k].sn}</span>
            </FormItem>
          </Col>
          <Col span={1}>
            <FormItem {...formItemLayout}>
              <span>{des[k].shape}</span>
            </FormItem>
          </Col>
          <Col span={2}>
            <FormItem {...formItemLayout}>
              <span>{des[k].intro}</span>
            </FormItem>
          </Col>
          <Col span={1}>
            <FormItem {...formItemLayout}>
              <span>{des[k].license}</span>
            </FormItem>
          </Col>
          <Col span={1}>
            <FormItem {...formItemLayout}>
              <span>{des[k].company}</span>
            </FormItem>
          </Col>
          <Col span={1}>
            <FormItem {...formItemLayout}>
              <span>{des[k].sn}</span>
            </FormItem>
          </Col>

          <Col span={1}>
            <FormItem {...formItemLayout}>
              <span>{des[k].type}</span>
            </FormItem>
          </Col>
          <Col span={1}>
            <FormItem {...formItemLayout}>
              <span>{des[k].start}</span>
            </FormItem>
          </Col>

          <Col span={1}>
            <FormItem {...formItemLayout}>
              <span>{des[k].end}</span>
            </FormItem>
          </Col>
          <Col span={1}>
            <FormItem {...formItemLayout}>
              <span>{des[k].currentnum}</span>
            </FormItem>
          </Col>
          <Col span={1}>
            <FormItem {...formItemLayout}>
              <span>{des[k].currentnum}</span>
            </FormItem>
          </Col>

          <Col span={1}>
            <FormItem {...formItemLayout}>
              {form.getFieldDecorator(`num[${k}]`, {
                rules: [{ required: true, message: '是必填项' }],
                initialValue: des[k].num,
                // })(<Input placeholder="数量" autoComplete="off" />)}
              })(<NumericInput placeholder="数量" />)}
            </FormItem>
          </Col>

          <Col span={1}>
            <FormItem {...formItemLayout}>
              {form.getFieldDecorator(`price[${k}]`, {
                rules: [{ required: true, message: '是必填项' }],
                initialValue: des[k].price,
                // })(<Input placeholder="数量" autoComplete="off" />)}
              })(<NumericInput placeholder="售价" />)}
            </FormItem>
          </Col>

          <Col span={3}>
            <div>{total ? total[k] : ''}</div>
          </Col>

          <Col>
            <div>
              <Button
                type="primary"
                shape="circle"
                icon="delete"
                size="small"
                onClick={() => this.remove(k, index)}
              />
            </div>
          </Col>
        </Row>
      </Fragment>
    ));

    return (
      <PageHeaderWrapper title="">
        <Card bordered={false}>
          <Row style={{ height: 40, lineHeight: '40px' }}>
            <Col span={3}>
              {sn}
              &nbsp;&nbsp;
            </Col>

            <Col span={4}>
              客户&nbsp;&nbsp;
              <AutoComplete
                allowClear
                // style={{ width: 110 }}
                onSelect={this.onSelectClient}
                onSearch={this.handleClientSearch}
                placeholder="客户搜索"
                dropdownMatchSelectWidth={false}
                dropdownStyle={{ width: 200 }}
              >
                {salesContract &&
                  salesContract.clients.map(el => <Option key={el.id}>{el.name}</Option>)}
              </AutoComplete>
            </Col>

            <Col span={10}>
              时间&nbsp;&nbsp;
              <DatePicker
                format="YYYY-MM-DD HH:mm:ss"
                onChange={this.onDateChange}
                placeholder="选择单据时间"
                defaultValue={moment()}
              />
            </Col>
          </Row>
          <Row className={styles.RowTableHeader}>
            <Col span={2}>
              <div>序号</div>
            </Col>
            <Col span={1}>
              <div>存货编码</div>
            </Col>
            <Col span={2}>
              <div>存货名称</div>
            </Col>
            <Col span={1}>
              <div>规格</div>
            </Col>
            {/* <Col span={1}>
              <div>图片</div>
            </Col> */}
            <Col span={1}>
              <div>经营范围</div>
            </Col>
            <Col span={2}>
              <div>生产许可证</div>
            </Col>
            <Col span={1}>
              <div>生产企业</div>
            </Col>
            <Col span={1}>
              <div>批准文号</div>
            </Col>
            <Col span={1}>
              <div>单位</div>
            </Col>
            <Col span={1}>
              <div>生产</div>
            </Col>
            <Col span={1}>
              <div>有效</div>
            </Col>
            <Col span={1}>
              <div>可用</div>
            </Col>
            <Col span={1}>
              <div>批号</div>
            </Col>
            <Col span={1}>
              <div>数量</div>
            </Col>
            <Col span={1}>
              <div>零售价</div>
            </Col>
            <Col span={1}>
              <div>合计</div>
            </Col>

            <Col>
              <div>操作</div>
            </Col>
          </Row>
          <Form onSubmit={this.handleSubmit}>
            <div style={{ height: 'calc(100vh - 400px)', overflow: 'auto' }}>
              {formItems}
              <div style={{ marginTop: 15 }}>
                <Button type="primary" shape="circle" icon="plus" size="large" onClick={this.add} />
              </div>
            </div>
            <Divider style={{ marginTop: 10, marginBottom: 10 }} />

            <Row>
              <Col span={8}>
                <FormItem label="制单人" {...formItemLayout}>
                  {form.getFieldDecorator('port_l', {
                    rules: [{ required: true, message: '是必填项' }],
                    initialValue: '',
                  })(<Input placeholder="请输入" autoComplete="off" />)}
                </FormItem>
              </Col>

              {/* <Col span={8}>
                <FormItem label="发货日期" {...formItemLayout}>
                  {form.getFieldDecorator('delivery', {
                    rules: [{ required: true, message: '是必填项' }],
                  })(<DatePicker format="YYYY-MM-DD" placeholder="选择发货日期" />)}
                </FormItem>
              </Col> */}
              <Col span={8}>
                <FormItem label="备注" {...formItemLayout}>
                  {form.getFieldDecorator('terms', {
                    rules: [{ required: true, message: '是必填项' }],
                    initialValue: '',
                  })(<TextArea rows={4} placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="审核人" {...formItemLayout}>
                  {form.getFieldDecorator('packing', {
                    rules: [{ required: true, message: '是必填项' }],
                    initialValue: '',
                  })(<TextArea rows={4} placeholder="请输入" />)}
                </FormItem>
              </Col>
            </Row>
            <Row style={{ height: 50, lineHeight: '50px' }}>
              <Col span={8}>
                合计: {total.length > 0 ? total.reduce((pre, current) => pre + current) : ''}
              </Col>
              <Col span={2} offset={14}>
                <Button type="primary" htmlType="submit">
                  提交
                </Button>
              </Col>
            </Row>

            <Row>
              {/* <Col span={8}>
                <FormItem label="发货港" {...formItemLayout}>
                  {form.getFieldDecorator('port_l', {
                    rules: [{ required: true, message: '是必填项' }],
                    initialValue: '',
                  })(<Input placeholder="请输入" autoComplete="off" />)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="目的港" {...formItemLayout}>
                  {form.getFieldDecorator('port_d', {
                    rules: [{ required: true, message: '是必填项' }],
                    initialValue: '',
                  })(<Input placeholder="请输入" autoComplete="off" />)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="发货日期" {...formItemLayout}>
                  {form.getFieldDecorator('delivery', {
                    rules: [{ required: true, message: '是必填项' }],
                  })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" placeholder="选择日期" />)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="支付条款" {...formItemLayout}>
                  {form.getFieldDecorator('terms', {
                    rules: [{ required: true, message: '是必填项' }],
                    initialValue: '',
                  })(<TextArea rows={4} placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="包装" {...formItemLayout}>
                  {form.getFieldDecorator('packing', {
                    rules: [{ required: false, message: '是必填项' }],
                    initialValue: '',
                  })(<TextArea rows={4} placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="贸易条款" {...formItemLayout}>
                  {form.getFieldDecorator('trade', {
                    rules: [{ required: true, message: '是必填项' }],
                    initialValue: '',
                  })(<TextArea rows={4} placeholder="请输入" />)}
                </FormItem>
              </Col> */}
            </Row>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ContractInsert;
