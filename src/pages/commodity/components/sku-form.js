import React, { Component } from 'react'
import { Form, Col, Input, Button, Select } from 'antd'
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
            <div className="sku-plane">
                <Form>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label="商品类型">
                            {getFieldDecorator(`field-1`)(
                                <Select>
                                    <Option value="jack">Jack</Option>
                                    <Option value="lucy">Lucy</Option>
                                    <Option value="disabled" disabled>Disabled</Option>
                                    <Option value="Yiminghe">yiminghe</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label="颜色">
                            {getFieldDecorator(`field-1`)(
                                <Input placeholder="placeholder" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label="规格">
                            {getFieldDecorator(`field-1`)(
                                <Input placeholder="placeholder" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label="价格（ ¥ ）">
                            {getFieldDecorator(`field-1`)(
                                <Input placeholder="placeholder" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label="起订量">
                            {getFieldDecorator(`field-1`)(
                                <Input placeholder="placeholder" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label="商品单位">
                            {getFieldDecorator(`field-1`)(
                                <Input placeholder="placeholder" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label="库存">
                            {getFieldDecorator(`field-1`)(
                                <Input placeholder="placeholder" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label="料号">
                            {getFieldDecorator(`field-1`)(
                                <Input placeholder="placeholder" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label="交期（天）">
                            {getFieldDecorator(`field-1`)(
                                <div>
                                    <Input placeholder="placeholder" />
                                    <Input placeholder="placeholder" />
                                </div>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label="上传图片">
                            <Button>点击上传</Button>
                        </FormItem>
                    </Col>
                </Form>
            </div>
        )
    }
}

export default Form.create()(SkuForm)