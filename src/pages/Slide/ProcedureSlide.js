import React, { PureComponent } from 'react';
import { DndProvider, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import {
  Form,
  Input,
  Drawer,
  Tabs,
  Divider,
  Row,
  Col,
  Table,
  Icon,
  Popover,
  Button,
  InputNumber,
  Modal,
  message,
} from 'antd';

const FormItem = Form.Item;
const { TabPane } = Tabs;

let dragingIndex = -1;

class BodyRow extends React.Component {
  render() {
    const { isOver, connectDragSource, connectDropTarget, moveRow, ...restProps } = this.props;
    const style = { ...restProps.style, cursor: 'move' };

    let { className } = restProps;
    if (isOver) {
      if (restProps.index > dragingIndex) {
        className += ' drop-over-downward';
      }
      if (restProps.index < dragingIndex) {
        className += ' drop-over-upward';
      }
    }

    return connectDragSource(
      connectDropTarget(<tr {...restProps} className={className} style={style} />)
    );
  }
}

const rowSource = {
  beginDrag(props) {
    dragingIndex = props.index;
    return {
      index: props.index,
    };
  },
};

const rowTarget = {
  drop(props, monitor) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Time to actually perform the action
    props.moveRow(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    // eslint-disable-next-line no-param-reassign
    monitor.getItem().index = hoverIndex;
  },
};

const DragableBodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
}))(
  DragSource('row', rowSource, connect => ({
    connectDragSource: connect.dragSource(),
  }))(BodyRow)
);

