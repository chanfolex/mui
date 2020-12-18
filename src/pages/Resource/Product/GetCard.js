import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Form,
  Input,
  Modal,
  Tabs,
  Select,
  AutoComplete,
  DatePicker,
  message,
} from 'antd';
import Debounce from 'lodash-decorators/debounce';
import styles from './product.less';

const FormItem = Form.Item;
const { Option } = AutoComplete;
const { TextArea } = Input;
const { TabPane } = Tabs;

@connect(({ product }) => ({
  product,
  // loading: loading.effects['chart/fetch'],
}))
@Form.create()
export default class GetCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employee: '',
      ordate: moment().format('YYYY-MM-DD'),
      formVals: {
        id: props.values.id,
        name: props.values.name,
        sn: props.values.sn,
      },
    };
  }

  componentDidMount() {
    // const { formVals } = this.state;
  }

  onDateChange = (date, dateString) => {
    this.setState({
      ordate: dateString,
    });
  };

  @Debounce(500)
  handleClientSearch = value => {
    const { dispatch } = this.props;
    if (value) {
      dispatch({ type: 'product/fetchEmployeeOption', payload: { abbr: value } }).then(res => {
        if (res && !res.data.length) return message.warning('搜索结果不存在');
        return null;
      });
    }
  };

  render() {
    const { formVals, employee, ordate } = this.state;
    const {
      form,
      handleAddcard,
      getcardModalVisible,
      handleGetModalVisible,
      employees,
      product,
    } = this.props;

    const okHandle = () => {
      form.validateFields((errors, values) => {
        if (errors) return;
        // eslint-disable-next-line no-param-reassign
        // eslint-disable-next-line no-param-reassign
        // eslint-disable-next-line no-param-reassign
        values.product = formVals.id;
        handleAddcard(values);
        form.resetFields();
      });
    };
    const onTabChange = () => {};

    return (
      <Modal
        width={800}
        className={styles.formRow}
        destroyOnClose
        title="开流通卡"
        visible={getcardModalVisible}
        maskClosable={false}
        onOk={okHandle}
        onCancel={() => handleGetModalVisible()}
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
                  {formVals.sn}
                </FormItem>
                <FormItem
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 18 }}
                  label="产品名称"
                  hasFeedback
                >
                  {formVals.name}
                </FormItem>

                <FormItem
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 18 }}
                  label="领用人"
                  disabled="true"
                  hasFeedback
                >
                  {form.getFieldDecorator('employee', {
                    rules: [{ required: true, message: '是必填项' }],
                    initialValue: '',
                  })(
                    <AutoComplete
                      allowClear
                      style={{ width: 200 }}
                      size="large"
                      onSelect={this.onSelectClient}
                      onSearch={this.handleClientSearch}
                      placeholder="首字母搜索"
                      dropdownMatchSelectWidth={false}
                      dropdownStyle={{ width: 200 }}
                    >
                      {product &&
                        product.employees.map(el => <Option key={el.id}>{el.name}</Option>)}
                    </AutoComplete>
                  )}
                </FormItem>

                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} label="单据时间">
                  {form.getFieldDecorator('date', {
                    initialValue: moment(),
                  })(
                    <DatePicker
                      style={{ width: 200 }}
                      format="YYYY-MM-DD HH:mm:ss"
                      onChange={this.onDateChange}
                      placeholder="选择单据时间"
                    />
                  )}
                </FormItem>

                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} label="流通卡号">
                  {form.getFieldDecorator('sn', {})(
                    <TextArea placeholder="请输入卡号" size="large" />
                  )}
                </FormItem>
                <FormItem
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 18 }}
                  label="投产数量"
                  hasFeedback
                >
                  {form.getFieldDecorator('num', {
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
                  })(<Input placeholder="请输入投产数量" size="large" />)}
                </FormItem>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Modal>
    );
  }
}
