import React, { Component } from 'react'
import { Button, Input, Row, Col, message } from 'antd'
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
import Editor from 'components/richEditor'
import style from './create.css'
// const FormItem = Form.Item

@connect(
  state => state,
  dispatch => bindActionCreators({...managementActions, ...commodityActions}, dispatch)
)
class CommodityCreate extends Component {
  constructor () {
    super()
    this.state = {
      spu: {...JSON.parse(JSON.stringify(emptySpu))},
      skuAttributes: [{ name: { value: '' }, children: [{ value: '' }] }],
      contentObj: {
        content: '<p></p>'
      },
      skuTypes: [],
      // skus: [{"attributes":[{"attr_type":2,"created_at":1499756418,"id":2079,"level":3,"lv1_id":1942,"lv1_name_cn":"测试","lv2_id":2005,"lv2_name_cn":"33","lv3_id":2079,"lv3_name_cn":"222","name_cn":"222","parent_id":2005,"status":1,"updated_at":1499756418},{"name_cn":"样品（现货）","id":214}],"earlyDate":"","latestDate":"","miniQuantity":0,"price":0},{"attributes":[{"attr_type":2,"created_at":1499756418,"id":2079,"level":3,"lv1_id":1942,"lv1_name_cn":"测试","lv2_id":2005,"lv2_name_cn":"33","lv3_id":2079,"lv3_name_cn":"222","name_cn":"222","parent_id":2005,"status":1,"updated_at":1499756418},{"name_cn":"大货（快时尚级）","id":215}],"earlyDate":"","latestDate":"","miniQuantity":0,"price":0}],
      skus: [],
      fileList: [],
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

  validAttributes = () => {
    let bool = true
    if (this.isRepeat(this.state.skuAttributes.map(attr => attr.name.value))) bool = false
    this.state.skuAttributes.forEach(attr => {
      if (this.isRepeat(attr.children.map(child => child.value))) bool = false
    })
    if (!bool) message.warning('属性名或属性值不可重复')
    return bool
  }

  validAttributesPlus = () => {
    let bool = true
    this.state.skuAttributes.forEach(attr => {
      if (!attr.name.value) bool = false
      console.log(attr)
      attr.children.forEach(child => {
        if (!child.value) bool = false
      })
    })
    if (!bool) message.warning('属性名或属性值必填')
    return bool
  }

  isRepeat = (array) => {
    return array.length !== [...new Set(array)].length
  }

  finishFirst = async () => {
    // if (!this.spuPlaneValid() || !this.createAttributesPlaneValid()) return
    if (!this.spuPlaneValid() || !this.createAttributesPlaneValid() || !this.validAttributes() || !this.validAttributesPlus()) return
    const skuAttributes = [...this.state.skuAttributes]
    const nameRes = await this.props.multiCreateCommodityAttribute({ attribute: skuAttributes.map(item => ({ attr_type: 2, name_cn: item.name.value, parent_id: 1942, weight: 1 })) })
    // const nameRes = {data: [{"attr_type":2,"created_at":1499305851,"id":1959,"level":2,"lv1_id":1942,"lv1_name_cn":"测试","lv2_id":1959,"lv2_name_cn":"11","name_cn":"11","parent_id":1942,"status":1,"updated_at":1499305851,"weight":1},{"attr_type":2,"created_at":1499305851,"id":1960,"level":2,"lv1_id":1942,"lv1_name_cn":"测试","lv2_id":1960,"lv2_name_cn":"22","name_cn":"22","parent_id":1942,"status":1,"updated_at":1499305851,"weight":1}]}

    nameRes.data.forEach(item => {
      const matchAttr = find(skuAttributes, attr => attr.name.value === item.name_cn)
      matchAttr.name.attribute = item
    })

    const attributes = []
    skuAttributes.forEach(attribute => {
      attribute.children.forEach(child => {
        attributes.push({ attr_type: 2, name_cn: child.value, parent_id: attribute.name.attribute.id })
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
      console.log(item)
      return {
        type: item.filter(attr => !attr.level)[0],
        typeId: item.filter(attr => !attr.level)[0].id,
        attributes: item.filter(attr => attr.level),
        earlyDate: '',
        latestDate: '',
        miniQuantity: '',
        price: ''
      }
    })

    this.setState({
      skus,
      step: 2
    })
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
  }

  handleRemove = (index) => {
    const skus = [...this.state.skus]
    skus.splice(index, 1)
    this.setState({
      skus
    })
  }

  handleFinish = async () => {
    const promiseList = []
    const spuRes = await this.props.createSpu(toRemoteSpu(this.state.spu))
    if (this.state.spu.accessStatus === 3) {
      const data = { spu_id: spuRes.data.id, client_list: [] }
      this.state.selecteds.forEach(item => item.type === 'client' ? data.client_list.push({ client_id: item.id }) : data.client_list.push({ client_label_id: item.id }))
      promiseList.push(this.props.saveAccess(data))
    }

    this.props.createSpuText({ spu_id: spuRes.data.id, text: this.state.contentObj.content }).then(res => {
      this.props.createSkuList(spuRes.data.id, this.state.skus.map(sku => toRemoteSku(sku))).then(res => {
        this.props.history.push('/main/goods')
      })
    })
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

  validSkus = () => {
    let bool = true
    this.state.skus.forEach(sku => {
      if (!sku.price || !sku.miniQuantity || !sku.earlyDate || !sku.latestDate) bool = false
    })
    if (!bool) message.warning('sku数据都为必填项')
    return bool
  }

  finishSecond = () => {
    if (!this.validSkus()) return
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

  changeText = (content) => {
    // console.log(this.state.contentObj)
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
          新建商品 - 第 {this.state.step} 步
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
          <div className={style['commodity-create__btn-box']}>
            <Button onClick={this.finishFirst}>下一步</Button>
          </div>
        </div> }

        { this.state.step === 2 && <div className="commodity-create__second">
          <Row className={style['commodity-create__name-row']}>
            <Col span={5}>商品名称</Col>
            <Col span={19}>
              {this.state.spu.title}
            </Col>
          </Row>
          <CreateSkuList skus={this.state.skus} changeEarly={this.handleEarly} changeLatest={this.changeLatest} changeMini={this.changeMini} changePrice={this.changePrice} handleRemove={this.handleRemove}></CreateSkuList>
          <div className={style['commodity-create__btn-box']}>
            <Button className={style['commodity-create__btn']} onClick={this.goFirst}>上一步</Button>
            <Button className={style['commodity-create__btn']} onClick={this.finishSecond}>下一步</Button>
          </div>
        </div> }

        { this.state.step === 3 && <div className="commodity-create__third">
          <div className={style['commodity-create__input-row']}>
            <Input className={style['commodity-create__third-input']} value={this.state.spu.title}></Input>
          </div>
          <Editor
            contentState={this.state.contentObj.content}
            onChange={this.changeText}/>
          <div className={style['commodity-create__btn-box']}>
            <Button className={style['commodity-create__btn']} onClick={this.handleFinish}>保存并关闭</Button>
            <Button className={style['commodity-create__btn']}>保存并新建</Button>
            <Button className={style['commodity-create__btn']}>取消</Button>
          </div>
        </div> }
      </div>
    )
  }
}

export default CommodityCreate
