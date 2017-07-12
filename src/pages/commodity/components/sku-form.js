import React, { Component } from 'react'
import { Form, Col, Input, Row, Select, Button } from 'antd'
import { connect } from 'react-redux'
const FormItem = Form.Item
const Option = Select.Option

@connect(
  state => state
)
class SkuForm extends Component {
  constructor () {
    super()
    this.state = {
      sku: {}
    }
  }

  renderSelect = () => {
    const filterAttributes = this.props.commodityAttributeObj.skuAttributes.filter(item => item.name_cn === '商品类型')
    const attributes = filterAttributes[0] ? filterAttributes[0].children : []
    return (attributes.map(attribute => <Option key={attribute.id}>{ attribute.name_cn }</Option>))
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
    }

    return (
      <Row className="sku-plane">
        <Form>
          <Col span={24}>
            <FormItem {...formItemLayout} label="商品类型">
              <Select mode="tags" style={{ width: '500px' }}>{ this.renderSelect() }</Select>
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayout} label="价格（ ¥ ）">
              <Input placeholder="placeholder" />
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayout} label="起订量">
              <Input placeholder="placeholder" />
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayout} label="交期（天）">
              <Row>
                <Col span={12}>
                  <Input placeholder="placeholder" />
                </Col>
                <Col span={12}>
                  <Input placeholder="placeholder" />
                </Col>
              </Row>
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayout} label="属性">
              <Row>
                <Col span={2}>
                  属性名
                </Col>
                <Col span={9}>
                  <Input placeholder="placeholder" />
                </Col>
                <Col span={2}>
                  属性值
                </Col>
                <Col span={9}>
                  <Input placeholder="placeholder" />
                </Col>
                <Col span={2}><Button>+</Button></Col>
              </Row>
            </FormItem>
          </Col>
        </Form>
      </Row>
    )
  }
}

export default Form.create()(SkuForm)