@Form.create()
export default class ProcedureSlide extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dataList: [],
      pagination: {},
      loading: false,
      extraValue: '',
      nameValue: '',
      priceValue: '',
      adjustVisible: false,
      adjustData: [],
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = (params = {}) => {
    const { dispatch, formRow } = this.props;

    this.setState({ loading: true });
    dispatch({
      type: 'procedure/fetchItems',
      payload: {
        ...params,
        product: formRow.id,
      },
    }).then(res => {
      if (res) {
        const { pagination } = this.state;
        pagination.total = res.data.sum;
        this.setState({
          loading: false,
          dataList: res.data,
          pagination,
        });
      }
    });
  };

  handleTabChange = () => {
    // console.log(key);
  };

  // eslint-disable-next-line no-unused-vars
  handleTableChange = (pagination, filters, sorter) => {
    const { pagination: pagi } = this.state;
    const pager = { ...pagi };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    const param = { pagination: pagination.current };
    this.fetchData(param);
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (err) return;
      this.fetchData({ sn: values.abbr });
    });
  };

  emitEmpty = () => {
    const { form } = this.props;
    form.setFieldsValue({
      abbr: '',
    });
    this.fetchData();
  };

  handleSave = () => {};

  moveRow = (dragIndex, hoverIndex) => {
    this.changeDataSubmit(dragIndex, hoverIndex);
    const { dataList } = this.state;
    const dragRow = dataList[dragIndex];

    this.setState(
      // eslint-disable-next-line react/no-access-state-in-setstate
      update(this.state, {
        dataList: {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
        },
      })
    );
  };

  getNameValue = e => {
    this.setState({ nameValue: e.target.value });
  };

  sureName = index => {
    const { dataList, nameValue } = this.state;
    dataList[index].name = nameValue;
    if (nameValue) {
      this.setState({
        dataList,
        nameValue: '',
      });
      setTimeout(() => this.changeDataSubmit(index), 10);
    }
  };

  getPriceValue = value => {
    this.setState({ priceValue: value });
  };

  surePrice = index => {
    const { dataList, priceValue } = this.state;
    dataList[index].price = priceValue;
    if (priceValue) {
      this.setState({
        dataList,
        priceValue: '',
      });
      setTimeout(() => this.changeDataSubmit(index), 10);
    }
  };

  getExtraValue = e => {
    this.setState({ extraValue: e.target.value });
  };

  sureExtra = index => {
    const { dataList, extraValue } = this.state;
    dataList[index].extra = extraValue;
    if (extraValue) {
      this.setState({
        dataList,
        extraValue: '',
      });
      setTimeout(() => this.changeDataSubmit(index), 10);
    }
  };

  getAdjustName = (e, index) => {
    const { adjustData } = this.state;
    adjustData[index].name = e.target.value;
    this.setState({ adjustData: JSON.parse(JSON.stringify(adjustData)) });
  };

  getAdjustPrice = (value, index) => {
    const { adjustData } = this.state;
    if (!value) return;
    adjustData[index].price = value;
    this.setState({ adjustData: JSON.parse(JSON.stringify(adjustData)) });
  };

  getAdjustExtra = (e, index) => {
    const { adjustData } = this.state;
    adjustData[index].extra = e.target.value;
    this.setState({ adjustData: JSON.parse(JSON.stringify(adjustData)) });
  };

  adjust = () => {
    const { dataList } = this.state;
    this.setState({
      adjustVisible: true,
      adjustData: dataList.length
        ? JSON.parse(JSON.stringify(dataList))
        : [
            {
              name: '',
              position: 1,
              price: '',
              extra: '',
            },
          ],
    });
  };

  addDataList = index => {
    const { adjustData } = this.state;
    const inx = adjustData[index + 1] && adjustData[index + 1].position;
    adjustData.splice(index + 1, 0, {
      name: '',
      position: inx || adjustData[index].position + 1,
      price: '',
      extra: '',
    });
    const data = adjustData.map((item, i) => {
      if (i > index + 1) {
        // eslint-disable-next-line no-param-reassign
        item.position += 1;
      }
      return item;
    });
    this.setState({ adjustData: JSON.parse(JSON.stringify(data)) });
  };

  // eslint-disable-next-line consistent-return
  deleteDataList = index => {
    const { adjustData } = this.state;
    if (adjustData.length <= 1) return message.info('至少存在一个操作项');
    adjustData.splice(index, 1);
    const data = adjustData.map((item, i) => {
      if (i >= index) {
        // eslint-disable-next-line no-param-reassign
        item.position -= 1;
      }
      return item;
    });
    this.setState({ adjustData: JSON.parse(JSON.stringify(data)) });
  };

  adjustCancel = () => {
    this.setState({
      adjustVisible: false,
    });
  };

  // eslint-disable-next-line consistent-return
  adjustSubmit = () => {
    const { dispatch, formRow } = this.props;
    const { adjustData } = this.state;
    if (!adjustData.every(item => item.name && item.price))
      return message.info('名字和单价为必填项');
    dispatch({
      type: 'procedure/editAll',
      payload: {
        des: adjustData,
        product: formRow.id,
      },
    }).then(res => {
      if (res.code && res.code === 200) {
        this.fetchData();
        this.setState({ adjustVisible: false });
        message.success('提交成功');
      }
    });
  };

  changeDataSubmit = (index, hoverIndex) => {
    console.log(index);
    console.log(hoverIndex);
    const { dispatch } = this.props;
    const { dataList } = this.state;
    console.log(dataList);
    const params = {
      id: dataList[index].id,
      name: dataList[index].name,
      product: dataList[index].product,
      price: dataList[index].price,
      extra: dataList[index].extra,
      // eslint-disable-next-line no-nested-ternary
      position: dataList[Number(hoverIndex) === 0 ? 0 : hoverIndex || index].position,
    };
    console.log(params);
    dispatch({
      type: 'procedure/update',
      payload: params,
    }).then(res => {
      console.log(res);
      if (res.code && res.code === 200) {
        if (hoverIndex) this.fetchData();
        message.success('更新成功');
      }
    });
  };

  renderSimpleForm() {
    const { form } = this.props;

    const suffix = form.getFieldValue('abbr') ? (
      <Icon type="close-circle" onClick={this.emitEmpty} />
    ) : null;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <FormItem label="">
          {form.getFieldDecorator('abbr')(
            <Input suffix={suffix} placeholder="请输入sn搜索" autoComplete="off" />
          )}
        </FormItem>
      </Form>
    );
  }

  render() {
    const { visible, onClose, formRow } = this.props;
    const {
      dataList,
      pagination,
      loading,
      nameValue,
      extraValue,
      priceValue,
      adjustVisible,
      adjustData,
    } = this.state;

    const windowH = window.innerHeight;

    // DragableBodyRow 拖动效果
    const components = {
      body: {
        row: DragableBodyRow,
      },
    };

    const totalPrice = adjustData.reduce((pre, cur) => Number(pre) + Number(cur.price), 0);

    const colClass = {
      height: 50,
      display: 'flex',
      alignItems: 'center',
      marginBottom: '10px',
    };
    const spanClass = {
      display: 'inline-block',
      minWidth: '40px',
    };

    const columns = [
      {
        title: '序号',
        dataIndex: 'position',
        key: 'position',
        width: 100,
      },
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        width: 100,
        editable: true,
        render: (text, record, index) => (
          <Popover
            content={
              <div style={{ display: 'flex' }}>
                <Input placeholder="名称" value={nameValue} onChange={this.getNameValue} />
                <Button
                  type="primary"
                  style={{ marginLeft: 5 }}
                  onClick={() => this.sureName(index)}
                >
                  确认
                </Button>
              </div>
            }
            title="更改"
          >
            <div>{text || '无'}</div>
          </Popover>
        ),
      },
      {
        title: '单价',
        dataIndex: 'price',
        key: 'price',
        width: 100,
        editable: true,
        render: (text, record, index) => (
          <Popover
            content={
              <div style={{ display: 'flex' }}>
                <InputNumber
                  defaultValue={0}
                  value={priceValue || 0}
                  onChange={this.getPriceValue}
                />
                <Button
                  type="primary"
                  style={{ marginLeft: 5 }}
                  onClick={() => this.surePrice(index)}
                >
                  确认
                </Button>
              </div>
            }
            title="更改"
          >
            <div>{text || '无'}</div>
          </Popover>
        ),
      },

      {
        title: '备注',
        dataIndex: 'extra',
        key: 'extra',
        width: 200,
        editable: true,
        render: (text, record, index) => (
          <Popover
            content={
              <div style={{ display: 'flex' }}>
                <Input placeholder="备注" value={extraValue} onChange={this.getExtraValue} />
                <Button
                  type="primary"
                  style={{ marginLeft: 5 }}
                  onClick={() => this.sureExtra(index)}
                >
                  确认
                </Button>
              </div>
            }
            title="更改"
          >
            <div>{text || '无'}</div>
          </Popover>
        ),
      },

      {
        title: '提交时间',
        dataIndex: 'ctime',
        key: 'ctime',
        render: text => <span>{text || '无'}</span>,
      },
    ];

    const adjustColumns = [
      {
        title: '序号',
        dataIndex: 'position',
        key: 'position',
        width: 100,
      },
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        width: 200,
        render: (text, record, index) => (
          <Input
            prefix={
              text ? (
                <Icon type="check" style={{ color: '#1DA57A' }} />
              ) : (
                <Icon type="close" style={{ color: 'red' }} />
              )
            }
            value={text}
            onChange={e => this.getAdjustName(e, index)}
          />
        ),
      },
      {
        title: '单价',
        dataIndex: 'price',
        key: 'price',
        width: 200,
        render: (text, record, index) => (
          <div>
            {text ? (
              <Icon type="check" style={{ color: '#1DA57A' }} />
            ) : (
              <Icon type="close" style={{ color: 'red' }} />
            )}
            <InputNumber
              style={{ marginLeft: 5 }}
              defaultValue={0}
              value={text || 0}
              onChange={value => this.getAdjustPrice(value, index)}
            />
          </div>
        ),
      },
      {
        title: '备注',
        dataIndex: 'extra',
        key: 'extra',
        width: 200,
        render: (text, record, index) => (
          <Input value={text} onChange={e => this.getAdjustExtra(e, index)} />
        ),
      },
      {
        title: '操作',
        key: 'opr',
        width: 100,
        render: (text, record, index) => (
          <div>
            <Button
              type="primary"
              shape="circle"
              icon="plus"
              onClick={() => this.addDataList(index)}
            />
            <Button
              type="danger"
              shape="circle"
              icon="delete"
              style={{ marginLeft: 10 }}
              onClick={() => this.deleteDataList(index)}
            />
          </div>
        ),
      },
    ];

    return (
      <Drawer
        width="50%"
        title="库存详情"
        placement="right"
        destroyOnClose
        closable={false}
        onClose={onClose}
        visible={visible}
      >
        <Row>
          <div style={{ height: 100 }}>
            <div style={{ height: 50, display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', flex: 1 }}>
                <div>客户名称</div>
                <div>1</div>
              </div>
              <div style={{ display: 'flex', flex: 1 }}>
                <div>联系人</div>
                <div>1</div>
              </div>
              <div style={{ display: 'flex', flex: 1 }}>
                <div>类型</div>
                <div>1</div>
              </div>
            </div>
            <div style={{ height: 50, display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', flex: 1 }}>
                <div>国家地区</div>
                <div>1</div>
              </div>
              <div style={{ display: 'flex', flex: 1 }}>
                <div>联系电话</div>
                <div>1</div>
              </div>
              <div style={{ display: 'flex', flex: 1 }}>
                <Button type="primary" onClick={this.adjust}>
                  整体调整
                </Button>
              </div>
            </div>
          </div>
          <Divider style={{ marginTop: 10, marginBottom: 0 }} />
          <Col span={8}>
            <div style={colClass}>
              <span style={spanClass}>存货名称:</span>
              <span style={{ color: '#333' }}> {formRow.name}</span>
            </div>
            {/* <div style={colClass}>
              <span style={spanClass}>类型:</span>
              <span style={{ color: '#333' }}> {formRow.name}</span>
            </div>

            <div style={colClass}>
              <span style={spanClass}>供应商:</span>
              {/* <span style={{ color: '#333' }}> {formRow.supporter.name}</span> */}
          </Col>

          {/* <Col span={8}>
            <div style={colClass}>
              <span style={spanClass}>规格型号:</span>
              <span style={{ color: '#333' }}>{formRow.product.shape}</span>
            </div>
            <div style={colClass}>
              <span style={spanClass}>计量单位:</span>
              <span style={{ color: '#333' }}>{formRow.product.unit.name} </span>
            </div>
            <div style={colClass}>
              <span style={spanClass}>生产企业:</span>
              <span style={{ color: '#333' }}> {formRow.product.company}</span>
            </div>
            <div style={colClass}>
              <span style={spanClass}>生产许可证:</span>
              <span style={{ color: '#333' }}> {formRow.product.license}</span>
            </div>
          </Col>
          <Col span={8}>
            <div style={colClass}>
              <span style={spanClass}>库存数量:</span>
              <span style={{ color: '#333' }}> {formRow.product.num}</span>
            </div>
            <div style={colClass}>
              <span style={spanClass}>备注:</span>
              <span style={{ color: '#333' }}> {formRow.product.extra}</span>
            </div>
          </Col> */}
        </Row>
        <Tabs defaultActiveKey="1" onChange={this.handleTabChange}>
          <TabPane tab="工序列表" key="1">
            <DndProvider backend={HTML5Backend}>
              <Table
                rowKey="id"
                size="middle"
                components={components}
                columns={columns}
                dataSource={dataList}
                pagination={pagination}
                loading={loading}
                onChange={this.handleTableChange}
                scroll={{ y: windowH - 360 }}
                onRow={(record, index) => ({
                  index,
                  moveRow: this.moveRow,
                })}
              />
            </DndProvider>
          </TabPane>
        </Tabs>

        {/* <Row>
          <Col span={8}>
            <div style={colClass}>
              <span style={spanClass}>包装:</span>
              <span style={{ color: '#333' }}> {formRow.packing}</span>
            </div>
            <div style={colClass}>
              <span style={spanClass}>发货日期:</span>
              <span style={{ color: '#333' }}> {formRow.deliver}</span>
            </div>
          </Col>
          <Col span={8}>
            <div style={colClass}>
              <span style={spanClass}>交货地:</span>
              <span style={{ color: '#333' }}> {formRow.location}</span>
            </div>
            <div style={colClass}>
              <span style={spanClass}>付款:</span>
              <span style={{ color: '#333' }}> {formRow.payment}</span>
            </div>
          </Col>
        </Row> */}

        {/* {modalVisible && (
          <Detail
            modalVisible={modalVisible}
            handleModalVisible={this.handleModalVisible}
            formRow={currentRow}
            parentRow={formRow}
          />
        )} */}
        <Modal
          title="整体调整"
          width={1000}
          visible={adjustVisible}
          onCancel={this.adjustCancel}
          footer={[
            <Button key="back" onClick={this.adjustCancel}>
              取消
            </Button>,
            <Button key="submit" type="primary" loading={loading} onClick={this.adjustSubmit}>
              提交
            </Button>,
          ]}
        >
          <Table columns={adjustColumns} dataSource={adjustData} pagination={false} />
          <div
            style={{
              height: 50,
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            加工合计: {totalPrice}
          </div>
        </Modal>
      </Drawer>
    );
  }
}
