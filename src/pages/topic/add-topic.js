import React, { Component } from 'react'
import { Form, Input, Button, Modal, Switch } from 'antd'
import Goods from 'pages/commodity'

import style from './add-topic.css'
import Editor from 'components/richEditor'
import Title from 'components/title'

import MyUpload from './components/img-upload'

const FormItem = Form.Item

class addTopic extends Component {
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

  handleSubmit = (e) => {
    e.preventDefault();

    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }

      console.log('Received values of form: ', fieldsValue);
    });
  }

  onChange = (e) => {
    // console.log(e)
  }

  onContentStateChange = (contentState) => {
    this.setState({
      contentState
    })
  }

  handleChange = (fileList) => this.setState({ fileList })

  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }
  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 0 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 24 },
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
          span: 24,
          offset: 12,
        },
      },
    };

    return (
      <div className={style.content}>
        <Title title="创建专题文章"></Title>
        <Form onSubmit={this.handleSubmit}>
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
            <Input />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="是否显示"
          >
            <Switch checkedChildren={'显示'} unCheckedChildren={'不显'} />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="图片"
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
          <FormItem
            {...formItemLayout}
            label="内容">
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
          <Button type="primary" size="small" onClick={this.showModal}><h6>添加商品</h6></Button>
          <Modal
            title="Basic Modal"
            width="700"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <Goods/>
          </Modal>

          </FormItem>
          <FormItem {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit" size="large">保存并创建</Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}
export default Form.create()(addTopic)
