import React, { Component, Fragment } from 'react';
import { connect } from 'dva';

import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
// import { ContentUtils } from 'braft-utils';

import {
  Form,
  // Input,
  Modal,
  Row,
  Col,
  Button,
  Tabs,
  Upload,
  DatePicker,
  Icon,
  message,
  Input,
} from 'antd';
import NumericInput from '@/components/common/NumericInput';

import styles from './Index.less';

const { TextArea } = Input;
const FormItem = Form.Item;
const { TabPane } = Tabs;

// let id = 1;
// let ids = [];

@connect(({ customer }) => ({
  customer,
}))
@Form.create()
export default class CreateCraftModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      tabKeys: props.record.des.map(() => [0]),
      tabIndex: 0,
      // editorState: null
    };
  }

  showModelHandler = e => {
    if (e) e.stopPropagation();
    // const { form } = this.props;
    // ids = record.des.map(() => 1);
    this.setState({
      visible: true,
    });

    // setTimeout(() => {
    //   form.setFieldsValue({
    //     content00: BraftEditor.createEditorState(null)
    //   });
    // }, 1000);
  };

  hideModelHandler = () => {
    this.setState({
      visible: false,
    });
  };

  remove = k => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    const { tabKeys, tabIndex } = this.state;
    const curkey = tabKeys[tabIndex];
    curkey.splice(k, 1);
    tabKeys[tabIndex] = curkey;
    // console.log('aa', curkey[curkey.length - 1] + 1);
    this.setState({
      tabKeys: [...tabKeys],
    });
  };

  add = () => {
    const { tabKeys, tabIndex } = this.state;
    const curkey = tabKeys[tabIndex];
    tabKeys[tabIndex] = curkey.concat(curkey[curkey.length - 1] + 1);
    // console.log('aa', curkey[curkey.length - 1] + 1);
    this.setState({
      tabKeys: [...tabKeys],
    });
  };

  handleUploadChange = ({ fileList }) =>
    fileList.map(file => ({
      status: file.status,
      uid: file.uid,
      url: file.response ? file.response.data : file.url,
    }));

  fileChange = ({ file }) => {
    if (file.status === 'done') {
      // console.log(file);
    }
  };

  tabCallback = key => {
    // id = ids[key];
    this.setState({
      tabIndex: key,
    });
  };

  myUploadFn = param => {
    const serverURL = '/server/public/api/product/upload';
    const xhr = new XMLHttpRequest();
    const fd = new FormData();

    const successFn = () => {
      if (xhr.status === 200) {
        // console.log(xhr)
        const res = JSON.parse(xhr.response);
        // 假设服务端直接返回文件上传后的地址
        // 上传成功后调用param.success并传入上传后的文件地址
        param.success({
          url: res.data,
          meta: {
            id: 'xxx',
            title: 'xxx',
            alt: 'xxx',
            loop: true, // 指定音视频是否循环播放
            autoPlay: true, // 指定音视频是否自动播放
            controls: true, // 指定音视频是否显示控制栏
            poster: 'http://xxx/xx.png', // 指定视频播放器的封面
          },
        });
      }
    };

    const progressFn = event => {
      // 上传进度发生变化时调用param.progress
      param.progress((event.loaded / event.total) * 100);
    };

    const errorFn = () => {
      // 上传发生错误时调用param.error
      param.error({
        msg: 'unable to upload.',
      });
    };

    xhr.upload.addEventListener('progress', progressFn, false);
    xhr.addEventListener('load', successFn, false);
    xhr.addEventListener('error', errorFn, false);
    xhr.addEventListener('abort', errorFn, false);

    fd.append('cover', param.file);
    xhr.open('POST', serverURL, true);
    xhr.send(fd);
  };

  okHandler = () => {
    const { onOk, form, record } = this.props;
    const { tabKeys } = this.state;
    form.validateFields((errors, values) => {
      if (!errors) {
        const tabs = record.des.map((item, index) => ({
          product: item.product ? item.product.id : '',
          file: values[`file${index}`].file.response.data,
          shape: values[`shape${index}`],
          color: values[`color${index}`],
          size: values[`size${index}`],
          material: values[`material${index}`],
          brand: values[`brand${index}`],
          num: values[`num${index}`],
          package: values[`package${index}`],
          extra: values[`extra${index}`],
          ordate: values[`ordate${index}`].format('YYYY-MM-DD'),
          des: [], // values[`content${index}`].map(el => el.toHTML()),
        }));

        tabs.forEach((tab, index) => {
          const arr = tabKeys[index].map((o, idx) => values[`content${index}${idx}`].toHTML());
          tab.des.push(arr);
        });
        const obj = {
          sn: record.sn,
          tab: tabs,
        };
        // console.log(values);
        // console.log(tabs);
        onOk(obj);
        this.hideModelHandler();
      } else {
        message.warning('还有产品工艺未填写');
      }
    });
  };

  render() {
    const { visible, tabKeys, tabIndex } = this.state;
    const { form, children, record } = this.props;
    const { getFieldDecorator, getFieldValue } = form;

    const controls = [
      'font-size',
      'line-height',
      'letter-spacing',
      'separator',
      'bold',
      'italic',
      'underline',
      'text-color',
      'separator',
      'list-ul',
      'list-ol',
      'link',
      'separator',
      'media',
    ];

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    };

    getFieldDecorator('keys', { initialValue: tabKeys[tabIndex] });
    const keys = getFieldValue('keys');
    // console.log(keys);

    const formItems = record.des.map((item, index) => (
      <Fragment key={item.id}>
        <FormItem label="上传工艺单" {...formItemLayout}>
          {form.getFieldDecorator(`file${index}`, {
            rules: [{ required: true, message: '是必填项' }],
            initialValue: '',
          })(
            <Upload
              action="/server/public/api/product/upload"
              name="cover"
              onChange={this.fileChange}
            >
              <Button icon="upload">上传</Button>
            </Upload>
          )}
        </FormItem>

        <FormItem label="型号" {...formItemLayout}>
          {form.getFieldDecorator(`shape${index}`, {})(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem label="数量" {...formItemLayout}>
          {form.getFieldDecorator(`num${index}`, {})(<NumericInput placeholder="请输入" />)}
        </FormItem>

        <FormItem label="尺寸" {...formItemLayout}>
          {form.getFieldDecorator(`size${index}`, {})(<Input placeholder="请输入" />)}
        </FormItem>

        <FormItem label="材料" {...formItemLayout}>
          {form.getFieldDecorator(`material${index}`, {})(<Input placeholder="请输入" />)}
        </FormItem>

        <FormItem label="商标" {...formItemLayout}>
          {form.getFieldDecorator(`brand${index}`, {})(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem label="包装" {...formItemLayout}>
          {form.getFieldDecorator(`package${index}`, {})(<Input placeholder="请输入" />)}
        </FormItem>

        <FormItem label="颜色" {...formItemLayout}>
          {form.getFieldDecorator(`color${index}`, {})(<Input placeholder="请输入" />)}
        </FormItem>

        <Form.Item label="备注" {...formItemLayout}>
          {form.getFieldDecorator(`extra${index}`, {
            // rules: [{ required: true, message: '是必填项' }],
          })(
            <TextArea
              style={{ width: '80%' }}
              placeholder="输入备注"
              autosize={{ minRows: 2, maxRows: 6 }}
            />
          )}
        </Form.Item>

        <FormItem label="发货时间" {...formItemLayout}>
          {form.getFieldDecorator(`ordate${index}`, {
            rules: [{ required: true, message: '是必填项' }],
          })(<DatePicker style={{ width: '60%' }} />)}
        </FormItem>

        {keys.map(k => (
          <FormItem {...formItemLayout} label={`工艺内容${k + 1}`} key={k}>
            {getFieldDecorator(`content${index}${k}`, {
              validateTrigger: 'onBlur',
              // initialValue: BraftEditor.createEditorState(''),
              rules: [
                {
                  required: false,
                  // validator: (_, value, callback) => {
                  //   if (value.isEmpty()) {
                  //     callback('请输入工艺内容');
                  //   } else {
                  //     callback();
                  //   }
                  // },
                },
              ],
            })(
              <BraftEditor
                controls={controls}
                contentStyle={{ height: 150 }}
                placeholder="请输入工艺内容"
                media={{
                  accepts: { image: 'image/png,image/jpeg,image/gif,image/webp,image/apng' },
                  uploadFn: this.myUploadFn,
                }}
                style={{
                  marginLeft: '14px',
                  display: 'inline-block',
                  width: '95%',
                  border: '1px solid #d1d1d1',
                }}
              />
            )}
            {keys.length > 1 ? (
              <Icon
                style={{ height: '198px', position: 'absolute', cursor: 'pointer' }}
                type="minus-circle-o"
                onClick={() => this.remove(k)}
              />
            ) : null}
          </FormItem>
        ))}
        <FormItem {...formItemLayoutWithOutLabel}>
          <Button type="primary" shape="circle" icon="plus" size="large" onClick={this.add} />
        </FormItem>
        {/* <Form.Item label="备注" {...formItemLayout}>
          {form.getFieldDecorator(`remark${index}`, {
              // rules: [{ required: true, message: '是必填项' }],
            })(
              <TextArea
                style={{ width: '80%' }}
                placeholder="输入备注"
                autosize={{ minRows: 2, maxRows: 6 }}
              />
            )}
        </Form.Item> */}
      </Fragment>
    ));

    return (
      <span>
        <span onClick={this.showModelHandler}>{children}</span>
        <Modal
          width={960}
          destroyOnClose
          // centered
          title="创建工艺单"
          bodyStyle={{ maxHeight: 'calc(100vh - 250px)', overflow: 'auto' }}
          visible={visible}
          maskClosable={false}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
        >
          <Row>
            <Col span={8}>
              <div className={styles.itemCol}>
                客户名称:{' '}
                <span style={{ color: '#333' }}>{record.client ? record.client.name : ''}</span>
              </div>
              <div className={styles.itemCol}>
                合同编号: <span style={{ color: '#333' }}>{record.sn}</span>
              </div>
            </Col>
            <Col span={8}>
              <div className={styles.itemCol}>
                创建日期:
                <span style={{ color: '#333' }} />
              </div>
              <div className={styles.itemCol}>合同类型:</div>
            </Col>
            <Col span={8}>
              <div className={styles.itemCol}>预留位置:</div>
              <div className={styles.itemCol} />
            </Col>
          </Row>
          {/* <Divider style={{ marginTop: 10, marginBottom: 0 }} /> */}

          <div>
            <Form onSubmit={this.okHandler}>
              <Tabs defaultActiveKey="0" onChange={this.tabCallback}>
                {record.des.map((item, index) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <TabPane tab={item.product ? item.product.name : 'null'} key={index}>
                    {formItems[index]}
                  </TabPane>
                ))}
              </Tabs>
            </Form>
          </div>
        </Modal>
      </span>
    );
  }
}
