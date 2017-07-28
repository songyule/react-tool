import React, { PureComponent } from 'react'
import { Modal } from 'antd'
import SpuList from './components/spu-list'
import SkuList from './components/sku-list'

/**
 * @export
 * @page
 * @module 商品选择弹框
 */
export default class extends PureComponent {
  constructor () {
    super()

    this.state = {
      selectedSpu: {},
      step: 1
    }
  }

  handleSpuSelect = (spu) => {
    this.setState({
      step: 2,
      selectedSpu: spu
    })
  }

  handleSkuSelect = (sku) => {
    const resultSku = {...sku}
    resultSku.spu = this.state.selectedSpu
    this.props.callback(resultSku)
  }

  handleCancel = () => {
    this.setState({
      step: 1,
      selectedSpu: {}
    })
    this.props.onCancel()
  }

  render () {
    return (
      <div className="commodity-selection">
        <Modal
          visible={this.props.visible}
          title={ this.state.step === 1 ? '选择商品' : '选择商品-选择SKU' }
          width={800}
          footer={null}
          onCancel={this.handleCancel}>
          { this.state.step === 1 && <SpuList select={this.handleSpuSelect}></SpuList> }

          { this.state.step === 2 && <SkuList list={this.state.selectedSpu.sku} select={this.handleSkuSelect}></SkuList> }
        </Modal>
      </div>
    )
  }
}
