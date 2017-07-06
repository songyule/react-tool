import React, { Component } from 'react'
import { Button, Input } from 'antd'

class SkuItem extends Component {
  constructor (props) {
    super(props)
  }

  showAttributes (attributes) {
    return Object.keys(attributes).map(key => `${attributes[key].name}:${attributes[key].value}`).join(',')
  }

  render () {
    return (
      <div className="sku-item">
        <div className="sku-item__content">
          { this.showAttributes(this.props.sku.attributes) }
        </div>
        <div className="sku-item__col">
          <Input onChange={this.props.changeEarly}></Input>
        </div>
        <div className="sku-item__col">
          <Input onChange={this.props.changeLatest}></Input>
        </div>
        <div className="sku-item__col">
          <Input onChange={this.props.changeMini}></Input>
        </div>
        <div className="sku-item__col">
          <Input onChange={this.props.changePrice}></Input>
        </div>
        <div className="sku-item__col">
          <Button onChange={this.props.handleRemove}>删除</Button>
        </div>
      </div>
    )
  }
}

export default SkuItem
