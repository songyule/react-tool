import React, { PureComponent } from 'react'
import { Form, message } from 'antd'

import Title from 'components/title'
import TopicForm from './components/topic-form'
import { createArticle } from 'actions/article'

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
    }
  }

  handleSubmit = (e) => {
    createArticle(e).then(res => {
      this.props.history.push('/main/topic')
      message.success('创建成功')
    })
  }

  render() {
    return (
      <div>
        <Title title="创建专题文章"></Title>
        <TopicForm handleSubmit={this.handleSubmit} content={'<p></p>'}></TopicForm>
      </div>
    )
  }
}
