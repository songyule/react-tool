import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Upload from 'pages/topic/components/img-upload'
import arrayToTree from 'array-to-tree'
import style from './form.css'
import { Form, Input, Radio, Select, Switch, Tree } from 'antd'
const [FormItem, RadioGroup, Option, TreeNode] = [Form.Item, Radio.Group, Select.Option, Tree.TreeNode]

@Form.create()

export default class ClassesForm extends PureComponent {

  constructor (props) {
    super(props)

    this.state = {
      fileList: []
    }
  }

  static propTypes = {
    attributesList: PropTypes.array
  }

  componentWillMount () {
    if (this.props.rewrite.image_url) {
      this.setImgBack(this.props.rewrite.image_url)
    }  
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.rewrite.image_url) {
      this.setImgBack(nextProps.rewrite.image_url)
    }
  }

  setImgBack (url) {
    this.setState({
      fileList: [{
        uid: -1,
        name: 'sdhjkfhsyuiweyrnn222.png',
        status: 'done',
        url: url,
        response: url,
        thumbUrl: url
      }]
    })
  }

  handleImgChange = (fileList) => {
    this.setState({ fileList })
  }

  onCheck = (e) => {
    console.log(e)
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const { attributesList, isRoot, seletedData } = this.props
    const { name_cn, weight, status, image_url } = this.props.rewrite
    console.log(this.props)
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 }
    }


    const loop = data => data.map((item) => {
     if (item.children) {
       return (
         <TreeNode
           key={item.id}
           title={item.name_cn}
         >
           {loop(item.children)}
         </TreeNode>
       )
     }
     return <TreeNode key={item.id} title={item.name_cn} />
   })

    return (
      <div>
        <Form>
          <FormItem {...formItemLayout} label="分类名称">
            {getFieldDecorator('name', { initialValue: name_cn, rules: [{ required: true, message: '请输入名称'}] })(
                <Input />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="权重">
            {getFieldDecorator('weight', { initialValue: weight })(
                <Input />
            )}
          </FormItem>
          {
            isRoot
              ? (
                <FormItem {...formItemLayout} label="图片">
                  {getFieldDecorator('img')(
                      <Upload onChange={this.handleImgChange} fileList={this.state.fileList}/>
                  )}
                </FormItem>
              )
              : null

          }
          <FormItem {...formItemLayout} label="是否显示">
            {getFieldDecorator('isShow', { initialValue: status || 1 })(
              <RadioGroup onChange={this.onAttrTypeChange}>
                <Radio value={1}>显示</Radio>
                <Radio value={2}>不显示</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="关联属性">
            <div className={style['tree']}>
              {getFieldDecorator('selectedAttributes', { trigger: 'onCheck'})(
                <Tree
                  checkable
                  onCheck={this.onCheck}
                  defaultCheckedKeys={seletedData && seletedData.map(item => item.id.toString())}
                >
                  {loop(arrayToTree(attributesList))}
                </Tree>
               )}
            </div>
          </FormItem>

        </Form>
      </div>
    )
  }
}
