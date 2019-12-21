import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
// import moment from 'moment';
import {
  // Row,
  // Col,
  Card,
  Form,
  Input,
  Select,
  Table,
  Icon,
  Button,
  // Dropdown,
  // Menu,
  // InputNumber,
  // DatePicker,
  Modal,
  message,
  // Badge,
  Divider,
  Popconfirm,
  // Steps,
  // Radio,
} from 'antd';
// import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './Category.less';

const FormItem = Form.Item;
// const { Step } = Steps;
// const { TextArea } = Input;
const { Option } = Select;
// const RadioGroup = Radio.Group;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, types } = props;

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="新建分类"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="类型">
        {form.getFieldDecorator('type', {
          rules: [{ required: true, message: '单位是必填项' }],
        })(
          <Select placeholder="请选择" style={{ width: '100%' }}>
            {types.map(item => (
              <Option value={item.id} key={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '名称是必填项' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
});

@Form.create()
class UpdateForm extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      formVals: {
        name: props.values.name,
        type: props.values.type,
        id: props.values.id,
      },
    };

    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

  handleComplate = () => {
    const { form, handleUpdate } = this.props;
    const { formVals: oldValue } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const formVals = { ...oldValue, ...fieldsValue };
      this.setState({ formVals }, () => {
        handleUpdate(formVals);
      });
    });
  };

  renderContent = formVals => {
    const { form, types } = this.props;
    return [
      <FormItem key="type" {...this.formLayout} label="类型">
        {form.getFieldDecorator('type', {
          rules: [{ required: true, message: '类型是必填项' }],
          initialValue: formVals.type,
        })(
          <Select allowClear placeholder="请选择" style={{ width: '100%' }}>
            {types.map(item => (
              <Option value={item.id} key={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        )}
      </FormItem>,
      <FormItem key="name" {...this.formLayout} label="名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入名称！' }],
          initialValue: formVals.name,
        })(<Input placeholder="请输入" />)}
      </FormItem>,
    ];
  };

  render() {
    const { updateModalVisible, handleUpdateModalVisible } = this.props;
    const { formVals } = this.state;

    return (
      <Modal
        width={640}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="分类编辑"
        visible={updateModalVisible}
        onOk={this.handleComplate}
        onCancel={() => handleUpdateModalVisible()}
      >
        {this.renderContent(formVals)}
      </Modal>
    );
  }
}

/* eslint react/no-multi-comp:0 */
@connect(({ category, types, loading }) => ({
  category,
  types,
  loading: loading.models.category,
}))
@Form.create()
class Category extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    // expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
  };

  columns = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '拼音首字',
      dataIndex: 'abbr',
    },
    {
      title: '操作',
      width: 150,
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm
            title="你确定删除吗?"
            onConfirm={() => this.handleDelete(record)}
            okText="是"
            cancelText="否"
          >
            <a href="#">删除</a>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'category/fetch',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'category/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'category/fetch',
      payload: {},
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'rule/remove',
          payload: {
            key: selectedRows.map(row => row.key),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'category/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = flag => {
    const { dispatch, types } = this.props;
    if (types.data.list.length === 0) {
      dispatch({
        type: 'types/fetch',
      });
    }
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  // 新增分类
  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'category/add',
      payload: {
        name: fields.name,
        type: fields.type,
      },
    });

    message.success('添加分类成功');
    this.handleModalVisible();
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'category/update',
      payload: {
        name: fields.name,
        type: fields.type,
        id: fields.id,
      },
    });

    message.success('分类编辑成功');
    this.handleUpdateModalVisible();
  };

  handleDelete = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'category/delete',
      payload: {
        id: `${fields.id}`,
        status: 2,
      },
    });
    message.success('分类删除成功');
  };

  emitEmpty = () => {
    // this.searchInput.focus();
    const { form } = this.props;
    form.setFieldsValue({
      name: '',
      type: '',
    });
  };

  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;

    const suffix = form.getFieldValue('name') ? (
      <Icon type="close-circle" onClick={this.emitEmpty} />
    ) : null;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <FormItem label="">
          {getFieldDecorator('name')(<Input suffix={suffix} placeholder="请输入首字母搜索" />)}
        </FormItem>
      </Form>
    );
  }

  // renderForm() {
  //   const { expandForm } = this.state;
  //   return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  // }

  render() {
    const {
      category: { data },
      types,
    } = this.props;
    const { modalVisible, updateModalVisible, stepFormValues } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    const paginationProps = {
      // showSizeChanger: true,
      // showQuickJumper: true,
      ...data.pagination,
    };
    return (
      <PageHeaderWrapper title="">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
              <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            </div>
            <Table
              rowKey="id"
              columns={this.columns}
              dataSource={data.list}
              pagination={paginationProps}
            />
          </div>
        </Card>
        <CreateForm types={types.data.list} {...parentMethods} modalVisible={modalVisible} />
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateForm
            types={types.data.list}
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default Category;
