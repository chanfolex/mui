import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';

import {
  Row,
  Col,
  Card,
  Form,
  Input,
  DatePicker,
  Button,
  AutoComplete,
  Divider,
  Select,
  Modal,
  Table,
} from 'antd';
import Debounce from 'lodash-decorators/debounce';
// eslint-disable-next-line import/extensions
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// eslint-disable-next-line import/extensions
import NumericInput from '@/components/common/NumericInput';

import styles from './Index.less';

// eslint-disable-next-line no-unused-vars
let id = 0;
// const { TextArea } = Input;
const FormItem = Form.Item;
const { Option } = AutoComplete;

@connect(({ salesContract, product }) => ({
  salesContract,
  product,
  // loading: loading.effects['chart/fetch'],
}))
@Form.create()
class SaleContractInsert extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ordate: '',
      curIndex: 0,
      supporter: '',
      searchModalState: false,
      // storage: '',
      // contractSn: '',
      storages: [],
      categorys: [{ name: '全部分类' }],
      products: [],
      categoryIndex: null,
      storageIndex: null,
      searchContent: null,
      des: [{ name: '', shape: '', cover: '', intro: '', price: '', num: '', extra: '' }],
    };
    // 无需更新页面
    this.selectedRows = [];
  }

  componentDidMount() {
    const { des } = this.state;
    const { dispatch } = this.props;
    id = des.length;
    dispatch({ type: 'salesContract/fetchPurchaseSn' });

    dispatch({
      type: 'salesContract/fetchStorageOption',
    }).then(res => {
      if (res.code === 200) {
        this.setState({
          storages: res.data,
        });
      }
    });

    dispatch({
      type: 'salesContract/fetchCategoryOption',
    }).then(res => {
      if (res.code === 200) {
        this.setState({ categorys: [{ name: '全部类别' }].concat(res.data) });
      }
    });

    this.getProduction({});
  }

  getProduction = () => {
    const { storageIndex, categoryIndex, searchContent, storages, categorys } = this.state;
    const { dispatch } = this.props;
    const params = {};
    if (searchContent) {
      params.abbr = searchContent;
      if ((storageIndex || storageIndex === 0) && (categoryIndex || categoryIndex === 0)) {
        params.storage = storages[storageIndex].id;
        params.category = categorys[categoryIndex].id;
      } else if (storageIndex || storageIndex === 0) {
        params.storage = storages[storageIndex].id;
      } else if (categoryIndex || categoryIndex === 0) {
        params.category = categorys[categoryIndex].id;
      }
    } else if (storageIndex || storageIndex === 0) {
      if (categoryIndex || categoryIndex === 0) {
        params.storage = storages[storageIndex].id;
        params.category = categorys[categoryIndex].id;
      } else {
        params.storage = storages[storageIndex].id;
      }
    } else if (categoryIndex || categoryIndex === 0) {
      params.category = categorys[categoryIndex].id;
    }
    console.log(params);
    dispatch({
      type: `product/fetchProductOption`,
      payload: params,
    }).then(res => {
      if (res.code === 200) {
        this.setState({ products: res.data });
      }
    });
  };

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
        intro: row.intro,
        license: row.license,
        company: row.company,
        type: row.category,
        start: row.start,
        end: row.end,
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
      salesContract: { contractSn },
    } = this.props;
    const { ordate, supporter, des } = this.state;
    form.validateFields((err, values) => {
      if (!err) {
        const obj = {
          contractSn,
          ordate,
          supporter,
          storage: values.storage,
          payment: values.payment,
          extra: values.extra,
          packing: values.packing,
          des: des.map((el, index) => {
            const idx = values.keys[index];
            const formVal = {
              product: el.product ? el.product : '',
              price: Number(values.price[idx]),
              num: values.num[idx],
              batch: values.batch[idx],
              start: values.start[idx],
              end: values.end[idx],
              supporter: 1,
              storage: 1,
              extra: values.extra[idx],
            };
            return formVal;
          }),
        };
        dispatch({ type: 'purchase/create', payload: obj });
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
      dispatch({ type: 'product/fetchSupporterOption', payload: { abbr: value } });
    }
  };

  onSelectClient = value => {
    this.setState({
      supporter: value,
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

  // // 合同编号
  // onStorageChange = e => {
  //   this.setState({
  //     storage: e.target.value,
  //   });
  // };

  openSearchModal = () => {
    this.setState({
      searchModalState: true,
    });
  };

  selectCategory = (item, index) => {
    if (index) {
      this.setState({ categoryIndex: index });
    } else {
      this.setState({ categoryIndex: null });
    }
    setTimeout(() => this.getProduction({}), 10);
  };

  selectStorage = value => {
    if (value) {
      this.setState({
        storageIndex: value - 1,
      });
    } else {
      this.setState({
        storageIndex: null,
      });
    }
    setTimeout(() => this.getProduction({}), 10);
  };

  hideModal = () => {
    this.setState({
      searchModalState: false,
    });
  };

  searchContent = e => {
    this.setState({
      searchContent: e.target.value,
    });
  };

  render() {
    const {
      product,
      form,
      salesContract: { contractSn },
    } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const formItemLayout = { labelCol: { span: 5 }, wrapperCol: { span: 18 } };
    const { des, storages, searchModalState, categorys, products, categoryIndex } = this.state;

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
                        {el.name}-{el.name}
                      </Option>
                    ))}
                </AutoComplete>
              )}
            </FormItem>
          </Col>
          <Col span={1}>
            <Button
              type="primary"
              shape="circle"
              icon="search"
              onClick={() => this.openSearchModal()}
            />
          </Col>
          <Col span={1}>
            <FormItem {...formItemLayout}>
              <span>{des[k].sn}</span>
            </FormItem>
          </Col>
          <Col span={1}>
            <FormItem {...formItemLayout}>
              <span>{des[k].intro}</span>
            </FormItem>
          </Col>

          <Col span={1}>
            <FormItem {...formItemLayout}>
              <span>{des[k].shape}</span>
            </FormItem>
          </Col>

          <Col span={2}>
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
              <span>{des[k].category}</span>
            </FormItem>
          </Col>

          <Col span={1}>
            <FormItem {...formItemLayout}>
              <span>{des[k].currentnum}</span>
            </FormItem>
          </Col>

          {/* <Col span={2}>
            {des.length === 0 || des[k].cover === null
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
          </Col> */}

          <Col span={1}>
            <FormItem {...formItemLayout}>
              {form.getFieldDecorator(`batch[${k}]`, {
                rules: [{ required: true, message: '是必填项' }],
                // })(<Input placeholder="数量" autoComplete="off" />)}
              })(<NumericInput placeholder="批号" />)}
            </FormItem>
          </Col>
          <Col span={1}>
            <FormItem {...formItemLayout}>
              {form.getFieldDecorator(`start[${k}]`, {
                rules: [{ required: true, message: '是必填项' }],
                // })(<Input placeholder="数量" autoComplete="off" />)}
              })(<NumericInput placeholder="生产日期" />)}
            </FormItem>
          </Col>
          <Col span={1}>
            <FormItem {...formItemLayout}>
              {form.getFieldDecorator(`end[${k}]`, {
                rules: [{ required: true, message: '是必填项' }],
                // })(<Input placeholder="数量" autoComplete="off" />)}
              })(<NumericInput placeholder="有效日期" />)}
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
    const columns = [
      {
        title: '产品名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '产品批号',
        dataIndex: 'sn',
        key: 'sn',
      },
      {
        title: '库存数量',
        dataIndex: 'num',
        key: 'num',
      },
    ];
    const dataSource = (products && products.list) || [];
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        this.selectedRows = selectedRows;
      },
    };
    return (
      <PageHeaderWrapper title="">
        <Card bordered={false}>
          <Row style={{ height: 40, lineHeight: '40px' }}>
            <Col span={3}>{contractSn}</Col>
            {/* 
            <Col span={3}>
              
              {form.getFieldDecorator('storage', {
                rules: [{ required: true, message: '是必填项' }],
              })(<Input placeholder="仓库" onChange={this.onStorageChange} autoComplete="off" />)}
            </Col> */}
            <Col span={2}>
              仓库&nbsp;&nbsp;
              {form.getFieldDecorator('storage', {
                rules: [{ required: true, message: '仓库是必填项' }],
                // initialValue: formVals.category,
              })(
                <Select allowClear placeholder="请选择仓库" style={{ width: 100 }}>
                  {storages.map(el => (
                    <Option key={el.id} value={el.id}>
                      {el.name}
                    </Option>
                  ))}
                </Select>
              )}
            </Col>
            &nbsp;&nbsp;
            <Col span={4}>
              供应商&nbsp;&nbsp;
              <AutoComplete
                allowClear
                // style={{ width: 110 }}
                onSelect={this.onSelectClient}
                onSearch={this.handleClientSearch}
                placeholder="首字母供应商搜索"
                dropdownMatchSelectWidth={false}
                dropdownStyle={{ width: 100 }}
              >
                {product && product.supporters.map(el => <Option key={el.id}>{el.name}</Option>)}
              </AutoComplete>
            </Col>
            <Col span={10}>
              日期&nbsp;&nbsp;
              <DatePicker
                format="YYYY-MM-DD HH:mm:ss"
                onChange={this.onDateChange}
                placeholder="选择单据时间"
                defaultValue={moment()}
              />
            </Col>
          </Row>
          <Row className={styles.RowTableHeader}>
            <Col span={1}>
              <div>序号</div>
            </Col>
            <Col span={2}>
              <div>存货编码</div>
            </Col>
            <Col span={2}>
              <div>存货名称</div>
            </Col>
            <Col span={1}>
              <div>经营范围</div>
            </Col>

            <Col span={1}>
              <div>规格</div>
            </Col>
            {/* <Col span={1}>
              <div>图片</div>
            </Col> */}

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
              <div>可用数量</div>
            </Col>
            <Col span={1}>
              <div>批号</div>
            </Col>
            <Col span={1}>
              <div>生产日期</div>
            </Col>
            <Col span={1}>
              <div>有效日期</div>
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
                <FormItem label="备注" {...formItemLayout}>
                  {form.getFieldDecorator('extra', {
                    rules: [{ required: true, message: '是必填项' }],
                    initialValue: '',
                  })(<Input placeholder="请输入" autoComplete="off" />)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="制单人" {...formItemLayout}>
                  {form.getFieldDecorator('payment', {
                    rules: [{ required: true, message: '是必填项' }],
                    initialValue: '',
                  })(<Input placeholder="请输入" autoComplete="off" />)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="审核人" {...formItemLayout}>
                  {form.getFieldDecorator('packing', {
                    rules: [{ required: true, message: '是必填项' }],
                    initialValue: '',
                  })(<Input placeholder="请输入" autoComplete="off" />)}
                </FormItem>
              </Col>
              {/* <Col span={8}>
                <FormItem label="审核人" {...formItemLayout}>
                  {form.getFieldDecorator('delivery', {
                    rules: [{ required: true, message: '是必填项' }],
                  })(<DatePicker format="YYYY-MM-DD" placeholder="选择发货日期" />)}
                </FormItem>
              </Col> */}
              {/* <Col span={8}>
                <FormItem label="审核日期" {...formItemLayout}>
                  {form.getFieldDecorator('terms', {
                    rules: [{ required: true, message: '是必填项' }],
                    initialValue: '',
                  })(<TextArea rows={4} placeholder="请输入" />)}
                </FormItem>
              </Col> */}
              {/* <Col span={8}>
                <FormItem label="包装" {...formItemLayout}>
                  {form.getFieldDecorator('packing', {
                    rules: [{ required: true, message: '是必填项' }],
                    initialValue: '',
                  })(<TextArea rows={4} placeholder="请输入" />)}
                </FormItem>
              </Col> */}
              {/* <Col span={8}>
                <FormItem label="贸易条款" {...formItemLayout}>
                  {form.getFieldDecorator('trade', {
                    rules: [{ required: true, message: '是必填项' }],
                    initialValue: '',
                  })(<TextArea rows={4} placeholder="请输入" />)}
                </FormItem>
              </Col> */}
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
        <Modal
          title="产品查询"
          visible={searchModalState}
          onOk={this.hideModal}
          maskClosable={false}
          width={1024}
          onCancel={this.hideModal}
          footer={false}
        >
          <div className={styles.searchModalHeader}>
            <div>
              <Select
                allowClear
                placeholder="请选择仓库"
                style={{ width: 200 }}
                onChange={this.selectStorage}
              >
                {storages.map(el => (
                  <Option key={el.id} value={el.id}>
                    {el.name}
                  </Option>
                ))}
              </Select>
            </div>
            <div>
              <Input
                placeholder="产品拼音首字母搜索"
                onChange={this.searchContent}
                onPressEnter={this.getProduction}
              />
            </div>
          </div>
          <div
            style={{
              borderTop: '1px solid #f3f3f3',
              borderBottom: '1px solid #f3f3f3',
              display: 'flex',
            }}
          >
            <Col
              span={8}
              style={{
                borderLeft: '1px solid #f3f3f3',
                borderRight: '1px solid #f3f3f3',
                padding: 15,
              }}
            >
              <div>产品分类</div>
              <div style={{ background: '#f3f3f3' }} className={styles.searchModalLeft}>
                {categorys.map((item, index) => (
                  <div
                    key={item.name}
                    className={
                      categoryIndex === index || (!categoryIndex && !index)
                        ? styles.searchModalLeftListIndexItem
                        : styles.searchModalLeftListItem
                    }
                    onClick={() => this.selectCategory(item, index)}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            </Col>
            <Col span={16} style={{ borderRight: '1px solid #f3f3f3', padding: 15 }}>
              <Table
                rowSelection={rowSelection}
                dataSource={dataSource}
                columns={columns}
                pagination={false}
              />
              ;
            </Col>
          </div>
          <div className={styles.searchModalFooter}>
            <Button>提交</Button>
            <Button type="primary">确认</Button>
          </div>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default SaleContractInsert;
