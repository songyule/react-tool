import  React, { PureComponent } from 'react'
import { Table, Button } from 'antd'
import style from './index.css'
const ButtonGroup = Button.Group

export default class AccountList extends PureComponent {

  constructor (props) {
    super(props)
    this.state = {
    }
  }

  componentWillMount () {
    this.getList()
  }

  handleUse (e, idx) {
    e.stopPropagation()
    const { list } = this.state
    list[idx].state = '有效'
    this.setState({ list: [...list] })
  }

  handleDisable (e, idx) {
    e.stopPropagation()
    const { list } = this.state
    list[idx].state = '无效'
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
        state: '有效'
      },
      {
        id: '2',
        user_name: '胡彦斌',
        login_name: 'hyb',
        phone: '15757103387',
        email: '3357458@qq.com',
        org: '辅料易',
        state: '有效'
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
        key: 'state'
      },
      {
        title: '操作',
        render: (text, record, idx) => (
          list[idx].state === '有效'
            ? (
              <ButtonGroup>
                <Button type="danger" onClick={(e) => this.handleDisable(e, idx)}>
                  禁用
                </Button>
              </ButtonGroup>
            )
            : (
              <ButtonGroup>
                <Button type="primary" onClick={(e) => this.handleUse(e, idx)}>
                  启用
                </Button>
              </ButtonGroup>
            )
        )
      }
    ]

    return (
      <div className={style['page_account-list']}>
        <Button type="primary" onClick={::this.handleCreate}>
          新建账户
        </Button>
        <Table
          rowKey="id"
          dataSource={this.state.list}
          columns={columns}
          onRowClick={::this.handleDetail}
        />
      </div>
    )
  }
}
