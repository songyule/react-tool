import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Form, Button } from 'antd'
import AddGoods from './add-goods'
import style from './topic-form.css'
import Editor from 'components/richEditor'
import SameForm from './sameForm'

const FormItem = Form.Item

/**
 *
 * @export
 * @page
 * @module 新增专题文章页面
 */
@Form.create()
export default class TopicForm extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      isFirst: true,
      contentState: props.content,
      fileList: '',
      selectedRowObjs: []
    }
  }

  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
  }

  componentWillReceiveProps (e) {
    if (!this.state.isFirst) return

    this.setState({
      isFirst: false,
      fileList: [],
      contentState: e.content,
      // value: e.article_tag && e.article_tag.map(item => item.id),
      display: e.status === 2,
      selectedRowObjs: e.spu || []
    })
    if (!e.cover_image) this.setState({fileList: ''})
  }

  submit = (e) => {
    e.preventDefault()

    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      let obj = {
        'article_type': 1,
        'title': fieldsValue.title,
        'cover_image': fieldsValue.image[0].response,
        'content': this.state.contentState,
        'weight': fieldsValue.weight,
        'status': this.refs.common.state.checked ? 2 : 1,
        'article_tag': this.refs.common.state.tags,
        'spu': this.state.selectedRowObjs.map(item => item.id),
      }
      this.props.handleSubmit(obj)
    })
  }

  onChange = (e) => {
    this.setState({contentState: e})
  }

  onContentStateChange = (contentState) => {
    this.setState({
      contentState
    })
  }

  handleChange = (fileList) => this.setState({ fileList })

  goodsChange = (selectedRowObjs) => this.setState({ selectedRowObjs })

  render() {
    const { getFieldDecorator } = this.props.form
    const { selectedRowObjs } = this.state

    const formItemLayout = {
      labelCol: {
        sm: { span: 2 },
      },
      wrapperCol: {
        sm: { span: 22 },
      },
    };

    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 12,
          offset: 12,
        },
      },
    }

    return (
      <div>
        <div className={style.content}>
          <Form onSubmit={this.submit}>
            {/* 通用的 formItem 内容 */}
            <SameForm
              ref="common"
              getFieldDecorator={getFieldDecorator}
              onChange={this.handleChange}
              {...this.props}
              fileList={this.state.fileList}
            ></SameForm>
            <FormItem
              {...formItemLayout}
              label="内容"
            >
              <div>
                <Editor
                  contentState={this.state.contentState}
                  onChange={this.onChange}
                />
              </div>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="添加商品"
            >
            <AddGoods selectedRowObjs={selectedRowObjs} onChange={this.goodsChange}></AddGoods>
            </FormItem>
            <FormItem {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit" size="large" onClick={this.submit}>保存并创建</Button>
            </FormItem>
            </Form>
        </div>
      </div>
    )
  }
}
