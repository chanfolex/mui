/* eslint-disable react/sort-comp */
import React, { PureComponent } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Form,
  Drawer,
  Row,
  Col,
  Divider,
  Tabs,
  Table,
  Modal,
  Button,
  Select,
  Message,
  Input,
  Upload,
  Icon
} from 'antd';

const { TabPane } = Tabs;
const { Option } = Select;

@Form.create()
export default class BomSlide extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      list: [], // 接口数据
      currentTabs: 0, // 当前的tabs
      productList: [], // 产品列表
      count: 3, // 记录作用
      modalVisible: false, // 是否显示modal
      temporaryData: [], // 打开Modal之后临时存放
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    // 查询分类
    dispatch({
      type: 'bom/fetchItems',
      payload: {
        product: 671,
      },
    }).then(res => {
      if (res.code == 200) {
        this.setState({
          list: res.data,
        });
      }
    });
  }

  // 删除产品
  deleteHandle(id) {
    const { dispatch } = this.props;
    dispatch({
      type: 'bom/update',
      payload: {
        status: 2,
        id: id,
      },
    }).then(() => {
      Message.success('删除成功');
    });
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
    const { list, count, temporaryData, modalVisible, productList, currentTabs } = this.state;
    // 增加一行
    const addItem = i => {
      temporaryData.splice(i + 1, 0, {
        key: `${count}`,
        id: '',
        num: '',
        product: {
          id: '',
          name: ''
        },
      });
      // 这里需要调用删除接口
      this.setState({ temporaryData: [...temporaryData], count: count + 1 });
    };

    // 删除某一行
    const removeItem = i => {
      if (temporaryData.length <= 1) {
        Message.error('这是最后一条数据不可删除');
      } else {
        temporaryData.splice(i, 1);
        this.setState({ temporaryData: [...temporaryData] });
      }
    };

    // 提交表单
    const handleOk = () => {
      const { dispatch } = this.props;
      // 首先是数据清洗
      let des = [];
      let state = true;
      temporaryData.map(item => {
        if (item.product.id != '' && item.num.length > 0) {
          des.push({ product: item.product.id, num: item.num, file: item.file });
        } else {
          state = false;
        }
      });
      if (state) {
        dispatch({
          type: 'bom/update',
          payload: {
           type: list[currentTabs].id,
            des: des 
          }
        }).then(res => {
          if (res) {
            this.setState({ productList: res.data.list })
          }
        })
        this.setState({
          modalVisible: false,
        });
        Message.success('配置成功');
      } else {
        Message.error('请填写完整表单');
      }
    };

    // 隐藏modal
    const handleCancel = () => {
      this.setState({
        modalVisible: false,
      });
    };

    // 输入表单
    const inputHandle = (v, i) => {
      temporaryData[i].num = v
      this.setState({ temporaryData: [...temporaryData] })
      console.log(temporaryData)
    };

    // 搜索
    const searchHandle = value => {
      const { dispatch } = this.props;
      if (value == '') {
        this.setState({ productList: [] });
      } else {
        // 查询分类
        dispatch({
          type: 'product/fetchProductOption',
          payload: {
            abbr: value,
          },
        }).then(res => {
          if (res.code == 200) {
            this.setState({ productList: res.data.list });
          }
        });
      }
    };

    // 选择产品
    const selectHandle = (v, i, o) => {
      console.log(v)
      console.log(o)
      temporaryData[i].product = {
        id: v,
        name: o.props.children
      }
      this.setState({ temporaryData: [...temporaryData] }, console.log(temporaryData))

    };

    // 上传图纸
    const updateChange = (file, i) => {
      if (file.status === 'done') {
        temporaryData[i].file = file.response.data
        this.setState({ temporaryData: [...temporaryData] })
      }
    }

    const columns = [
      {
        title: '组件编号',
        dataIndex: 'id',
        width: 100,
        render: text => <a>{text}</a>,
      },
      {
        title: '组件名称',
        dataIndex: 'product',
        width: 200,
        render: (text, record, i) => (
          <Select
            showSearch
            style={{ width: 160 }}
            placeholder="搜索产品"
            value={text.name}
            filterOption={false}
            onSearch={value => searchHandle(value)}
            onSelect={(value, option) => selectHandle(value, i, option)}
          >
            {productList.map((item, index) => (
              <Option value={item.id} key={index} option={item}>
                {item.name}
              </Option>
            ))}
          </Select>
        ),
      },
      {
        title: '类型',
        dataIndex: 'id',
        width: 100,
        render: text => <a>{text}</a>,
      },
      {
        title: '材料',
        dataIndex: 'id',
        width: 100,
        render: text => <a>{text}</a>,
      },
      {
        title: '图号',
        dataIndex: 'id',
        width: 100,
        render: text => <a>{text}</a>,
      },
      {
        title: '数量',
        dataIndex: 'num',
        width: 160,
        render: (text, record, i) => (
          <Input
            placeholder="请输入数量"
            type="number"
            value={text}
            onChange={e => inputHandle(e.target.value, i)}
          />
        ),
      },
      {
        title: '图纸',
        dataIndex: 'id',
        width: 100,
        render: (text, record, i) => {
          record.file != null ? <Button type="primary" shape="circle" icon="play-circle" /> : null;
        },
      },
      {
        title: "上传图纸",
        width: 200,
        dataIndex: 'action',
        render: (text, record, i) => (
          <Upload
            action="/server/public/api/product/upload"
            name="cover"
            onChange={(file) => updateChange(file.file, i)}
          >
            <Button type="primary" shape="circle" icon="cloud-upload" />
          </Upload>
        )
      },
      {
        title: '操作',
        dataIndex: 'action',
        width: 200,
        render: (text, record, i) => (
          <span style={{ display: 'flex' }}>
            <Button
              type="primary"
              shape="circle"
              icon="plus"
              onClick={() => addItem(i)}
              style={{ margin: '0 10px' }}
            />
            <Button type="primary" shape="circle" icon="delete" onClick={() => removeItem(i)} />
          </span>
        ),
      },
    ];
    return (
      <Modal
        title="配置"
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
    const { list, currentTabs } = this.state;
    // 删除某条数据
    const deleteItem = (index, data) => {
      this.deleteHandle(data.id);
      list[currentTabs].des.splice(index, 1);
      // 这里需要调用删除接口
      this.setState({ list: [...list] });
    };

    // 是否显示modal
    const showModal = () => {
      let data = {
        id: '',
        num: '',
        product: {},
      };
      this.setState({
        modalVisible: true,
        temporaryData:
          list[currentTabs].des.length > 0
            ? JSON.parse(JSON.stringify(list[currentTabs].des))
            : [data],
      });
    };

    // 切换tabs页面
    const handleTabChange = key => {
      this.setState({ currentTabs: key });
    };

    const columns = [
      {
        title: '组件编号',
        dataIndex: 'id',
        key: 'id',
        render: text => <a>{text}</a>,
      },
      {
        title: '组件名称',
        dataIndex: 'product',
        key: 'product',
        render: text => <a>{text.name}</a>,
      },
      {
        title: '类型',
        dataIndex: 'id',
        key: 'id1',
        render: text => <a>{text}</a>,
      },
      {
        title: '材料',
        dataIndex: 'id',
        key: 'id2',
        render: text => <a>{text}</a>,
      },
      {
        title: '库存数量',
        dataIndex: 'id',
        key: 'id3',
        render: text => <a>{text}</a>,
      },
      {
        title: '订单数量',
        dataIndex: 'id',
        key: 'id4',
        render: text => <a>{text}</a>,
      },
      {
        title: '待生产',
        dataIndex: 'id',
        key: 'id5',
        render: text => <a>{text}</a>,
      },
      {
        title: '图号',
        dataIndex: 'id',
        key: 'id6',
        render: text => <a>{text}</a>,
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record, index) => <a onClick={() => deleteItem(index, text)}>删除</a>,
      },
      {
        title: '编辑',
        key: 'action',
        render: (text, record, index) => <a onClick={() => deleteItem(index, text)}>编辑</a>,
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
        <Tabs defaultActiveKey={currentTabs} onChange={key => handleTabChange(key)}>
          {list.map((item, index) => (
            <TabPane tab={item.name} key={index}>
              <Table columns={columns} dataSource={item.des} />
            </TabPane>
          ))}
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
