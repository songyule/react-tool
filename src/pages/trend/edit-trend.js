import React, { PureComponent } from 'react'
import { Form, message } from 'antd'

import Title from 'components/title'
import TrendForm from './components/trend-form'
import { changeArticle, getArticleDetail } from 'actions/article'

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
      article: {}
    }
  }

  getArticle = async () => {
    const { data } = await getArticleDetail(this.props.match.params.id)
    this.setState({
      article: data
    })
  }

  handleSubmit = (e) => {
    changeArticle(this.props.match.params.id, e).then(res => {
      this.props.history.push('/main/trend')
      message.success('修改成功')
    })
  }

  componentWillMount() {
    this.getArticle()
  }

  render() {
    const { article } = this.state

    return (
      <div>
        <Title title="编辑趋势文章"></Title>
        <TrendForm handleSubmit={this.handleSubmit} {...article}></TrendForm>
      </div>
    )
  }
}
