import  React, { PureComponent } from 'react'
import { Table, Button, Switch } from 'antd'
import Title from 'components/title'
import style from './index.css'

export default class AccountList extends PureComponent {

  constructor (props) {
    super(props)
    this.state = {
    }
  }

  componentWillMount () {
    this.getList()
  }

  handleSwitch (text, idx) {
    console.log(text, idx)
    const { list } = this.state
    list[idx].state = !list[idx].state
    this.setState({ list: [...list] })
  }

  handleDetail (data) {
    this.props.history.push('/main/account-edit', data)
  }

  handleCreate () {
    this.props.history.push('/main/account-create')
  }

  getList () {
    const dataSource = [
      {
        id: '1',
        user_name: '胡彦斌',
        login_name: 'hyb',
        phone: '15757103387',
        email: '3357458@qq.com',
        org: '辅料易',
        state: 1
      },
      {
        id: '2',
        user_name: '胡彦斌',
        login_name: 'hyb',
        phone: '15757103387',
        email: '3357458@qq.com',
        org: '辅料易',
        state: 0
      }
    ]

    this.setState({ list: dataSource })
  }

  render () {
    const { list } = this.state
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id'
      },
      {
        title: '用户名',
        dataIndex: 'user_name',
        key: 'user_name'
      },
      {
        title: '登录名',
        dataIndex: 'login_name',
        key: 'login_name'
      },
      {
        title: '手机号',
        dataIndex: 'phone',
        key: 'phone'
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email'
      },
      {
        title: '组织名称',
        dataIndex: 'org',
        key: 'org'
      },
      {
        title: '状态',
        dataIndex: 'state',
        render: (text, record, idx) => <Switch defaultChecked={!!text} onChange={() => this.handleSwitch(text, idx)} checkedChildren={'启用'} unCheckedChildren={'禁用'} />
      },
      {
        title: '操作',
        render: (text, record) => <Button onClick={() => this.handleDetail(record)}>查看</Button>
      }
    ]

    return (
      <div>
        <Title title="账户列表">
          <div className={style['account-list__add-button']}>
            <Button type="primary" onClick={::this.handleCreate}>
              新建账户
            </Button>
          </div>
        </Title>
        <Table
          rowKey="id"
          dataSource={list}
          columns={columns}
        />
      </div>
    )
  }
}
