import React, { Component } from 'react'
import { Button, Input, Row, Col } from 'antd'
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
import LzEditor from 'react-lz-editor'
import style from './create.css'
import history from 'router/history'
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
      skuAttributes: [{ name: '', value: [''] }],
      contentObj: {
        content: ''
      },
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
    // const childRes = await Promise.all(attributes.map(attribute => this.props.createCommodityAttribute(attribute)))
    // const childRes = {
    //   data: [
    //     {
    //       attr_type: 2,
    //       created_at: 1499305851,
    //       id: 2000,
    //       level: 3,
    //       lv1_id: 1942,
    //       lv1_name_cn: '测试',
    //       lv2_id: 1960,
    //       lv2_name_cn: '22',
    //       lv3_id: 2000,
    //       lv3_name_cn: '33',
    //       name_cn: '33',
    //       parent_id: 1960,
    //       status: 1,
    //       updated_at: 1499305851,
    //       weight: 1
    //     },
    //     {
    //       attr_type: 2,
    //       created_at: 1499305851,
    //       id: 2001,
    //       level: 3,
    //       lv1_id: 1942,
    //       lv1_name_cn: '测试',
    //       lv2_id: 1960,
    //       lv2_name_cn: '22',
    //       lv3_id: 2001,
    //       lv3_name_cn: '44',
    //       name_cn: '44',
    //       parent_id: 1960,
    //       status: 1,
    //       updated_at: 1499305851,
    //       weight: 1
    //     },
    //     {
    //       attr_type: 2,
    //       created_at: 1499305851,
    //       id: 2003,
    //       level: 3,
    //       lv1_id: 1942,
    //       lv1_name_cn: '测试',
    //       lv2_id: 1961,
    //       lv2_name_cn: '11',
    //       lv3_id: 2003,
    //       lv3_name_cn: '555',
    //       name_cn: '555',
    //       parent_id: 1960,
    //       status: 1,
    //       updated_at: 1499305851,
    //       weight: 1
    //     }
    //   ]
    // }
    // const classifyAttributes = groupBy(childRes.map(item => item.data), 'lv2_id')
    const classifyAttributes = groupBy(childRes.data, 'lv2_id')
    const demo = []
    Object.keys(classifyAttributes).map(key => {
      const attributes = []
      classifyAttributes[key].map(item => {
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
    const spuRes = await this.props.createSpu(toRemoteSpu(this.state.spu))
    if (this.state.spu.accessStatus === 3) {
      const data = { spu_id: spuRes.data.id, client_list: [] }
      this.selecteds.forEach(item => item.type === 'client' ? data.client_list.push({ client_id: item.id }) : data.client_list.push({ client_label_id: item.id }))
      promiseList.push(this.props.saveAccess(data))
    }

    await Promise.all(this.props.createSpuText({ spu_id: spuRes.data.id, text: this.state.contentObj.content }), this.props.createSkuList(spuRes.data.id, this.state.skus.map(sku => toRemoteSku(sku))))
    // browserHistory('main/gbrowserHistoryoods')
    this.props.history.push('/main/goods')

    // console.log(Object.keys(attributesObj).map(key => ({ key: key, value: attributesObj[key] })))
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

  render () {
    return (
      <div className={style['page_commodity-create']}>
        <div className="commodity-create__header">
          新建商品 - 第 {this.state.step} 步
        </div>
        { this.state.step === 1 && <div className="commodity-create__first">
          <SpuPlane spu={this.state.spu} selecteds={this.state.selecteds} changeName={this.changeName} changeClass={this.changeClass} changeSpu={this.changeSpu} changeSelecteds={this.changeSelecteds} ref="spuPlane"></SpuPlane>
          <CreateAttributesPlane ref="createAttributesPlane" skuAttributes={ this.state.skuAttributes } skuTypes={ this.state.skuTypes } changeTypes={this.changeTypes} changeSkuAttributes={this.changeSkuAttributes}></CreateAttributesPlane>
          <div className={style['commodity-create__btn-box']}>
            <Button onClick={this.finishFirst}>下一步</Button>
          </div>
        </div> }

        { this.state.step === 2 && <div className="commodity-create__second">
          <Row className="commodity-create__name-row">
            <Col span={4}>商品名称</Col>
            <Col span={20}>
              <Input value={this.state.spu.title}></Input>
            </Col>
          </Row>
          <CreateSkuList skus={this.state.skus} changeEarly={this.handleEarly} changeLatest={this.changeLatest} changeMini={this.changeMini} changePrice={this.changePrice} handleRemove={this.handleRemove}></CreateSkuList>
          <div className={style['commodity-create__btn-box']}>
            <Button onClick={this.goFirst}>上一步</Button>
            <Button onClick={this.finishSecond}>下一步</Button>
          </div>
        </div> }

        { this.state.step === 3 && <div className="commodity-create__third">
          <div className={style['commodity-create__input-row']}>
            <Input className={style['commodity-create__third-input']} value={this.state.spu.title}></Input>
          </div>
          <LzEditor active={true} importContent={this.state.contentObj.content} cbReceiver={this.receiveHtml} fullScreen={false} convertFormat="html"></LzEditor>
          <div className={style['commodity-create__btn-box']}>
            <Button onClick={this.handleFinish}>保存并关闭</Button>
            <Button>保存并新建</Button>
            <Button>取消</Button>
          </div>
        </div> }
      </div>
    )
  }
}

export default CommodityCreate
