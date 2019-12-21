import * as React from 'react';
import { Icon, Modal, Upload, message } from 'antd';

import styles from './upload.less';

export default class UploadFile extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    // accept: ".jpg,.png",
  };

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleRemove = () => {
    const { disabled } = this.props;
    return !disabled;
  };

  handleCancel = () => this.setState({ previewVisible: false });

  beforeUpload = file => {
    const { maxFileSize } = this.props;
    if (maxFileSize) {
      const isLtMax = file.size / 1024 / 1024 < maxFileSize;
      if (!isLtMax) {
        message.error(`文件大小超过${maxFileSize}M限制`);
      }
      return isLtMax;
    }
    return null;
  };

  render() {
    const { fileList, num, onChange, disabled, size } = this.props;
    const list = fileList || [];
    const { previewVisible, previewImage } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传</div>
      </div>
    );
    return (
      <div className="clearfix">
        {size === 'tiny' ? (
          <Upload
            // eslint-disable-next-line no-nested-ternary
            className={`${
              // eslint-disable-next-line no-nested-ternary
              list.length === 4
                ? styles.inquiryUpload4
                : list.length === 5
                  ? styles.inquiryUpload5
                  : ''
            } ${styles.inquiryUpload}`}
            name="cover"
            action="/server/public/api/product/upload"
            listType="picture-card"
            fileList={list}
            onChange={onChange}
            onPreview={this.handlePreview}
            onRemove={this.handleRemove}
            beforeUpload={this.beforeUpload}
            disabled={disabled}
          >
            {list.length >= num ? null : uploadButton}
          </Upload>
        ) : (
          <Upload
            className={
              // eslint-disable-next-line no-nested-ternary
              list.length === 4 ? styles.uploadbox4 : list.length === 5 ? styles.uploadbox5 : ''
            }
            name="cover"
            action="/server/public/api/product/upload"
            listType="picture-card"
            fileList={list}
            onChange={onChange}
            onPreview={this.handlePreview}
            onRemove={this.handleRemove}
            beforeUpload={this.beforeUpload}
            disabled={disabled}
          >
            {list.length >= num ? null : uploadButton}
          </Upload>
        )}

        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
