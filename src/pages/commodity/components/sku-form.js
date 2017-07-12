import React, { Component } from 'react'
import { Form, Col, Input, Row, Select } from 'antd'
const FormItem = Form.Item
const Option = Select.Option

class SkuForm extends Component {
    constructor () {
        super()
        this.state = {
            sku: {}
        }
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
                    {
                      // <Col span={8}>
                      //     <FormItem {...formItemLayout} label="商品类型">
                      //         {getFieldDecorator(`type`)(
                      //             <Select></Select>
                      //         )}
                      //     </FormItem>
                      // </Col>
                    }
                    <Col span={12}>
                        <FormItem {...formItemLayout} label="价格（ ¥ ）">
                            {getFieldDecorator(`field-1`)(
                                <Input placeholder="placeholder" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label="起订量">
                            {getFieldDecorator(`field-1`)(
                                <Input placeholder="placeholder" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label="交期（天）">
                            {getFieldDecorator(`field-1`)(
                                <Row>
                                  <Col span={12}>
                                    <Input placeholder="placeholder" />
                                  </Col>
                                  <Col span={12}>
                                    <Input placeholder="placeholder" />
                                  </Col>
                                </Row>
                            )}
                        </FormItem>
                    </Col>
                </Form>
            </Row>
        )
    }
}

export default Form.create()(SkuForm)
