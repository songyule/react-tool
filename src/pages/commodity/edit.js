import React, { Component } from 'react'
import { Form, Input, Button, Modal } from 'antd'
import SpuPlane from './components/spu-plane'
const FormItem = Form.Item

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
            attributesVisible: true,
        })
    }

    render () {
        // console.log(this.state)
        return (
            <div className="commodity-edit">
                <SpuPlane spu={ { demo: 123 } }></SpuPlane>
                <Form>
                    <FormItem label="名称">
                        <Input></Input>
                    </FormItem>
                    <FormItem label="分类">
                        <Input></Input>
                    </FormItem>
                    <FormItem label="属性">
                        <Button onClick={this.showAttributesDialog}>添加属性</Button>
                    </FormItem>
                    <FormItem label="上传图片">
                    </FormItem>
                    <FormItem label="可见范围">
                    </FormItem>
                </Form>
            </div>
        )
    }
}

export default CommodityEdit