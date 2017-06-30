import React, { Component } from 'react'
import { Form, Button, Modal } from 'antd'

import Goods from 'pages/commodity'
import style from './add-topic.css'
import Editor from 'components/richEditor'
import Title from 'components/title'
import SameForm from './components/sameForm'
import { createArticle } from 'actions/article'
const FormItem = Form.Item

/**
 *
 * @export
 * @page
 * @module 新增专题文章页面
 */
@Form.create()
export default class extends Component {
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
    e.preventDefault()

    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      createArticle({
        'article_type': 1,
        'title': fieldsValue.title,
        'cover_image': fieldsValue.image[0].response,
        'content': this.state.contentState,
        'weight': fieldsValue.weight,
        'status': fieldsValue.display ? 2 : 1
      }).then(res => console.log)
    })
  }

  onChange = (e) => {
    // console.log(e)
    this.setState({contentState: e})
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
          span: 24,
          offset: 12,
        },
      },
    };

    return (
      <div>
        <Title title="创建专题文章"></Title>
        <div className={style.content}>
          <Form onSubmit={this.handleSubmit}>
            <div>
              {/* 通用的 formItem 内容 */}
              <SameForm getFieldDecorator={getFieldDecorator}></SameForm>
            </div>
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
      </div>
    )
  }
}
