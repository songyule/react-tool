import React, { Component } from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import * as commodityActions from 'actions/commodity';
import { Form, Input, Cascader, Button, Modal } from 'antd'
import arrayToTree from 'array-to-tree'
import { uniqBy } from 'lodash'
import { generateAttrTree } from 'utils'
const FormItem = Form.Item

@connect(
  state => state,
  dispatch => bindActionCreators(commodityActions, dispatch)
)
class SpuPlane extends Component {
    static propTypes = {
        spu: React.PropTypes.object
    }

    constructor (props) {
        super(props)
        this.state = {
            classes: [],
            attributesVisible: true,
            spu: {
                title: ''
            }
        }
        
        this.changeName = this.changeName.bind(this)
    }

    getClasses = async () => {
        const res = await this.props.getClasses()
        let classes = res.data.filter(item => [undefined, 1, 2].indexOf(item.level) > -1)
        classes = classes.map(item => {
        item = { ...item, value: item.id, label: item.name_cn }
        return item
        })
        classes.forEach(item => {
        item.disabled = item.status !== 1
        })
        const matchClass = classes.filter(item => item.parent_id === -1)[0] || {}
        matchClass.parent_id = null
        this.setState({
            classes: arrayToTree(classes)[0].children
        })
    }

    componentWillMount = () => {
        this.getClasses()
        this.getSpuAttributes()
    }

    changeName = (value) => {
        this.setState({
            spu: {...this.state.spu, title: value}
        })
    }

    getSpuAttributes = () => {
        this.props.getGoodsAttributes().then(res => {
            console.log(res)
        })
    }

    calcAttributes () {
      const existAttrs = []
      const attributes = {}
      // 判断 children 是因为 generateArrtTree 函数还存在问题
      let attributeList = uniqBy([...this.linkageAttr, ...this.spuAttributes], 'id')
      attributeList = attributeList.filter(item => item.level === 1 || item.level === 2)
      this.attrOptions = generateAttrTree(attributeList).filter(item => item.children)

      this.attrOptions.forEach(attr => {
        const matchAttrs = this.spu.attributes.filter(item => item.lv1_id === attr.id)
        attributes[attr.id] = matchAttrs.map(item => item.id)
        existAttrs.push(...matchAttrs)
      })
      this.spu.attributes = existAttrs
      this.attributes = attributes
    }

    render () {
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
            }
        }

        return (
            <div className="spu-plane">
                <Form className="spu-plane__form">
                    <FormItem
                        {...formItemLayout}
                        label="名称">
                        <Input onChange={this.changeName}></Input>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="分类">
                        <Cascader options={this.state.classes}></Cascader>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="属性">
                        <Button>添加属性</Button>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="上传图片">
                        <Button>点击上传</Button>
                    </FormItem>
                </Form>

                <Modal visible={this.state.attributesVisible} title="添加属性" onOk={this.handleAttributesOk} onCancel={this.handle}>
                    
                </Modal>
            </div>
        )
    }
}

export default SpuPlane