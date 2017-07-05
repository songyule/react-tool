import React, { PureComponent } from 'react'
import { Form, Input, Button, Cascader, Select, Modal } from 'antd'
import style from './css/new.css'
import fetch from 'api/utils'
import { Link } from 'react-router-dom'
import { getDistrict, creatOrg, getTag, editOrgMes } from 'actions/org'
import MyUpload from '../../pages/topic/components/img-upload'

const FormItem = Form.Item
const Option = Select.Option

// org_type: 1 fly ; 2 客户； 3 供应商

class create extends PureComponent {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [],
    residences: [],
    source: [],
    level: [],
    orgMes: {
      client_level: {},
      client_source: {}
    },
    isClientNew: true,
    visible: false
  }

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    })
  }

  handleChange = ({ fileList }) => this.setState({ fileList })

  what = async () => {
    await fetch.get('/district.json', { base_url: 'https://image.fuliaoyi.com' })
  }

  componentWillMount () {
    console.log(this.props)
    if (this.props.location && this.props.location.pathname.substr(6) !== 'clientNew') {
      this.setState({
        isClientNew: false
      })
    }
  }

  componentWillReceiveProps (nextProps) { // props 更新时候触发
    let data = nextProps.orgMes
    console.log(nextProps.isClientEdit)
    if (nextProps.isClientEdit === false) {
      this.setState({
        isClientNew: false
      })
    }
    if (!data) return
    data.statusS = data.status && data.status.toString()
    data.levelS = data.client_level && data.client_level.id.toString()
    data.sourceS = data.client_source && data.client_source.id.toString()
    this.setState({
      orgMes: data
    })
  }

  componentDidMount() { // 相当于window.onload
    // this.what()
    getDistrict().then(res => { // 获取三级联动，地址.json
      this.setState({
        residences: res.data.js_ant_design_cascader_map.children
      })
    })
    getTag({category: [0, 1]}).then(res => {
      this.setState({
        source: res.data[1],
        level: res.data[0]
      })
    })
  }

  handleSubmit = (e) => { // 表单提交按钮
    e && e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let data = {}
        Object.assign(data, values)
        data.icon = values.icon && values.icon[0].response
        data.adcode = values.residence[values.residence.length - 1]
        data.status = Number(values.status)
        data.org_type = this.state.isClientNew ? 2 : 3
        console.log(109)
        if (this.state.orgMes && this.state.orgMes.from === 'clientEdit') { // 这个是来自client 的编辑组织
          data.id = this.state.orgMes.orgId
          editOrgMes(data).then(res => {
            if (res.code === 200) this.props.history.push('/main/clientList')
          })
        } else if (this.state.orgMes && this.state.orgMes.from === 'supplierEdit') {
          data.id = this.state.orgMes.orgId
          editOrgMes(data).then(res => {
            if (res.code === 200) {
              this.setState({
                visible: true
              })
            }
          })
        } else {
          creatOrg(data).then(res => {
            if (res.code === 200) {
              this.setState({
                visible: true
              })
            }
          })
        }
      }
    })
  }

  handleOk () {
    this.state.isClientNew ? this.props.history.push('/main/clientList') : this.props.history.push('/main/supplierList')
  }

  handleCan () {
    this.setState({
      visible: false
    })
  }

 render () {
  const { getFieldDecorator } = this.props.form
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 14 },
    },
  }
  return (
    <div className={style.newContent}>
      <Form>
        <div className={style.formTop}>
          <FormItem
            {...formItemLayout}
            label="用户头像"
            hasFeedback
          >
            {getFieldDecorator('icon', {
              rules: [],
            })(
              <MyUpload onChange={this.handleChange}></MyUpload>
            )}
          </FormItem>
          <div className={style.fromTopCenter}>
            <FormItem
            label="客户名称"
            className={style.formitme}
            >
              {getFieldDecorator('name_official', {
                initialValue: (this.state.orgMes && this.state.orgMes.name_official) || '',
                rules: [{
                  required: true, message: 'Please input your E-mail!',
                }]
              })(
                <Input className={style.input} />
              )}
            </FormItem>
            <FormItem
            label="状态"
            className={style.formitme}
            >
              {getFieldDecorator('status', {
                initialValue: (this.state.orgMes && this.state.orgMes.statusS) || '',
                rules: [{
                  required: true, message: 'Please input your E-mail!',
                }]
              })(
                <Select style={{ width: 300 }}>
                  <Option value="1">正常</Option>
                  <Option value="2">失效</Option>
                </Select>
              )}
            </FormItem>
          </div>
          <div className={style.fromTopRight}>
            <Button type="primary" onClick={e => this.handleSubmit(e)}>保存</Button>
            <Button type="primary">
              <Link to="/main/clientList">
                取消
              </Link>
            </Button>
          </div>
        </div>

        <div className={style.fromMiddleA}>
          <FormItem
            label="编码"
            className={style.formitme}
            >
              {getFieldDecorator('adcode', {
                initialValue: (this.state.orgMes && this.state.orgMes.snCode) || '',
              })(
                <Input className={style.input} disabled/>
              )}
          </FormItem>
          <FormItem
            label="公司电话"
            className={style.formitme}
            >
              {getFieldDecorator('phone', {
                initialValue: (this.state.orgMes && this.state.orgMes.phone) || '',
                rules: [{
                  required: true, message: 'Please input your E-mail!',
                }]
              })(
                <Input className={style.input}/>
              )}
          </FormItem>
          <FormItem
            label="公司网站"
            className={style.formitme}
            >
              {getFieldDecorator('website', {
                initialValue: (this.state.orgMes && this.state.orgMes.website) || '',
              })(
                <Input className={style.input}/>
              )}
          </FormItem>
        </div>
        <div className={style.fromMiddleB}>
          <FormItem
            label="简称"
            className={style.formitme}
            >
              {getFieldDecorator('name_cn', {
                initialValue: this.state.orgMes && this.state.orgMes.name_cn,
                rules: [{
                  required: true, message: 'Please input your E-mail!',
                }]
              })(
                <Input className={style.input} />
              )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="城市选择"
          >
            {getFieldDecorator('residence', {
              initialValue: (this.state.orgMes && this.state.orgMes.adcode_path) || [],
              rules: [{ type: 'array', required: true, message: '请选择城市' }]
            })(
              <Cascader options={this.state.residences} style={{width: 300}} changeOnSelect placeholder="请选择"/>
            )}
          </FormItem>
          <FormItem
          label="详细地址"
          className={style.formitme}
          >
            {getFieldDecorator('addr_1', {
              initialValue: (this.state.orgMes && this.state.orgMes.addr_1) || '',
              rules: [{
                required: true, message: '请填写详细地址',
              }]
            })(
              <Input className={style.input} />
            )}
          </FormItem>
        </div>
        {
          this.state.isClientNew &&
          <div className={style.fromBottom}>
            <FormItem
            label="客户级别"
            className={style.formitme}
            >
              {getFieldDecorator('client_level', {
                initialValue: (this.state.orgMes && this.state.orgMes.levelS) || '',
                rules: [{
                  required: true, message: '请填写客户级别',
                }]
              })(
                <Select style={{ width: 300 }} placeholder="请选择">
                  {
                    this.state.level.map((item, index) => {
                      return <Option value={item.id} key={index}>{item.name}</Option>
                    })
                  }
                </Select>
              )}
            </FormItem>
            <FormItem
            label="客户来源"
            className={style.formitme}
            >
              {getFieldDecorator('client_source', {
                initialValue: (this.state.orgMes && this.state.orgMes.sourceS) || '',
                rules: [{
                  required: true, message: '请选择客户来源',
                }]
              })(
                <Select style={{ width: 300 }} placeholder="请选择">
                  {
                    this.state.source.map((item, index) => {
                      return <Option value={item.id} key={index}>{item.name}</Option>
                    })
                  }
                </Select>
              )}
            </FormItem>
          </div>
        }
      </Form>
      <Modal
        title="提示"
        visible={this.state.visible}
        onOk={this.handleOk.bind(this)}
        onCancel={this.handleCan.bind(this)}
      >
        <p>创建成功，是否前往列表</p>
      </Modal>
    </div>
  )
 }
}

export default Form.create()(create)
