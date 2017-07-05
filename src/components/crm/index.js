import React, { PureComponent } from 'react'
// import Tab from 'components/try/tab'
import { searchOrg, creatOrg } from 'actions/org'
import style from './index.css'
import { Input, Button, Table, Pagination, Modal, Form, Radio } from 'antd'
// import Table from './searchResult'
const Search = Input.Search
const FormItem = Form.Item
const RadioGroup = Radio.Group

class crm extends PureComponent {
  state = {
    searchData:{
      offset: 0,
      limit: 10,
      kw: ''
    },
    pageSize: 0,
    total: 0,
    resultData: [],
    visible: false,
    radioDefalut: '1'
  }

  constructor(props) {
    super(props)
    this.columns = [{
      title: '编号',
      dataIndex: 'id',
      key: 'name'
    },{
      title: '简称',
      dataIndex: 'name_cn',
      key: 'name2'
    },{
      title: '全称',
      dataIndex: 'name_official',
      key: 'name3'
    },{
      title: '类型',
      dataIndex: 'org_type',
      key: 'name4'
    },{
      title: '操作',
      dataIndex: 'name5',
      key: 'name5',
      render: (text, record, index) => {
        return (
          <div>
            <a onClick={() => this.add(index, 'add')}>添加为我的客户</a>
            <a onClick={() => this.del(index, 'add')}>删除</a>
          </div>
        )
      }
    }]
  }

  search (val, current) { // 搜索结果
    this.setState({
      searchData: {
        val,
        offset: (current - 1) * 10,
        org_type: 2
      }
    })
    setTimeout(() => {
      searchOrg(this.state.searchData).then(res => {
        res.data.org.map((item, index) => {
          item.key = index
          return 1
        })
        this.setState({
          total: res.data.total,
          resultData: res.data.org
        })
      })
    }, 0)
  }

  handleOk = (e) => { // 弹窗下面的确认
    this.handleSubmit()
  }

  handleCancel = (e) => { // 弹窗下面的取消
    console.log(e)
    this.setState({
      visible: false,
    })
  }

  changeData(current) { // 点击分页
    // console.log(this.state)
    this.setState({
      pageSize: current
    })
    this.search(this.state.searchData.kw, current)
    console.log(current)
  }

  componentWillMount() { // 进入页面执行
    this.search('', 1)
  }

  editDone (index, type) {
    console.log(index, type)
  }

  createOrg () { // 创建组织按钮
    // this.props.form.resetFields()
    this.setState({visible: true})
  }

  changeRadio (e) { // 点击单选按钮
    console.log(e.target.value)
    this.setState({
      radioDefalut: e.target.value
    })
  }

  handleSubmit = (e) => { // 表单提交按钮
    e && e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let data = {}
        data.addr_1 = values.orgAddress
        data.name_cn = values.orgFullName
        data.name_official = values.orgName
        data.phone = values.orgTel
        data.org_type = Number(values.orgType)
        creatOrg(data).then(res => {
          console.log(res)
          this.setState({
            visible: false
          })
          if (res.code !== 200) return
          this.search(' ', 1)
        })
      }
    })
  }

  del (index) {
    console.log(this.state.resultData[index])
    console.log(index)
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    }
    return (
      <div className={style.box}>
        <div className={style.boxTop}>
            <Search
              placeholder="input search text"
              style={{ width: 200 }}
              onSearch={value => this.search(value, 1)}
            />
            <Button type="primary" onClick={this.createOrg.bind(this)}>创建组织</Button>
        </div>
        <div>
          <Table key="crm" pagination={false} columns={this.columns} dataSource={this.state.resultData} total={50}></Table>
        </div>
        <div className={style.boxBottom}>
          <Pagination defaultCurrent={1} total={this.state.total} onChange={this.changeData.bind(this)}/>
        </div>
        <Modal title="新建组织" visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}>
          <Form onSubmit={this.handleSubmit}>
            <FormItem
              {...formItemLayout} // 布局
              label="组织简称" // 次项的名称
              hasFeedback // 输入框后边的状态图标
            >
              {getFieldDecorator('orgType', {
                rules: [{
                  required: true, message: '请填写公司简称',
                }],
              })(
                <RadioGroup>
                  <Radio value="2">客户</Radio>
                  <Radio value="3">供应商</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout} // 布局
              label="组织简称" // 次项的名称
              hasFeedback // 输入框后边的状态图标
            >
              {getFieldDecorator('orgFullName', {
                rules: [{
                  required: true, message: '请填写公司简称',
                }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout} // 布局
              label="组织全称" // 次项的名称
              hasFeedback
            >
              {getFieldDecorator('orgName', {
                rules: [{
                  required: true, message: '请填写公司名称',
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
              {getFieldDecorator('orgTel', {
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
              label="地址" // 次项的名称
              hasFeedback
            >
              {getFieldDecorator('orgAddress', {
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

export default Form.create()(crm)
