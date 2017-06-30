import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Upload, Icon, Modal } from 'antd'
import { wrapperUploadQiniu } from 'api/common'
import style from './upload.css'

/**
 *
 * @export
 * @component
 * @module 图片上传模块
 */
export default class extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      contentState: '<p>12312312</p>',
      visible: false,
      fileList: [],
      previewVisible: false,
      previewImage: '',
    }
  }

  static defaultProps = {
    length: 1
  }

  static propTypes = {
    onChange: PropTypes.func.isRequired
  }

  customRequest = (config) =>{
    wrapperUploadQiniu(config.file).then(res => {
      config.onSuccess(res)
    })
  }


  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleChange = ({ fileList }) => {
    this.props.onChange(fileList)
    this.setState({ fileList })
  }

  render() {
    // const fileList = []
    const { fileList, previewVisible, previewImage } = this.state;

    const uploadProps = {
      listType: 'picture-card',
      defaultFileList: [...fileList],
      customRequest: this.customRequest,
      onChange: this.handleChange,
      onPreview: this.handlePreview,
      className: style['upload-list-inline']
    }

    return (
      <div>
        <Upload {...uploadProps}>
          {fileList.length >= this.props.length
            ? null
            : (<div>
                <Icon type="plus" />
                <div className="ant-upload-text">上传图片</div>
              </div>)
          }
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    )
  }
}
