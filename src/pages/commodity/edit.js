import React, { Component } from 'react'
import { Button } from 'antd'
import SpuPlane from './components/spu-plane'
import CreateAttributesPlane from './components/create-attributes-plane'
import CreateSkuList from './components/create-sku-list'
import { emptySpu } from './model'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { groupBy, find } from 'lodash'
import { toRemoteSku, toRemoteSpu, cartesianProductOf, toLocalSpu, toLocalSku } from 'utils'
import * as managementActions from 'actions/management'
import * as commodityActions from 'actions/commodity'
import style from './create.css'
// const FormItem = Form.Item

@connect(
  state => state,
  dispatch => bindActionCreators({...managementActions, ...commodityActions}, dispatch)
)
class CommodityEdit extends Component {
  constructor () {
    super()
    this.state = {
      spu: {...emptySpu},
      skuAttributes: [{ name: '', value: [''] }],
      contentObj: {
        id: '',
        content: ''
      },
      fileList: [],
      skuTypes: [],
      skus: [],
      customAttributes: [],
      step: 1,
      attributesVisible: false,
      selecteds: []
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
    this.props.getSpuInfo(this.props.match.params.id).then(res => {
      const spu = toLocalSpu(res.data)
      this.setState({
        spu,
        fileList: spu.imgList.map(item => ({
          uid: -1,
          name: 'sdhjkfhsyuiweyrnn222.png',
          status: 'done',
          url: item,
          response: item,
          thumbUrl: item,
        }))
      })
    })
    this.props.getSkuList(this.props.match.params.id).then(res => {
      const skus = res.data.map(toLocalSku)
      const attributes = []
      skus.forEach(sku => {
        attributes.push(...sku.attributes)
      })
      const groupAttributes = groupBy(attributes, 'lv2_id')
      const skuAttributes = []
      Object.keys(groupAttributes).forEach(key => {
        skuAttributes.push({ name: groupAttributes[key][0].lv2_name_cn, value: groupAttributes[key].map(item => item.name_cn) })
      })
      // skus.map(sku => sku.attributes)
      this.setState({
        skus,
        skuTypes: skus.map(sku => String(sku.type.id)),
        skuAttributes
      })
    })
    // this.props.getCommodityAttributeList({ parent_id: 1942, limit: 999999 }).then(res => {
    //   this.setState({
    //     customAttributes: res.data.attribute
    //   })
    // })
  }

  promiseGetAttribute = (name) => {
    return new Promise((resolve, reject) => {
      const matchAttribute = find(this.state.customAttributes, { name_cn: name })
      resolve(matchAttribute)
    })
  }

  spuPlaneValid = () => {
    let bool = false
    this.refs.spuPlane.validateFields(e => {
      bool = !e
    })
    return bool
  }

  createAttributesPlaneValid = () => {
    let bool = false
    this.refs.createAttributesPlane.validateFields(e => {
      bool = !e
    })
    return bool
  }

  finishFirst = async () => {
    if (!this.createAttributesPlaneValid() || !this.spuPlaneValid()) return
    // const attributesObj = groupBy(this.state.skuAttributes, 'name')
    const skuAttributes = [...this.state.skuAttributes]
    const nameRes = await this.props.multiCreateCommodityAttribute({ attribute: skuAttributes.map(item => ({ attr_type: 2, name_cn: item.name, parent_id: 1942, weight: 1 })) })
    // const nameRes = {data: [{"attr_type":2,"created_at":1499305851,"id":1959,"level":2,"lv1_id":1942,"lv1_name_cn":"测试","lv2_id":1959,"lv2_name_cn":"11","name_cn":"11","parent_id":1942,"status":1,"updated_at":1499305851,"weight":1},{"attr_type":2,"created_at":1499305851,"id":1960,"level":2,"lv1_id":1942,"lv1_name_cn":"测试","lv2_id":1960,"lv2_name_cn":"22","name_cn":"22","parent_id":1942,"status":1,"updated_at":1499305851,"weight":1}]}

    nameRes.data.forEach(item => {
      const matchAttr = find(skuAttributes, { name: item.name_cn })
      matchAttr.attribute = item
    })

    const attributes = []
    skuAttributes.forEach(attribute => {
      attribute.value.forEach(child => {
        attributes.push({ attr_type: 2, name_cn: child, parent_id: attribute.attribute.id })
      })
    })

    const childRes = await this.props.multiCreateCommodityAttribute({ attribute: attributes })
    const classifyAttributes = groupBy(childRes.data, 'lv2_id')
    const demo = []
    Object.keys(classifyAttributes).forEach(key => {
      const attributes = []
      classifyAttributes[key].forEach(item => {
        attributes.push(item)
      })
      demo.push(attributes)
    })
    const filterAttributes = this.props.commodityAttributeObj.skuAttributes.filter(item => item.name_cn === '商品类型')
    const typeAttributes = filterAttributes[0] ? filterAttributes[0].children : []
    demo.push(this.state.skuTypes.map(item => {
      return find(typeAttributes, { id: Number(item) })
    }))
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
      skus,
      step: 2
    })
    // await Promise.all(Object.keys(attributesObj).map(key => {
    //   const matchAttribute = find(this.state.customAttributes, { name_cn: key })


