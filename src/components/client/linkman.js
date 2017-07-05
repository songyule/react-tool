import React, { PureComponent } from 'react'
import { Card, Row, Col, Button, Form, Radio, Select, Modal, Input } from 'antd'
import { getContact, postContact, patchContact } from 'actions/org'
import style from './css/linkman.css'
// import NewLinkman from 'components/client/new-linkman'

const Option = Select.Option
const FormItem = Form.Item
const RadioGroup = Radio.Group

class linkman extends PureComponent {
  state = {
    title: 'cart title',
    contactArr: [],
    visible: false,
    contactObj: {},
    isNew: true
  }

  handleCancel = (e) => { // 弹窗下面的取消
    this.setState({
      visible: false
    })
  }

  handleOk = () => {
    this.handleSubmit()
  }

  handleSubmit = (e) => { // 表单提交按钮
    e && e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let data = {}
        Object.assign(data, values)
        data.org_id = this.props.org_id
        if (this.state.isNew) {
          postContact(data).then(res => {
            console.log(res)
            if (res.code !== 200) return
            this.setState({
              visible: false
            }, () => {
              this.getContactFun()
            })
          })
        } else {
          data.id = this.state.contactObj.id
          patchContact(data).then(res => {
            console.log(res)
            if (res.code !== 200) return
            this.setState({
              visible: false
            }, () => {
              this.getContactFun()
            })
          })
        }
      } else {
        console.log(err)
      }
    })
  }

  getContactFun () {
    getContact({org_id: this.props.org_id}).then(res => {
      console.log(res)
      res.data.contact.map(item => {
        if(item.classification === 0) {
          item.classificationText = '联系人'
        } else if (item.classification === 1) {
          item.classificationText = '发货联系人'
        } else if (item.classification === 2) {
          item.classificationText = '发票联系人'
        } else if (item.classification === 3) {
          item.classificationText = '收货联系人'
        }
        if (item.gender === 1) {
          item.genderText = '先生'
        } else if (item.gender === 2) {
          item.genderText = '小姐'
        } else if (item.gender === 3) {
          item.genderText = '女士'
        }
        return 1
      })
      this.setState({
        contactArr: res.data.contact
      })
    })
  }

  componentWillMount () {
    this.getContactFun()
  }

  delContact (index, e) {
    e.stopPropagation()
    let data = {}
    data.id = this.state.contactArr[index].id
    data.deleted = 1
    patchContact(data).then(res => {
      console.log(res)
      if (res.code !== 200) return
      this.getContactFun()
    })
    console.log(index, e)
  }

  createLinkMan () {
    this.setState({
      visible: true,
      isNew: true
    })
    this.setState({
      contactObj: {}
    })
    this.props.form.resetFields()
  }

  editLinkMan (index) {
    console.log(this.state.contactArr[index])
    let data = this.state.contactArr[index]
    data.classificationS = data.classification.toString()
    data.genderS = data.gender.toString()
    this.setState({
      visible: true,
      isNew: false,
      contactObj: data
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    }
    return (
      <div>
        <Button type="primary" style={{marginBottom: 10}} onClick={this.createLinkMan.bind(this)}>新建</Button>
        <Row gutter={16} className={style.card}>
          {
            this.state.contactArr.map((item, index) => {
              return  <Col span={8} key={index} style={{marginBottom: 10}} onClick={() => this.editLinkMan(index)}>
                        <Card title={item.classificationText} extra={<p className={style.cardDel} onClick={e => this.delContact(index, e)}>del</p>}>
                          <p>
                            <span>{item.name}{item.genderText}</span>
                            <span style={{marginLeft: 50}}>{item.department}</span>
                            <span style={{marginLeft: 20}}>{item.title}</span>
                          </p>
                          <p>
                            <span style={{marginRight: 20}}>{item.landline ? item.landline : '无座机'}</span>
                            <span>{item.mobile}</span>
                          </p>
                          <p>{item.email}</p>
                          <p>{item.address}</p>
                        </Card>
                      </Col>
            })
          }
        </Row>
        <Modal title="新建联系人" visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}>
          <Form onSubmit={this.handleSubmit}>
            <FormItem
              {...formItemLayout} // 布局
              label="类型" // 次项的名称
              hasFeedback // 输入框后边的状态图标
            >
              {getFieldDecorator('classification', {
                initialValue: (this.state.contactObj && this.state.contactObj.classificationS) || '',
                rules: [{
                  required: true, message: '请填写类型',
                }],
              })(
                <RadioGroup>
                  <Radio value="0">联系人</Radio>
                  <Radio value="1">发货联系人</Radio>
                  <Radio value="2">发票联系人</Radio>
                  <Radio value="3">收货联系人</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout} // 布局
              label="姓名" // 次项的名称
              hasFeedback // 输入框后边的状态图标
            >
              {getFieldDecorator('name', {
                initialValue: (this.state.contactObj && this.state.contactObj.name) || '',
                rules: [{
                  required: true, message: '请填写姓名',
                }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout} // 布局
              label="称谓" // 次项的名称
              hasFeedback
            >
              {getFieldDecorator('gender', {
                initialValue: (this.state.contactObj && this.state.contactObj.genderS) || '',
                rules: [{
                  required: true, message: '请填写称谓',
                }],
              })(
                <Select>
                  <Option value="1">先生</Option>
                  <Option value="2">小姐</Option>
                  <Option value="3">女士</Option>
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout} // 布局
              label="部门" // 次项的名称
              hasFeedback
            >
              {getFieldDecorator('department', {
                initialValue: (this.state.contactObj && this.state.contactObj.department) || '',
                rules: [{
                  required: true, message: '请填写部门',
                }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout} // 布局
              label="职位" // 次项的名称
              hasFeedback
            >
              {getFieldDecorator('title', {
                initialValue: (this.state.contactObj && this.state.contactObj.title) || '',
                rules: [{
                  required: true, message: '请填写职位',
                }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout} // 布局
              label="座机" // 次项的名称
              hasFeedback
            >
              {getFieldDecorator('landline', {
                initialValue: (this.state.contactObj && this.state.contactObj.landline) || '',
                rules: [{
                  required: true, message: '请填写座机',
                }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout} // 布局
              label="电话" // 次项的名称
              hasFeedback
            >
              {getFieldDecorator('mobile', {
                initialValue: (this.state.contactObj && this.state.contactObj.mobile) || '',
                rules: [{
                  pattern: /^1[34578]\d{9}$/, message: '手机号格式不正确', trigger: 'none'
                },{
                  required: true, message: '请填写联系电话',
                }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout} // 布局
              label="邮箱" // 次项的名称
              hasFeedback
            >
              {getFieldDecorator('email', {
                initialValue: (this.state.contactObj && this.state.contactObj.email) || '',
                rules: [{
                  required: true, message: '请填写邮箱',
                }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout} // 布局
              label="地址" // 次项的名称
              hasFeedback
            >
              {getFieldDecorator('address', {
                initialValue: (this.state.contactObj && this.state.contactObj.address) || '',
                rules: [{
                  required: true, message: '请填写公司地址',
                }],
              })(
                <Input />
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }
}

export default Form.create()(linkman)
