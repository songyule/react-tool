import React, { PureComponent } from 'react'
import { Table, Pagination, Button, Popconfirm } from 'antd'
import { getAccountNumber, editUser } from 'actions/org'
import style from './css/account-number.css'
import NewNumber from 'components/client/new-number'

export default class extends PureComponent {
  constructor(props) {
    super(props)
    this.columns = [{
          title: '编号',
          dataIndex: 'id',
          key: 'id'
        },{
          title: '用户名',
          dataIndex: 'name_cn',
          key: 'name_cn'
        },{
          title: '手机号',
          dataIndex: 'mobile',
          key: 'mobile'
        },{
          title: '邮箱',
          dataIndex: 'mail',
          key: 'mail'
        },{
          title: '操作',
          dataIndex: 'edit',
          key: 'edit',
          render: (text, record, index) => {
            return (
              <div>
                <a onClick={() => this.eidtUser(index)} style={{marginRight: 10}}>编辑</a>
                <Popconfirm title="是否要删除？" onConfirm={() => this.onDelete(index)}>
                  <a >删除</a>
                </Popconfirm>
              </div>
            )
          }
        }]
  }
  state = {
    data: {
      offset: 0,
      limit: 5,
      org_id: this.props.org_id
    },
    total: 0,
    dataSource: [],
    visible: false,
    page: 0,
    userMes: {},
    isCreate: true
  }

  changeData = (current, orgId) => {
    this.setState({
      data: {
        offset: (current - 1) * 5,
        limit: 5,
        org_id: (this.props && this.props.org_id) || orgId
      },
      page: current
    }, () => {
      getAccountNumber(this.state.data).then(res => {
        res.data.user && res.data.user.map((item, index) => {
          item.key = index
          return 1
        })
        this.setState({
          total: res.data.total,
          dataSource: res.data.user || []
        })
      })
    })
  }

  callbackParent = (val) => {
    this.setState({
      visible: val
    })
  }

  onDelete (index) {
    let data = {}
    data.id = this.state.dataSource[index].id
    data.status = -1
    editUser(data).then(res => {
      this.changeData(this.state.page)
    })
  }

  eidtUser (index) {
    this.setState({
      visible: true,
      userMes: this.state.dataSource[index],
      isCreate: false
    })
  }

  creatUser () {
    // this.props.form.resetFields()
    this.setState({
      visible: true,
      userMes: {},
      isCreate: true
    })
  }

  componentWillMount() { // 进入页面执行
    this.changeData(1)
  }

  render () {
    return (
      <div>
        <div>
          <Button type="primary" style={{marginBottom: 10}} onClick={this.creatUser.bind(this)}>创建账号</Button>
          <Table pagination={false} columns={this.columns} dataSource={this.state.dataSource}></Table>
        </div>
        <div className={style.pagination}>
          <Pagination defaultCurrent={1} total={this.state.total} defaultPageSize={5} onChange={this.changeData.bind(this)}/>
        </div>
        <NewNumber isCreate={this.state.isCreate} userMes={this.state.userMes} visible={this.state.visible} callbackParent={this.callbackParent} changeData={this.changeData} current={this.state.page} org_id={this.props.org_id}></NewNumber>
      </div>
    )
  }
}
