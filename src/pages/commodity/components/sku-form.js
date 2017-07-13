import React, { Component } from 'react'
import { Form, Col, Input, Row, Select, Button } from 'antd'
import { connect } from 'react-redux'
import { find } from 'lodash'
const FormItem = Form.Item
const Option = Select.Option

@connect(
  state => state
)
class SkuForm extends Component {

  renderSelect = () => {
    const filterAttributes = this.props.commodityAttributeObj.skuAttributes.filter(item => item.name_cn === '商品类型')
    const attributes = filterAttributes[0] ? filterAttributes[0].children : []
    return (attributes.map(attribute => <Option key={attribute.id}>{ attribute.name_cn }</Option>))
  }

  changeType = (value) => {
    const filterAttributes = this.props.commodityAttributeObj.skuAttributes.filter(item => item.name_cn === '商品类型')
    const attributes = filterAttributes[0] ? filterAttributes[0].children : []
    const sku = {...this.props.sku}
    sku.typeId = value
    sku.type = find(attributes, { id: Number(value) })
    this.props.changeSku(sku)
  }

  changePrice = (e) => {
    const sku = {...this.props.sku}
    sku.price = e.target.value
    this.props.changeSku(sku)
  }

  changeMini = (e) => {
    const sku = {...this.props.sku}
    sku.miniQuantity = e.target.value
    this.props.changeSku(sku)
  }

  changeEarly = (e) => {
    const sku = {...this.props.sku}
    sku.earlyDate = e.target.value
    this.props.changeSku(sku)
  }

  changeLatest = (e) => {
    const sku = {...this.props.sku}
    sku.latestDate = e.target.value
    this.props.changeSku(sku)
  }

  addAttribute = () => {
    const sku = {...this.props.sku}
    sku.attributes.push({ lv2_name_cn: '', name_cn: '' })
    this.props.changeSku(sku)
  }

  changeAttributeName = (e, index) => {
    const sku = {...this.props.sku}
    sku.attributes[index].lv2_name_cn = e.target.value
    this.props.changeSku(sku)
  }

  changeAttributeValue = (e, index) => {
    const sku = {...this.props.sku}
    sku.attributes[index].name_cn = e.target.value
    this.props.changeSku(sku)
  }

  render () {
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
    }

    return (
      <Row className="sku-plane">
        <Form>
          <Col span={24}>
            <FormItem {...formItemLayout} label="商品类型">
              <Select style={{ width: '500px' }} value={String(this.props.sku.typeId)} onChange={this.changeType}>{ this.renderSelect() }</Select>
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayout} label="价格（ ¥ ）">
              <Input placeholder="placeholder" value={this.props.sku.price} onChange={this.changePrice}/>
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayout} label="起订量">
              <Input placeholder="placeholder" value={this.props.sku.miniQuantity} onChange={this.changeMini}/>
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayout} label="交期（天）">
              <Row>
                <Col span={12}>
                  <Input placeholder="placeholder" value={this.props.sku.earlyDate} onChange={this.changeEarly}/>
                </Col>
                <Col span={12}>
                  <Input placeholder="placeholder" value={this.props.sku.latestDate} onChange={this.changeLatest}/>
                </Col>
              </Row>
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayout} label="属性">
              { this.props.sku.attributes.map((attribute, index) => (
                <Row key={index}>
                  <Col span={2}>
                    属性名
                  </Col>
                  <Col span={9}>
                    <Input placeholder="placeholder" value={attribute.lv2_name_cn} onChange={e => this.changeAttributeName(e, index)} />
                  </Col>
                  <Col span={2}>
                    属性值
                  </Col>
                  <Col span={9}>
                    <Input placeholder="placeholder" value={attribute.name_cn} onChange={e => this.changeAttributeValue(e, index)} />
                  </Col>
                </Row>
              )) }
              <Col span={2}><Button onClick={this.addAttribute}>+</Button></Col>
            </FormItem>
          </Col>
        </Form>
      </Row>
    )
  }
}

export default Form.create()(SkuForm)