    //   this.setState({
    //     step: 2
    //   })
    //   return matchAttribute ?
    //   this.props.multiCreateCommodityAttribute({ attribute: attributesObj[key].map(item => ({ attr_type: 2, name_cn: item.value, parent_id: matchAttribute.id, weight: 1 })) }) :
    //   this.props.createCommodityAttribute({ attr_type: 2, name_cn: key, parent_id: 1942, weight: 1 }).then(res => {
    //     return this.props.multiCreateCommodityAttribute({attribute: attributesObj[key].map(item => ({ attr_type: 2, name_cn: item.value, parent_id: res.data.id, weight: 1 })) }).then(res => {
    //       console.log(res)
    //     })
    //     // attributesObj[key].map(item => {
    //     //   return this.props.createCommodityAttribute({ attr_type: 2, name_cn: item.value, parent_id: res.data.id, weight: 1 }).then(res => {
    //     //     item.id = res.data.id
    //     //   })
    //     // })
    //   })
    // }))
    // const demo = []
    // Object.keys(attributesObj).map(key => {
    //   const attributes = []
    //   attributesObj[key].map(item => {
    //     attributes.push(item)
    //   })
    //   demo.push(attributes)
    // })
    // const cartesian = cartesianProductOf(...demo)
    // const skus = cartesian.map(item => {
    //   return {
    //     attributes: item,
    //     earlyDate: '',
    //     latestDate: '',
    //     miniQuantity: 0,
    //     price: 0
    //   }
    // })
    // this.setState({
    //   skus
    // })
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
    const skus = [...this.state.skus]
    skus.splice(index, 1)
    this.setState({
      skus
    })
  }

  handleFinish = async () => {
    const promiseList = []
    const spuRes = await promiseList.push(this.props.updateSpu(this.state.spu.id, toRemoteSpu(this.state.spu)))
    promiseList.push(this.state.contentObj.id ? this.props.updateSpuText(this.state.spu.id, this.state.contentObj.content) : this.props.createSpuText({ spu_id: this.state.spu.id, text: this.state.contentObj.content }))
    if (this.state.spu.accessStatus === 3) {
      const data = { spu_id: spuRes.data.id, client_list: [] }
      this.state.selecteds.forEach(item => item.type === 'client' ? data.client_list.push({ client_id: item.id }) : data.client_list.push({ client_label_id: item.id }))
      promiseList.push(this.props.saveAccess(data))
    }

    // browserHistory('main/gbrowserHistoryoods')
    this.props.history.push('/main/goods')
  }

  changeSpu = (spu) => {
    this.setState({
      spu
    })
  }

  goFirst = () => {
    this.setState({
      step: 1
    })
  }

  finishSecond = () => {
    this.setState({
      step: 3
    })
  }

  changeSelecteds = (selecteds) => {
    this.setState({
      selecteds
    })
  }

  changeTypes = (types) => {
    this.setState({
      skuTypes: types
    })
  }

  receiveHtml = (content) => {
    this.setState({
      contentObj: { ...this.state.contentObj, content: content }
    })
  }

  changeImages = (fileList) => {
    this.setState({
      fileList
    })
  }

  render () {
    return (
      <div className={style['page_commodity-create']}>
        <div className="commodity-create__header">
          <h3>
            新建商品 - 第 {this.state.step} 步
          </h3>
          <Button onClick={this.handleFinish}>修改</Button>
        </div>
        { this.state.step === 1 && <div className="commodity-create__first">
          <SpuPlane
            spu={this.state.spu}
            fileList={this.state.fileList}
            selecteds={this.state.selecteds}
            changeName={this.changeName}
            changeClass={this.changeClass}
            changeSpu={this.changeSpu}
            changeSelecteds={this.changeSelecteds}
            changeImages={this.changeImages}
            ref="spuPlane">
          </SpuPlane>
          <CreateAttributesPlane ref="createAttributesPlane" skuAttributes={ this.state.skuAttributes } skuTypes={ this.state.skuTypes } changeTypes={this.changeTypes} changeSkuAttributes={this.changeSkuAttributes}></CreateAttributesPlane>
            <div className={style['commodity-create__btn-box']}></div>
          {
              // <Button onClick={this.finishFirst}>下一步</Button>
          }
        </div> }

        <div className="commodity-create__second">
          <CreateSkuList skus={this.state.skus} changeEarly={this.handleEarly} changeLatest={this.changeLatest} changeMini={this.changeMini} changePrice={this.changePrice} handleRemove={this.handleRemove}></CreateSkuList>
        </div>
      </div>
    )
  }
}

export default CommodityEdit
