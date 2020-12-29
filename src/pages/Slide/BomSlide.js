import React, { PureComponent } from 'react';
import { Form, Drawer, Row, Col, Divider, Tabs, Table, Modal, Button, Select } from 'antd';

const { TabPane } = Tabs;
const { Option } = Select;

@Form.create()
export default class BomSlide extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tableData: [
        {
          key: '1',
          name: 1,
        },
        {
          key: '2',
          name: 2,
        },
      ],
      count: 3,
      modalVisible: false,
      temporaryData: [],
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    // dispatch({
    //   type: 'bom/fetchitems',
    // }).then(res => {
    //   console.log(res)
    // });
  }

  // 产品基础信息
  productInfo = () => {
    const { formRow } = this.props;
    const colClass = {
      lineHeight: 1,
      marginBottom: '10px',
    };
    const spanClass = {
      display: 'inline-block',
      minWidth: '40px',
    };

    return (
      <Row>
        <Col span={8}>
          <div style={colClass}>
            <span style={spanClass}>订单号:</span>
            <span style={{ color: '#333' }}> {formRow.name}</span>
          </div>
          <div style={colClass}>
            <span style={spanClass}>客户订单号:</span>
            <span style={{ color: '#333' }}> {formRow.type}</span>
          </div>

          <div style={colClass}>
            <span style={spanClass}>客户名称:</span>
            <span style={{ color: '#333' }}> {formRow.bank}</span>
          </div>
        </Col>

        <Col span={8}>
          <div style={colClass}>
            <span style={spanClass}>产品规格:</span>
            <span style={{ color: '#333' }}>{formRow.linkman}</span>
          </div>
          <div style={colClass}>
            <span style={spanClass}>交货日期:</span>
            <span style={{ color: '#333' }}>{formRow.address} </span>
          </div>
          <div style={colClass}>
            <span style={spanClass}>生产编号:</span>
            <span style={{ color: '#333' }}> {formRow.production}</span>
          </div>
        </Col>

        <Col span={8}>
          <div style={colClass}>
            <span style={spanClass}>添加人:</span>
            <span style={{ color: '#333' }}> {formRow.linkman}</span>
          </div>
          <div style={colClass}>
            <span style={spanClass}>添加时间:</span>
            <span style={{ color: '#333' }}> {formRow.tel}</span>
          </div>
          <div style={colClass}>
            <span style={spanClass}>生产状态:</span>
            <span style={{ color: '#333' }}> {formRow.tel}</span>
          </div>
        </Col>
      </Row>
    );
  };

  // 编辑弹框
  productModal = () => {
    const { count, temporaryData, modalVisible } = this.state;
    // 增加一行
    const addItem = i => {
      temporaryData.splice(i + 1, 0, {
        key: `${count}`,
        name: `${count}`,
      });
      // 这里需要调用删除接口
      this.setState({ temporaryData: [...temporaryData], count: count + 1 });
    };

    // 删除某一行
    const removeItem = i => {
      temporaryData.splice(i, 1);
      this.setState({ temporaryData: [...temporaryData] });
    };

    // 提交表单
    const handleOk = () => {
      this.setState({
        modalVisible: false,
      });
    };

    // 隐藏modal
    const handleCancel = () => {
      this.setState({
        modalVisible: false,
      });
    };

    const columns = [
      {
        title: '组件编号',
        dataIndex: 'name',
        key: 'name',
        render: (text, record, i) => (
          <Select
            showSearch
            allowClear
            style={{ width: 200 }}
            placeholder="Select a person"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
            <Option value="tom">Tom</Option>
          </Select>
        ),
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record, i) => (
          <span>
            <Button type="primary" shape="circle" icon="cloud-upload" />
            <Button type="primary" shape="circle" icon="plus" onClick={() => addItem(i)} />
            <Button type="primary" shape="circle" icon="delete" onClick={() => removeItem(i)} />
          </span>
        ),
      },
    ];
    return (
      <Modal
        title="编辑"
        width={1200}
        visible={modalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        maskClosable
      >
        {this.productInfo()}
        <Table
          columns={columns}
          dataSource={temporaryData}
          pagination={false}
          scroll={{ y: 400 }}
        />
      </Modal>
    );
  };

  render() {
    const { visible, onClose } = this.props;
    const { tableData } = this.state;
    // 删除某条数据
    const deleteItem = index => {
      tableData.splice(index, 1);
      // 这里需要调用删除接口
      this.setState({ tableData: [...tableData] });
    };

    // 是否显示modal
    const showModal = () => {
      this.setState({
        modalVisible: true,
        temporaryData: JSON.parse(JSON.stringify(tableData)),
      });
    };

    // 切换tabs页面
    const handleTabChange = () => {
      // console.log(key);
    };

    const columns = [
      {
        title: '组件编号',
        dataIndex: 'name',
        key: 'name',
        render: text => <a>{text}</a>,
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record, index) => <a onClick={() => deleteItem(index)}>删除</a>,
      },
    ];

    return (
      <Drawer
        width="50%"
        placement="right"
        destroyOnClose
        closable={false}
        onClose={onClose}
        visible={visible}
      >
        {this.productInfo()}
        <Divider style={{ marginTop: 10, marginBottom: 0 }} />
        <Tabs defaultActiveKey="1" onChange={handleTabChange}>
          <TabPane tab="TAB1" key="1">
            <Table columns={columns} dataSource={tableData} />
          </TabPane>
          <TabPane tab="TAB2" key="2">
            <Table columns={columns} dataSource={tableData} />
          </TabPane>
          <TabPane tab="TAB3" key="3">
            <Table columns={columns} dataSource={tableData} />
          </TabPane>
        </Tabs>
        <Divider style={{ marginTop: 20, marginBottom: 20 }} />
        <Button type="primary" onClick={showModal}>
          编辑
        </Button>
        {this.productModal()}
      </Drawer>
    );
  }
}
