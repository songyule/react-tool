import React, { Component } from 'react'
import {toLocalSpu } from 'utils'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Editor from 'components/richEditor'
import { Button } from 'antd'
import style from './content-edit.css'
import * as commodityActions from 'actions/commodity'

@connect(
  state => state,
  dispatch => bindActionCreators(commodityActions, dispatch)
)
export default class CommodityContentEdit extends Component {
  constructor (props) {
    super(props)

    this.state = {
      spu: {},
      contentObj: {
        id: '',
        content: ''
      }
    }
  }

  async componentWillMount () {
    const id = this.props.match.params.id
    const spuRes = await this.props.getSpuInfo(id)
    const contentRes = await this.props.getSpuText(id)
    this.setState({
      spu: toLocalSpu(spuRes.data),
      contentObj: {
        id: contentRes.data.id,
        content: contentRes.data.text,
        showContent: contentRes.data.text
      }
    })
  }

  changeText = (content) => {
    this.setState({
      contentObj: { ...this.state.contentObj, content: content }
    })
  }

  handleSubmit = async () => {
    this.state.contentObj.id ? await this.props.updateSpuText(this.state.spu.id, {text: this.state.contentObj.content}) : await this.props.createSpuText({ spu_id: this.state.spu.id, text: this.state.contentObj.content })
    this.props.history.push('/main/goods')
  }

  render () {
    return (
      <div className={style['page_commodity-content-edit']}>
        <div className={style['commodity-content-edit__header-row']}>
          <h3>商品名称：{this.state.spu.title}</h3>
        </div>
        <div className={style['commodity-content-edit__operate-row']}>
          <h3>详情页</h3>
          <div className="commodity-content-edit__btn-box">
            <Button onClick={this.handleSubmit}>保存</Button>
          </div>
        </div>
        <Editor
          contentState={this.state.contentObj.content}
          editClass={style['commodity-content-edit__editor']}
          wrapperClass={style['commodity-content-edit__wrapper']}
          onChange={this.changeText}/>
      </div>
    )
  }
}
