import React, { Component } from 'react'
import SkuItem from './sku-item'
import style from './create-sku-list.css'

class CreateSkuList extends Component {
  constructor (props) {
    super(props)
  }
  render () {
    return (
      <div className="create-sku-list">
        <div className={style['create-sku-list__head']}>
          <div>SKU内容</div>
          <div>交期</div>
          <div>起订量</div>
          <div>价格</div>
          <div>操作</div>
        </div>
        {this.props.skus.map((sku, index) => (
          <div className="create-sku-list__item">
            <SkuItem sku={sku} changeEarly={e => this.props.changeEarly(e, index)} changeLatest={e => this.props.changeLatest(e, index)} changeMini={e => this.props.changeMini(e, index)} changePrice={e => this.props.changePrice(e, index)} handleRemove={this.props.handleRemove}></SkuItem>
          </div>
        ))}
      </div>
    )
  }
}

export default CreateSkuList
