import React, { PureComponent } from 'react'
import { Form, Input, Switch } from 'antd'
import PropTypes from 'prop-types'
import MyUpload from './img-upload'
import store from '@/redux/store'
const FormItem = Form.Item

/**
 *
 * @export
 * @component
 * @module 文章通用的 formItem
 */
export default class SameForm extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      fileList: props.fileList || '',
      checked: false,
      isFirst: true
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.id === this.props.id) return

    this.setState({
      checked: nextProps.status === 2,
    })

    if (nextProps.cover_image && this.state.isFirst) {
      this.setState({
        fileList: [{
          uid: -1,
          name: 'sdhjkfhsyuiweyrnn222.png',
          status: 'done',
          url: nextProps.cover_image,
          response: nextProps.cover_image,
          thumbUrl: nextProps.cover_image,
        }]
      })
    }
  }

  changeE = (e) => {
    this.setState({
      checked: e
    })
  }

  static defaultProps = {
    title: '',
    weight: '',
    status: '',
    fileList: []
  }

  static propTypes = {
    getFieldDecorator: PropTypes.func.isRequired,
  }

  handleChange = (fileList) => {
    this.setState({ fileList }, this.props.onChange(fileList))
  }

  render() {
    const { getFieldDecorator, status } = this.props
    const name = store.getState().userLogin.name_cn
    const formItemLayout = {
      labelCol: {
        sm: { span: 2 },
      },
      wrapperCol: {
        sm: { span: 22 },
      },
    }
    const forms = [
      {
        label: '专题标题',
        hasFeedback: true,
        name: 'title',
        opts: {
          initialValue: this.props.title,
          rules: [{
            required: true, message: '请输入专题标题',
          }],
        },
        content: <Input />
      },
      {
        label: '排序值',
        hasFeedback: false,
        name: 'weight',
        opts: {
          initialValue: this.props.weight,
          rules: []
        },
        content: <Input />
      },
      {
        label: '是否显示',
        hasFeedback: false,
        name: 'display',
        opts: {
          initialValue: status === 2,
        },
        content: <Switch checkedChildren={'显示'} unCheckedChildren={'隐藏'} checked={this.state.checked} onChange={this.changeE} />
      },
      {
        label: '发布人',
        hasFeedback: false,
        name: 'name',
        opts: {},
        content: <span>{name}</span>
      },
      {
        label: '封面图',
        hasFeedback: true,
        name: 'image',
        opts: {
          initialValue: this.state.fileList,
          rules: [{
            required: true, message: '请上传一张图片',
          }],
        },
        content: <MyUpload onChange={this.handleChange} fileList={this.state.fileList}></MyUpload>
      },
    ]
    return (
      <div>
        {
          forms.map(form => {
            return (
              <FormItem
                {...formItemLayout}
                label={form.label}
                hasFeedback={form.hasFeedback}
                key={form.name}
              >
                {getFieldDecorator(form.name, form.opts)(
                  form.content
                )}
              </FormItem>
            )
          })
        }
      </div>
    )
  }
}
