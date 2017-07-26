import React, { PureComponent } from 'react'
import { Button, Modal } from 'antd'
import SpuList from './components/spu-list'
import SkuList from './components/sku-list'

/**
 * @export
 * @page
 * @module 商品选择demo页
 */
export default class extends PureComponent {
  constructor () {
    super()

    this.state = {
      editVisible: false,
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
    sku.spu = this.state.selectedSpu
    console.log(sku)
  }

  render () {
    return (
      <div className="goods-select-demo">
        <Button onClick={this.setState({ editVisible: true })}>选择</Button>

        <Modal
          visible={this.state.editVisible}
          title="选择商品"
          width={800}>
          { this.state.step === 1 && <SpuList select={this.handleSpuSelect}></SpuList> }

          { this.state.step === 2 && <SkuList list={this.state.selectedSpu.sku} select={this.handleSkuSelect}></SkuList> }
        </Modal>
      </div>
    )
  }
}
