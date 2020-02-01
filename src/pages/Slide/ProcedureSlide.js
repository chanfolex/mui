import React, { PureComponent } from 'react';
import { DndProvider, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import { Form, Input, Drawer, Tabs, Divider, Row, Col, Table, Icon } from 'antd';

const FormItem = Form.Item;
const { TabPane } = Tabs;

const EditableContext = React.createContext();
let dragingIndex = -1;

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

// eslint-disable-next-line no-unused-vars
const EditableFormRow = Form.create()(EditableRow);

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

class EditableCell extends React.Component {
  state = {
    editing: false,
  };

  toggleEdit = () => {
    const { editing } = this.state;
    this.setState({ editing: !editing }, () => {
      if (!editing) {
        this.input.focus();
      }
    });
  };

  save = e => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  };

  renderCell = form => {
    this.form = form;
    const { children, dataIndex, record, title } = this.props;
    const { editing } = this.state;
    return editing ? (
      <Form.Item style={{ margin: 0 }}>
        {form.getFieldDecorator(dataIndex, {
          rules: [
            {
              required: true,
              message: `${title} is required.`,
            },
          ],
          initialValue: record[dataIndex],
          // eslint-disable-next-line no-return-assign
        })(<Input ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />)}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={this.toggleEdit}
      >
        {children}
      </div>
    );
  };

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    );
  }
}

@Form.create()
export default class ProcedureSlide extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dataList: [],
      pagination: {},
      loading: false,
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
    const { dataList, pagination, loading } = this.state;

    const windowH = window.innerHeight;

    // EditableFormRow 编辑效果
    // DragableBodyRow 拖动效果
    const components = {
      body: {
        row: DragableBodyRow,
        cell: EditableCell,
      },
    };

    const colClass = {
      lineHeight: 1,
      marginBottom: '10px',
    };
    const spanClass = {
      display: 'inline-block',
      minWidth: '40px',
    };

    let columns = [
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
      },
      {
        title: '单价',
        dataIndex: 'price',
        key: 'price',
        width: 100,
        editable: true,
      },

      {
        title: '备注',
        dataIndex: 'extra',
        key: 'extra',
        width: 200,
        editable: true,
      },

      {
        title: '提交时间',
        dataIndex: 'ctime',
        key: 'ctime',
        render: text => <span>{text || '无'}</span>,
      },
    ];

    columns = columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });

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
        <Divider style={{ marginTop: 10, marginBottom: 0 }} />
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
      </Drawer>
    );
  }
}
