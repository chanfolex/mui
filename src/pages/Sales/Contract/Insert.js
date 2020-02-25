import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import Dayjs from 'dayjs';
// eslint-disable-next-line import/order
import PrintModal from '../../Print/PrintInsertModal';

import {
  Row,
  Col,
  // Card,
  Form,
  Input,
  DatePicker,
  Button,
  AutoComplete,
  InputNumber,
  // Divider,
  message,
  Select,
  Modal,
  Table,
} from 'antd';
import Debounce from 'lodash-decorators/debounce';
// eslint-disable-next-line import/extensions
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// eslint-disable-next-line import/extensions
// import NumericInput from '@/components/common/NumericInput';

import styles from './Index.less';

// eslint-disable-next-line no-unused-vars
let id = 0;
// const { TextArea } = Input;
const FormItem = Form.Item;
const { Option } = AutoComplete;

@connect(({ salesContract, product, purchase }) => ({
  salesContract,
  product,
  purchase,
  // loading: loading.effects['chart/fetch'],
}))
@Form.create()
class SaleContractInsert extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ordate: `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDay()}`,
      curIndex: 0,
      supporter: '',
      searchModalState: false,
      // storage: '',
      // contractSn: '',
      storages: [],
      users: [],
      categorys: [{ name: '全部分类' }],
      selectedRowKeys: [],
      products: [],
      categoryIndex: null,
      storageIndex: null,
      searchContent: null,
      selectStorages: null,
      itemIndex: null,
      totalSum: 0,
      page: 1,
      printRecordData: {},
      showModel: false,
      // jsuerValue: null,
      des: [1, 2, 3].map(() => ({
        name: '',
        cover: '',
        intro: '',
        price: '',
        price_fob: '',
        num: '',
        extra: '',
        prodcution: '',
        shape: '',
        license: '',
        company: '',
        sn: '',
        currentnum: '',
        batch: '',
        start: '',
        best: '',
        unit: '',
        barsn: '',
      })),
    };
    // 无需更新页面
    this.selectedRows = [];
    this.recordDataList = [];
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
      type: 'salesContract/fetchUserOption',
    }).then(res => {
      if (res.code === 200) {
        this.setState({
          users: res.data,
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
    const { storageIndex, categoryIndex, searchContent, storages, categorys, page } = this.state;
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
    if (page) params.pagination = page;
    dispatch({
      type: `product/fetchProductOption`,
      payload: params,
    }).then(res => {
      if (res.code === 200) {
        this.setState({ products: res.data, totalSum: res.data.sum });
      }
    });
  };

  remove = k => {
    const { des } = this.state;
    if (des.length === 1) return message.warning('请至少填写一个产品信息');
    // 更新id值
    id -= 1;
    const arr = [...des];
    arr.splice(k, 1);
    this.setState({ des: arr });
    return null;
  };

  add = () => {
    const { des } = this.state;
    this.setState({
      des: [
        ...des,
        {
          name: '',
          cover: '',
          intro: '',
          price: '',
          price_fob: '',
          num: '',
          extra: '',
          prodcution: '',
          pack: '',
          shape: '',
          license: '',
          company: '',
          sn: '',
          currentnum: '',
          batch: '',
          start: '',
          best: '',
          unit: '',
          barsn: '',
        },
      ],
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
        pack: row.pack,
        shape: row.shape,
        sn: row.sn,
        currentnum: row.num,
        price_fob: row.price_fob,
        price: row.price,
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
      product,
      salesContract: { contractSn },
    } = this.props;
    const { ordate, supporter, des, juserValue } = this.state;
    form.validateFields((err, values) => {
      if (!err) {
        if (!des.length) return message.warning('请至少填写一个产品信息');
        if (!des.some(item => item.numValue && item.priceValue)) {
          return message.warning('您选择的产品价格或数量未填写完整');
        }
        const filterData = des.filter(item => item.numValue && item.priceValue);
        const obj = {
          contractSn,
          ordate,
          supporter,
          // storage: storageValue,
          juser: juserValue,
          payment: values.payment,
          extra: values.extra,
          packing: values.packing,
          sn: contractSn,
          client: product.supporters.filter(item => {
            // eslint-disable-next-line eqeqeq
            if (item.id == supporter) return true;
            return false;
          })[0].name,
          ctime: ordate,
          des: filterData.map(el => {
            const formVal = {
              shape: el.shape || el.product.shape || '',
              name: el.name || el.product.name || '',
              product: el.id ? el.id : '',
              price: el.priceValue,
              num: el.numValue,
              batch: el.batch || el.batchValue,
              start: el.date || '',
              supporter: 1,
              storage: 1,
              extra: values.extra,
            };
            return formVal;
          }),
        };
        return dispatch({ type: 'prepurchase/createInsert', payload: obj }).then(() => {
          message.success('添加成功');
          this.clearFromData();
          this.openPrintModel(obj);
        });
      }
      return message.warning('您还有必填项未填');
    });
  };

  // 控制model关闭
  controlHideModelHandler = () => {
    this.setState({
      showModel: false,
    });
  };

  // 打卡打印Model
  openPrintModel = obj => {
    this.setState({
      printRecordData: obj,
      showModel: true,
    });
  };

  // 清除页面表单数据
  clearFromData = () => {
    const { form } = this.props;
    this.setState({
      des: [1, 2, 3].map(() => ({
        name: '',
        cover: '',
        intro: '',
        price: '',
        price_fob: '',
        num: '',
        extra: '',
        prodcution: '',
        shape: '',
        license: '',
        company: '',
        sn: '',
        currentnum: '',
        batch: '',
        start: '',
        best: '',
        unit: '',
        barsn: '',
      })),
      juserValue: null,
      supporter: '',
    });
    form.resetFields();
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
      dispatch({ type: 'product/fetchSupporterOption', payload: { abbr: value } }).then(res => {
        if (res && !res.data.length) return message.warning('搜索结果不存在');
        return null;
      });
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

  openSearchModal = index => {
    console.log(index);
    this.setState({ searchModalState: true, itemIndex: index });
  };

  selectCategory = (item, index) => {
    this.setState({ page: 1 });
    if (index) {
      this.setState({ categoryIndex: index });
    } else {
      this.setState({ categoryIndex: null });
    }
    setTimeout(() => {
      this.getProduction({});
      this.recordData();
    }, 10);
  };

  selectStorage = value => {
    const { storages } = this.state;
    if (value) {
      this.setState({
        storageIndex: value.split('//')[1],
        selectStorages: storages[value.split('//')[1]].name,
      });
    } else {
      this.setState({
        selectStorages: null,
        storageIndex: null,
      });
    }
    setTimeout(() => this.getProduction({}), 10);
    this.recordData();
  };

  hideModal = () => {
    this.setState({
      searchModalState: false,
    });
  };

  searchContent = e => {
    if (this.timerSend) clearTimeout(this.timerSend);
    this.setState({
      searchContent: e.target.value,
    });
    this.timerSend = setTimeout(() => {
      this.getProduction();
      this.recordData();
    }, 1000);
  };

  submit = () => {
    this.recordDataList = this.recordDataList.concat(...this.selectedRows);
    if (!this.recordDataList.length) {
      return message.warning('您没有选择任何表单数据，不可以提交');
    }
    const { des, itemIndex } = this.state;
    des.splice(itemIndex, 1, ...this.recordDataList);
    this.setState({
      des,
      categoryIndex: null,
      storageIndex: null,
      searchContent: null,
      searchModalState: false,
      selectedRowKeys: [],
      selectStorages: null,
    });
    this.selectedRows = [];
    this.recordDataList = [];
    return setTimeout(() => this.getProduction(), 100);
  };

  dataChange = (date, dateString, index) => {
    const { des } = this.state;
    des[index].dateString = dateString;
    if (des[index].best) {
      des[index].trueData = Dayjs(date)
        .add(Number(des[index].best), 'day')
        .format('YYYY-MM-DD');
    }
    des[index].date = date;
    this.setState({ des });
  };

  numChange = (value, index) => {
    const { des } = this.state;
    des[index].numValue = value;
    this.setState({ des });
  };

  priceChange = (value, index) => {
    const { des } = this.state;
    des[index].priceValue = value;
    this.setState({ des });
  };

  batchChange = (value, index) => {
    const { des } = this.state;
    des[index].batchValue = value;
    this.setState({ des });
  };

  userChange = value => {
    this.setState({ juserValue: value });
  };

  pageChange = pageNumber => {
    this.setState({ page: pageNumber });
    this.recordData();
    setTimeout(() => this.getProduction(), 100);
  };

  recordData = () => {
    this.recordDataList = this.recordDataList.concat(...this.selectedRows);
  };

  render() {
    const {
      product,
      form,
      salesContract: { contractSn },
    } = this.props;
    // getFieldValue
    const { getFieldDecorator } = form;
    const formItemLayout = { labelCol: { span: 5 }, wrapperCol: { span: 18 } };
    const {
      des,
      storages,
      users,
      searchModalState,
      categorys,
      products,
      categoryIndex,
      selectedRowKeys,
      selectStorages,
      totalSum,
      searchContent,
      storageIndex,
      page,
      printRecordData,
      showModel,
    } = this.state;
    const iniKeys = des && des.length > 0 ? des.map((el, index) => index) : [];
    // console.log(des)
    // console.log(iniKeys)
    getFieldDecorator('keys', { initialValue: iniKeys });
    // const keys = getFieldValue('keys');
    // console.log('keys', keys);
    let total = 0;
    des.forEach(el => {
      if (el.numValue && el.priceValue) {
        total += el.numValue * el.priceValue;
      }
    });
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
        dataIndex: 'currentnum',
        key: 'currentnum',
      },
    ];
    const dataSource = (products && products.list) || [];
    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedKeys, selectedRows) => {
        this.setState({ selectedRowKeys: selectedKeys });
        this.selectedRows = selectedRows;
      },
    };
    const tableList = [
      {
        title: '序号',
        key: 'tableList',
        width: 20,
        fixed: 'left',
        render: (text, record, index) => (
          <div
            style={{ height: 50, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            {index + 1}
          </div>
        ),
      },
      {
        title: '存货编码',
        width: 50,
        dataIndex: 'barsn',
        key: 'barsn',
        render: (text, record, index) => {
          if (text) {
            return (
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <div>{text}</div>
                <div>
                  <Button
                    type="primary"
                    shape="circle"
                    icon="search"
                    onClick={() => this.openSearchModal(index)}
                  />
                </div>
              </div>
            );
          }
          return (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <AutoComplete
                allowClear
                style={{ width: 110 }}
                onSelect={this.onSelect}
                onSearch={this.handleSearch}
                onFocus={() => this.handleFocus(index)}
                placeholder="产品首字母搜索"
                disabled
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
              <div>
                <Button
                  type="primary"
                  shape="circle"
                  icon="search"
                  // eslint-disable-next-line no-shadow
                  onClick={() => this.openSearchModal(index)}
                />
              </div>
            </div>
          );
        },
      },
      { title: '存货名称', width: 150, dataIndex: 'name', key: 'name' },
      {
        title: '规格',
        width: 80,
        key: 'shape',
        render: text => {
          if (text.shape) {
            return (
              <span>
                {text.shape}
                /盒
              </span>
            );
          }
          return <span>{text.shape}</span>;
        },
      },
      // {
      //   title: '包装(箱)',
      //   width: 150,
      //   key: 'pack',
      //   render: text => {
      //     if (text.pack) {
      //       return (
      //         <span>
      //           {text.pack}
      //           /箱
      //         </span>
      //       );
      //     }
      //     return <span>{text.shape}</span>;
      //   },
      // },
      // { title: '可用数量', width: 150, dataIndex: 'currentnum', key: 'currentnum' },
      {
        title: '数量',
        width: 100,
        key: 'num',
        render: (text, record, index) => (
          <InputNumber
            placeholder="数量"
            value={record.numValue}
            onChange={value => this.numChange(value, index)}
          />
        ),
      },
      {
        title: '单位',
        width: 80,
        key: 'unit',
        render: text => {
          if (text.unit && text.unit.name) return <div>{text.unit.name}</div>;
          return <div />;
        },
      },
      {
        title: '单价',
        width: 100,
        key: 'price',
        render: (text, record, index) => (
          <InputNumber
            placeholder="单价"
            value={record.priceValue}
            onChange={value => this.priceChange(value, index)}
          />
        ),
      },
      {
        title: '合计',
        width: 150,
        key: 'account',
        render: text => {
          if (text.numValue && text.priceValue) {
            return <span>{text.numValue * text.priceValue}</span>;
          }
          return null;
        },
      },
      {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 100,
        render: (text, record, index) => (
          <Button
            type="primary"
            shape="circle"
            icon="delete"
            size="small"
            onClick={() => this.remove(index)}
          />
        ),
      },
    ];
    const tableData = des;
    return (
      <PageHeaderWrapper title="">
        <div style={{ background: 'white', padding: 10 }}>
          <div className={styles.insertHeaderStyle}>
            <main>
              <div style={{ marginTop: -22 }}>{contractSn}</div>
            </main>
            <main>
              <div style={{ marginTop: -22 }}>经办人</div>
              <div>
                <FormItem {...formItemLayout}>
                  {form.getFieldDecorator('juserValue', {
                    rules: [{ required: true, message: '是必填项' }],
                    initialValue: '',
                  })(
                    <Select
                      allowClear
                      placeholder="请选择经办人"
                      style={{ width: 150 }}
                      onChange={this.userChange}
                    >
                      {users.map(el => (
                        <Option key={el.id} value={el.id}>
                          {el.nickname}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </div>
            </main>
            <main>
              <div style={{ marginTop: -22 }}>供应商</div>
              <div>
                <FormItem {...formItemLayout}>
                  {form.getFieldDecorator('supporter', {
                    rules: [{ required: true, message: '是必填项' }],
                    initialValue: '',
                  })(
                    <AutoComplete
                      allowClear
                      style={{ width: 120 }}
                      onSelect={this.onSelectClient}
                      onSearch={this.handleClientSearch}
                      placeholder="首字母供应商搜索"
                      dropdownMatchSelectWidth={false}
                      dropdownStyle={{ width: 100 }}
                    >
                      {product &&
                        product.supporters.map(el => <Option key={el.id}>{el.name}</Option>)}
                    </AutoComplete>
                  )}
                </FormItem>
              </div>
            </main>
            <main>
              <div>日期</div>
              <div>
                <DatePicker
                  format="YYYY-MM-DD HH:mm:ss"
                  onChange={this.onDateChange}
                  placeholder="选择单据时间"
                  defaultValue={moment()}
                />
              </div>
            </main>
          </div>
          <Table
            columns={tableList}
            dataSource={tableData}
            scroll={{ x: 960 }}
            pagination={false}
            footer={() => (
              <Button type="primary" shape="circle" icon="plus" size="large" onClick={this.add} />
            )}
          />
          <Row style={{ marginTop: 50 }}>
            <Col span={8}>
              <FormItem label="制单人" {...formItemLayout}>
                {form.getFieldDecorator('payment', {
                  rules: [{ required: false, message: '是必填项' }],
                  initialValue: '',
                })(<Input placeholder="请输入" autoComplete="off" />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="审核" {...formItemLayout}>
                {form.getFieldDecorator('packing', {
                  rules: [{ required: false, message: '是必填项' }],
                  initialValue: '',
                })(<Input placeholder="请输入" autoComplete="off" />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="备注" {...formItemLayout}>
                {form.getFieldDecorator('extra', {
                  rules: [{ required: false, message: '是必填项' }],
                  initialValue: '',
                })(<Input placeholder="请输入" autoComplete="off" />)}
              </FormItem>
            </Col>
          </Row>
          <div className={styles.submitBootmStyle}>
            <div>
              <Button type="primary" htmlType="submit" onClick={this.handleSubmit}>
                提交
              </Button>
            </div>
            <div>合计: {total}</div>
          </div>
        </div>
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
                value={selectStorages}
                placeholder="请选择仓库"
                style={{ width: 200 }}
                onChange={this.selectStorage}
              >
                {storages.map((el, i) => (
                  <Option key={el.id} value={`${el.id}//${i}`}>
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
                    key={item.id}
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
                rowKey={(record, index) =>
                  `${searchContent || 'none'}//${
                    storageIndex ? storages[storageIndex].name : 'all'
                  }//${categoryIndex ? categorys[categoryIndex].name : 'all'}//${page}//${index}`
                }
                pagination={{
                  total: totalSum,
                  onChange: this.pageChange,
                  current: page,
                }}
              />
            </Col>
          </div>
          <div className={styles.searchModalFooter}>
            <Button type="primary" onClick={this.hideModal}>
              关闭
            </Button>
            <Button onClick={this.submit}>提交</Button>
          </div>
        </Modal>
        <PrintModal
          record={printRecordData}
          showModel={showModel}
          controlHideModelHandler={this.controlHideModelHandler}
        />
      </PageHeaderWrapper>
    );
  }
}

export default SaleContractInsert;
