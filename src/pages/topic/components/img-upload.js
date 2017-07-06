import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Upload, Icon, Modal } from 'antd'
import { wrapperUploadQiniu } from 'api/common'
import cs from 'classnames'
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
      visible: false,
      temp: '',
      fileList: this.props.fileList || '',
      previewVisible: false,
      previewImage: '',
      uploadProps: {},
      isChanged: false
    }
    console.log(this.state)
  }

  static defaultProps = {
    length: 1
  }

  static propTypes = {
    onChange: PropTypes.func.isRequired
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ fileList: nextProps.fileList })
  }

  customRequest = (config) =>{
    wrapperUploadQiniu(config.file, config.onProgress).then(res => {
      config.onSuccess(res)
      this.setState({
        fileList: this.state.fileList
      }, () => this.props.onChange(this.state.fileList))
    })
  }

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    })
  }

  handleChange = ({ fileList }) => {
    // this.props.onChange(fileList)
    this.setState({
      fileList
    })
  }

  render() {

    const { previewVisible, previewImage, fileList } = this.state
    console.log(fileList, 9999)
    let uploadProps = {
      listType: 'picture-card',
      fileList: fileList,
      customRequest: this.customRequest,
      onChange: this.handleChange,
      onPreview: this.handlePreview,
      multiple: true,
      className: cs({
        [style['upload-list-inline']]: true,
        [this.props.className]: true
      })
    }

    return (
      <div>
          <Upload {...uploadProps}>
            {fileList.length < this.props.length
              ? (<div>
                  <Icon type="plus" />
                  <div className="ant-upload-text">上传图片</div>
                </div>)
              : null
            }
          </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    )
  }
}
