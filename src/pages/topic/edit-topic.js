import React, { PureComponent } from 'react'
import { Form, message } from 'antd'

import Title from 'components/title'
import TopicForm from './components/topic-form'
import { getArticleDetail, changeArticle } from 'actions/article'

/**
 *
 * @export
 * @page
 * @module 修改专题文章页面
 */
@Form.create()
export default class extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      article: {}
    }
  }

  getArticle = async () => {
    const { data } = await getArticleDetail(this.props.match.params.id)
    this.setState({
      article: data
    })
  }

  handleSubmit = async (obj) => {
    // console.log(obj)
    await changeArticle(this.props.match.params.id, obj)
    message.success('修改成功')
  }

  componentWillMount() {
    this.getArticle()
  }


  render() {
    const { article } = this.state
    return (
      <div>
        <Title title="编辑专题文章"></Title>
        <TopicForm handleSubmit={this.handleSubmit} {...article}></TopicForm>
      </div>
    )
  }
}
