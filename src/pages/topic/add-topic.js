import React, { PureComponent } from 'react'
import { Form, message, Modal, Radio } from 'antd'

import Title from 'components/title'
import TopicForm from './components/topic-form'
import { createArticle } from 'actions/article'

const RadioGroup = Radio.Group

/**
 *
 * @export
 * @page
 * @module 新增专题文章页面
 */
@Form.create()
export default class extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      type: 1
    }
  }

  handleSubmit = (e) => {
    e.article_type = this.state.type

    createArticle(e).then(res => {
      const modal = Modal.info({
        content: '文章正在努力创建中'
      })
      setTimeout(() => {
        modal.destroy()
        this.props.history.push('/main/topic')
        message.success('创建成功')
      }, 2000);
    })
  }

  onChange = (e) => {
    this.setState({
      type: e.target.value,
    })
  }

  render() {
    return (
      <div>
        <Title title="创建专题文章">
          <RadioGroup onChange={this.onChange} value={this.state.type}>
            <Radio value={1}>PC端</Radio>
            <Radio value={3}>微信端</Radio>
          </RadioGroup>
        </Title>
        <TopicForm handleSubmit={this.handleSubmit} content={'<p></p>'}></TopicForm>
      </div>
    )
  }
}
