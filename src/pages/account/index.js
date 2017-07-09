import  React, { PureComponent } from 'react'
import Title from 'components/title'
import style from './index.css'
import { Table, Button, Switch, Input, Select, Modal, message } from 'antd'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as userActions from 'actions/user'
import * as managementActions from 'actions/management'
import { isEmptyObject } from 'utils/index'
const [Option, Search, ButtonGroup] = [Select.Option, Input.Search, Button.Group]



@connect(
  state => state,
  dispatch => bindActionCreators({
    getRoleList: userActions.getRoleList,
    ...managementActions
  }, dispatch)
)

export default class AccountList extends PureComponent {

  constructor (props) {
    super(props)

    this.state = {
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        onChange: this.changePage
      },
      search: {
        type: 'org_name_official',
        content: ''
      }
    }
  }

  componentWillMount () {
    this.getList()
    this.props.getRoleList()
    this.props.getOrgList({ limit: 10000 })
  }

  changePage = (e) => {
    this.setState(
      {
        pagination: {
          ...this.state.pagination,
          current: e,
        }
      },
      this.getList
    )
  }

  changeSearchType = (e) => {
    this.setState({
      search: {
        ...this.state.search,
        type: e
      }
    })
  }

  onSearch = (value) => {
    if (!value) return
    this.setState(
      {
        search: {
          ...this.state.search,
          content: value
        }
      },
      this.getList
    )
  }

  async handleSwitch (text, idx) {
    const { data } = this.state
    const res = await userActions.editUser(
      { status: data[idx].status === 2 ? 1 : 2 },
      data[idx].id
    )

    if (res.code === 200) {
      data[idx].status = !data[idx].status
      this.setState({ data: [...data] })
    }
  }

  handleDetail (data) {
    this.props.history.push('/main/account-edit', data)
  }

  async handleDelete (id) {
    Modal.confirm({
      title: 'Confirm',
      content: '确定要删除这个账号吗？',
      onOk: async () => {
        const res = await userActions.deleteUser(id)
        if (res.code === 200) {
          message.success('删除成功')
          this.getList()
        }
      }
    })
  }

  handleCreate () {
    this.props.history.push('/main/account-create')
  }

  async getList () {
    const { current, pageSize } = this.state.pagination
    const { type, content } = this.state.search

    const params = {
      limit: pageSize,
      offset: (current - 1) * pageSize,
    }

    if (content) params[type] = content

    const { data } = await userActions.getUserList(params)

    this.setState({
      data: data.user,
      pagination: {
        ...this.state.pagination,
        total: data.total,
      }
    })
  }

  render () {
    const { data, pagination } = this.state
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id'
      },
      {
        title: '用户名',
        dataIndex: 'name_cn',
        key: 'name_cn'
      },
      {
        title: '手机号',
        dataIndex: 'mobile',
        key: 'mobile'
      },
      {
        title: '邮箱',
        dataIndex: 'mail',
        key: 'mail'
      },
      {
        title: '组织名称',
        dataIndex: 'org',
        render: (text, record, idx) => (<span>{!isEmptyObject(text) && text.name_official}</span>)
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: (text, record, idx) => <Switch defaultChecked={text === 1} onChange={() => this.handleSwitch(text, idx)} checkedChildren={'启用'} unCheckedChildren={'禁用'} />
      },
      {
        title: '操作',
        render: (text, record) => (
          <ButtonGroup>
            <Button type="primary" onClick={() => this.handleDetail(record)}>查看</Button>
            <Button type="danger" onClick={() => this.handleDelete(record.id)}>删除</Button>
          </ButtonGroup>
        )
      }
    ]

    const selectBefore = (
      <Select defaultValue="org_name_official" style={{ width: 80 }} onChange={this.changeSearchType}>
        <Option value="mobile">手机号
        </Option>
        <Option value="org_name_official">组织名称
        </Option>
      </Select>
    )

    return (
      <div>
        <Title title="账户列表">
          <div className={style['account-list__add-button']}>
            <div>
              <Search addonBefore={selectBefore} placeholder='搜索' onSearch={value => this.onSearch(value)} />
            </div>
            <Button type="primary" onClick={::this.handleCreate}> 新建账户 </Button>
          </div>
        </Title>
        <Table
          rowKey="id"
          dataSource={data}
          columns={columns}
          pagination={pagination}
        />
      </div>
    )
  }
}
