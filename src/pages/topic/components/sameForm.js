import React, { Component } from 'react'
import { Form, Input, Switch } from 'antd'
import PropTypes from 'prop-types'
import MyUpload from './img-upload'

const FormItem = Form.Item

/**
 *
 * @export
 * @component
 * @module 文章通用的 formItem
 */
export default class extends Component {
  constructor (props) {
    super(props)

    this.state = {
      fileList: [],
    }
  }

  static propTypes = {
    getFieldDecorator: PropTypes.func.isRequired
  }

  handleChange = (fileList) => this.setState({ fileList })

  render() {
    const { getFieldDecorator } = this.props

    const formItemLayout = {
      labelCol: {
        sm: { span: 2 },
      },
      wrapperCol: {
        sm: { span: 22 },
      },
    }

    return (
      <div>
        <FormItem
          {...formItemLayout}
          label="专题标题"
          hasFeedback
        >
          {getFieldDecorator('title', {
            rules: [{
              required: true, message: '请输入专题标题',
            }],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="排序值"
        >
          {getFieldDecorator('weight')(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="是否显示"
        >
          {getFieldDecorator('display')(
            <Switch checkedChildren={'显示'} unCheckedChildren={'不显'} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="发布人"
        >
          <span>这个是占位的</span>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="封面图"
          hasFeedback
        >
          {getFieldDecorator('image', {
            rules: [{
              required: true, message: '请上传一张图片',
            }],
          })(
            <MyUpload onChange={this.handleChange}></MyUpload>
          )}
        </FormItem>
      </div>
    )
  }
}
