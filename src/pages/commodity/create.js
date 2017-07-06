import React, { Component } from 'react'
import { Button } from 'antd'
import SpuPlane from './components/spu-plane'
import CreateAttributesPlane from './components/create-attributes-plane'
import CreateSkuList from './components/create-sku-list'
import { emptySpu } from './model'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { groupBy, find } from 'lodash'
import { toRemoteSku, toRemoteSpu, cartesianProductOf } from 'utils'
import * as managementActions from 'actions/management'
import * as commodityActions from 'actions/commodity'
// const FormItem = Form.Item

@connect(
  state => state,
  dispatch => bindActionCreators({...managementActions, ...commodityActions}, dispatch)
)
class CommodityCreate extends Component {
  constructor () {
    super()
    this.state = {
      spu: {...emptySpu},
      skuAttributes: [{ name: '', value: '' }],
      skus: [],
      customAttributes: [],
      attributesVisible: false
    }
    this.showAttributesDialog = this.showAttributesDialog.bind(this)
  }

  showAttributesDialog () {
    this.setState({
      attributesVisible: false,
    })
  }

  changeName = (value) => {
    this.setState({
      spu: {...this.state.spu, title: value}
    })
  }

  changeClass = (obj, index) => {
    const classes = this.state.spu.classes
    classes[index] = obj.matchClass
    this.setState({
      spu: {...this.state.spu, classesSelected: obj.classesSelected, classes}
    })
  }

  changeSkuAttributes = (value) => {
    this.setState({
      skuAttributes: value
    })
  }

  componentWillMount = () => {
    this.props.getCommodityAttributeList({ parent_id: 1942, limit: 999999 }).then(res => {
      this.setState({
        customAttributes: res.data.attribute
      })
    })
  }

  promiseGetAttribute = (name) => {
    return new Promise((resolve, reject) => {
      const matchAttribute = find(this.state.customAttributes, { name_cn: name })
      resolve(matchAttribute)
    })
  }

  handleNext = async () => {
    const attributesObj = groupBy(this.state.skuAttributes, 'name')
    await Promise.all(Object.keys(attributesObj).map(key => {
      const matchAttribute = find(this.state.customAttributes, { name_cn: key })
      return matchAttribute ? attributesObj[key].map(item => this.props.createCommodityAttribute({ attr_type: 2, name_cn: item.value, parent_id: matchAttribute.id, weight: 1 }).then(res => { item.id = res.data.id })) : this.props.createCommodityAttribute({ attr_type: 2, name_cn: key, parent_id: 1942, weight: 1 }).then(res => {
        attributesObj[key].map(item => {
          return this.props.createCommodityAttribute({ attr_type: 2, name_cn: item.value, parent_id: res.data.id, weight: 1 }).then(res => {
            item.id = res.data.id
          })
        })
      })
    }))
    const demo = []
    Object.keys(attributesObj).map(key => {
      const attributes = []
      attributesObj[key].map(item => {
        attributes.push(item)
      })
      demo.push(attributes)
    })
    const cartesian = cartesianProductOf(...demo)
    const skus = cartesian.map(item => {
      return {
        attributes: item,
        earlyDate: '',
        latestDate: '',
        miniQuantity: 0,
        price: 0
      }
    })
    this.setState({
      skus
    })
    // this.props.createCommodityAttribute({ attr_type: 2, name_cn: '123', parent_id: 1942, weight: 1 })
  }

  handleEarly = (e, index) => {
    const skus = this.state.skus
    skus[index].earlyDate = e.target.value
    this.setState({
      skus
    })
  }

  changeLatest = (e, index) => {
    const skus = this.state.skus
    skus[index].latestDate = e.target.value
    this.setState({
      skus
    })
  }

  changeMini = (e, index) => {
    const skus = this.state.skus
    skus[index].miniQuantity = e.target.value
    this.setState({
      skus
    })
  }

  changePrice = (e, index) => {
    const skus = this.state.skus
    skus[index].price = e.target.value
    this.setState({
      skus
    })
    console.log(this.state.skus)
  }

  handleRemove = (e, index) => {
    const skus = this.state.skus
    skus.splice(index, 1)
    this.setState({
      skus
    })
  }

  handleFinish = async () => {
    const spuRes = await this.props.createSpu(toRemoteSpu(this.state.spu))
    const skusRes = this.props.createSkuList(spuRes.data.id, this.state.skus.map(sku => toRemoteSku(sku)))
    console.log(skusRes)
    // console.log(Object.keys(attributesObj).map(key => ({ key: key, value: attributesObj[key] })))
  }

  changeSpu = (spu) => {
    this.setState({
      spu
    })
  }

  render () {
    return (
      <div className="commodity-edit">
        <SpuPlane spu={this.state.spu} changeName={this.changeName} changeClass={this.changeClass} changeSpu={this.changeSpu}></SpuPlane>
        <CreateAttributesPlane skuAttributes={ this.state.skuAttributes } changeSkuAttributes={this.changeSkuAttributes}></CreateAttributesPlane>
        <CreateSkuList skus={this.state.skus} changeEarly={this.handleEarly} changeLatest={this.changeLatest} changeMini={this.changeMini} changePrice={this.changePrice} handleRemove={this.handleRemove}></CreateSkuList>
        <Button onClick={this.handleNext}>下一步</Button>
        <Button onClick={this.handleFinish}>完成</Button>
      </div>
    )
  }
}

export default CommodityCreate
