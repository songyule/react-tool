import React, { PureComponent } from 'react'
import { Form, message, Modal, Radio } from 'antd'

import Title from 'components/title'
import TrendForm from './components/trend-form'
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
      type: 2
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
        this.props.history.push('/main/trend')
        message.success('创建成功')
      }, 2000)
      // this.props.history.push('/main/trend')
      // message.success('创建成功')
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
        <Title title="创建趋势文章">
          <RadioGroup onChange={this.onChange} value={this.state.type}>
            <Radio value={2}>PC端</Radio>
            <Radio value={4}>微信端</Radio>
          </RadioGroup>
        </Title>
        <TrendForm handleSubmit={this.handleSubmit}></TrendForm>
      </div>
    )
  }
}
