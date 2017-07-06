import React, { PureComponent } from 'react'
import { Form, message } from 'antd'

import Title from 'components/title'
import TrendForm from './components/trend-form'
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
    createArticle(e).then(res => message.success('创建成功'))
  }

  render() {
    return (
      <div>
        <Title title="创建趋势文章"></Title>
        <TrendForm handleSubmit={this.handleSubmit}></TrendForm>
      </div>
    )
  }
}
