import React, { Component } from 'react'
import { Button } from 'antd'
import SpuPlane from './components/spu-plane'
import CreateAttributesPlane from './components/create-attributes-plane'
import CreateSkuList from './components/create-sku-list'
import { emptySpu } from './model'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { groupBy, find, findIndex } from 'lodash'
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
      skuAttributes: [{ name: { value: '' }, children: [{ value: '' }] }],
      fileList: [],
      skuTypes: [],
      skus: [],
      customAttributes: [],
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
    console.log(value)
    this.setState({
      skuAttributes: value
    })
  }

  componentWillMount = () => {
    const id = this.props.match.params.id
    this.props.getSpuInfo(id).then(res => {
      const spu = toLocalSpu(res.data)
      if (spu.accessStatus === 3) {
        const selecteds = []
        this.props.getAccess(id).then(accessRes => {
          selecteds.push(...accessRes.data.labels.map((label) => ({ id: label.id, type: 'label', data: label, label: `${label.name_cn}（${label.client_count || 0}）` })))
          selecteds.push(...accessRes.data.clients.map((client) => ({ id: client.id, type: 'client', data: client, label: client.name_official })))
        })
        this.setState({
          selecteds
        })
      }
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
        skuAttributes.push({
          name: {
            value: groupAttributes[key][0].lv2_name_cn,
            id: groupAttributes[key][0].lv2_id
          },
          children: groupAttributes[key].map(item => ({ value: item.name_cn, id: item.id }))
        })
      })
      this.setState({
        skus,
        skuTypes: [...new Set(skus.map(sku => String((sku.type||{}).id)))],
        skuAttributes
      })
    })
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
    promiseList.push(this.props.updateSpu(this.state.spu.id, toRemoteSpu(this.state.spu)))
    if (this.state.spu.accessStatus === 3) {
      const data = { spu_id: this.state.spu.id, client_list: [] }
      this.state.selecteds.forEach(item => item.type === 'client' ? data.client_list.push({ client_id: item.id }) : data.client_list.push({ client_label_id: item.id }))
      promiseList.push(this.props.saveAccess(data))
    }

    const skuAttributes = [...this.state.skuAttributes]

    const nameAttributes = []
    skuAttributes.forEach(attribute => {
      if (attribute.name.id && attribute.name.changed) nameAttributes.push({ attr_type: 2, name_cn: attribute.name, parent_id: 1942 })
    })
    const nameRes = await this.props.multiCreateCommodityAttribute({ attribute: nameAttributes })

    nameRes.data.forEach(item => {
      const matchAttr = find(skuAttributes, attr => attr.name.value === item.name_cn)
      // matchAttr.name.oldId = matchAttr.name.id
      matchAttr.name.id = item.id
    })

    const attributes = []
    skuAttributes.forEach(attribute => {
      attribute.children.forEach(child => {
        if (child.id && child.changed) attributes.push({ attr_type: 2, name_cn: child.value, parent_id: attribute.name.id })
      })
    })

    const childRes = await this.props.multiCreateCommodityAttribute({ attribute: attributes })
    const handledAttributes = childRes.data
    handledAttributes.forEach(child => {
      const matchAttribute = find(skuAttributes, attr => attr.name.id === child.lv2_id)
      const matchChild = find(matchAttribute.children, attrChild => child.name_cn === attrChild.value)
      child.oldId = matchChild.id
    })
    const skus = this.state.skus
    skus.forEach(sku => {
      handledAttributes.forEach(attr => {
        const matchIndex = findIndex(sku.attributes, { id: attr.oldId })
        if (~matchIndex) {
          sku.attributes.splice(matchIndex, 1)
          sku.attributes.push(attr)
        }
      })
    })
    await Promise.all(skus.map(sku => this.props.updateSku(sku.id, toRemoteSku(sku))))


    this.props.history.push('/main/goods')
  }

  changeSpu = (spu) => {
    this.setState({
      spu
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
            编辑商品
          </h3>
          <Button onClick={this.handleFinish}>修改</Button>
        </div>
        <div className="commodity-create__first">
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
        </div>

        <div className="commodity-create__second">
          <CreateSkuList skus={this.state.skus} changeEarly={this.handleEarly} changeLatest={this.changeLatest} changeMini={this.changeMini} changePrice={this.changePrice} handleRemove={this.handleRemove}></CreateSkuList>
        </div>
      </div>
    )
  }
}

export default CommodityEdit
