import React, { PureComponent } from 'react';
import {
  Form,
  // Input,
  Drawer,
  Tabs,
  Divider,
  Row,
  Col,
  Table,
  Icon,
  message,
  Popconfirm,
  Button
} from 'antd';

import TableInputSearch from '@/components/common/TableInputSearch';
// import exportExcel from './exportExcel';
const { TabPane } = Tabs;

@Form.create()
export default class SettleSlide extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      inquirys: [],
      mapdate:'',
      cards:[],
      pagination: {},
      loading: false,
      modalVisible: false,
      currentRow: null,
    };
  }

  componentDidMount() {
    this.fetchInquiry();
    
  }

  // 查询询盘记录
  fetchInquiry = (params = {}) => {
    const { dispatch, formRow } = this.props;
    this.setState({ loading: true });
    dispatch({
      type: 'settle/fetchEmployeeItems',
      payload: {
        ...params,
        employee: formRow.id,
      },
    }).then(res => {
      if (res.code === 200) {
        const { pagination } = this.state;
        pagination.total = res.data.sum;
        this.setState({
          loading: false,
          inquirys: res.data.list,
          mapdate:res.data.mapdate,
          pagination,
        });
      }
    });
  };


  handleDelete = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'settle/update',
      payload: {
        id: fields.id,
        status: 2,
      },
      callback: res => {
        if (res.code === 200) {
          const { pagination } = this.state;
          this.fetchInquiry({ pagination: pagination.current });
          message.success('删除成功');
        }
      },
    });
  };

  handleModalVisible = (flag, record) => {
    this.setState({
      modalVisible: !!flag,
      currentRow: record || null,
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
    this.fetchInquiry(param);
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (err) return;

      this.fetchInquiry({ sn: values.sn });
    });
  };

  render() {
    const { visible, onClose, formRow } = this.props;
    const { inquirys,mapdate,pagination, loading, modalVisible, currentRow } = this.state;

    const windowH = window.innerHeight;
    const colClass = {
      lineHeight: 1,
      marginBottom: '10px',
    };
    const spanClass = {
      display: 'inline-block',
      minWidth: '40px',
    };

    const columns = [
      {
        title: '卡号',
        dataIndex: 'card_sn',
        key: 'card_sn',
        width: 100,
      },
      {
        title: '产品名称',
        dataIndex: 'product_name',
        key: 'product_name',
        width: 100,
      },
      {
        title: '图号',
        dataIndex: 'product_shape',
        key: 'product_shape',
        width: 100,
      },
      {
        title: '投产',
        dataIndex: 'card_num',
        key: 'card_num',
        width: 100,
      },
      // {
      //   title: '类型',
      //   dataIndex: 'dtype',
      //   width: 100,
      //   key: 'dtype',
      //   render: text => <span>{text === 1 ? '成品' : '半成品'}</span>,
      // },
      {
        title: '工序',
        dataIndex: 'procedure_name',
        key: 'procedure_name',
        width: 100,
      },
      {
        title: '序号',
        dataIndex: 'position',
        key: 'position',
        width: 100,
      },
      {
        title: '合格数',
        dataIndex: 'num',
        key: 'num',
        width: 100,
      },
      {
        title: '结算单价',
        dataIndex: 'price',
        key: 'price',
        width: 100,
      },
      {
        title: '结算金额',
        dataIndex: 'total',
        key: 'total',
        width: 100,
      },
      // {
      //   title: '行为',
      //   dataIndex: 'otype',
      //   width: 100,
      //   key: 'otype',
      //   render: text => <span>{text === 1 ? '入库' : '出库'}</span>,
      // },
     
      {
        title: '结算时间',
        dataIndex: 'datetime',
        key: 'datetime',
        width: 100,
        render: text => <span>{text || '无'}</span>,
      },
    ];

    return (
      <Drawer
        width="50%"
        title="工资详情"
        placement="right"
        destroyOnClose
        closable={false}
        onClose={onClose}
        visible={visible}
      >
        <Row>
          <Col span={8}>
            <div style={colClass}>
              <span style={spanClass}>产品名称:</span>
              <span style={{ color: '#333' }}> {formRow.name}</span>
            </div>
            <div style={colClass}>
              <span style={spanClass}>图号:</span>
              <span style={{ color: '#333' }}> {formRow.shape}</span>
            </div>
          </Col>
          <Col span={8}>
            <div style={colClass}>
              <span style={spanClass}>存货编码:</span>
              <span style={{ color: '#333' }}> {formRow.sn}</span>
            </div>
            <div style={colClass}>
              <span style={spanClass}>联系电话:</span>
              <span style={{ color: '#333' }}> {formRow.tel}</span>
            </div>
          </Col>
          <Col span={8}>
            <div style={colClass}>
              <span style={spanClass}>半成品数量:</span>
              <span style={{ color: '#333' }}>
              {formRow.pundo}
              </span>
            </div>
            <div style={colClass}>
              <span style={spanClass}>成品数量:</span>
              <span style={{ color: '#333' }}>
              <Button type="primary" onClick={() => exportExcel(columns, inquirys,formRow.name,mapdate)}>
                导出
              </Button></span>
            </div>
          </Col>
        </Row>
        {/* <Divider style={{ marginTop: 10, marginBottom: 0 }} /> */}
        <Tabs defaultActiveKey="1" onChange={this.handleTabChange}>
          <TabPane tab="记录" key="1">
            <div>
              {
                <TableInputSearch
                  field="sn"
                  placeholder="请输入卡号搜索"
                  handlerEnter={this.fetchInquiry}
                />
              }
            </div>
            <Table
              rowKey="id"
              size="middle"
              columns={columns}
              dataSource={inquirys}
              pagination={pagination}
              loading={loading}
              onChange={this.handleTableChange}
              scroll={{ y: windowH - 360 }}
            />
          </TabPane>
        </Tabs>
        {modalVisible && (
          <InquiryDetail
            modalVisible={modalVisible}
            handleModalVisible={this.handleModalVisible}
            formRow={currentRow}
            parentRow={formRow}
          />
        )}
      </Drawer>
    );
  }
}
