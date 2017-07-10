import React, { Component } from 'react'
// import { Form, Input, Button, Modal } from 'antd'
import SpuPlane from './components/spu-plane'
import SkuPlane from './components/sku-plane'
// const FormItem = Form.Item

class CommodityEdit extends Component {
  constructor () {
    super()
    this.state = {
      attributesVisible: false
    }
    this.showAttributesDialog = this.showAttributesDialog.bind(this)
  }

  showAttributesDialog () {
    this.setState({
      attributesVisible: false,
    })
  }

  render () {
    return (
      <div className="commodity-edit">
        <SpuPlane spu={ { demo: 123 } }></SpuPlane>
        <SkuPlane></SkuPlane>
      </div>
    )
  }
}

export default CommodityEdit
