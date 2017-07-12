import React, { PureComponent } from 'react'
import Title from 'components/title'
import Table from './components/table'
import { getRequirementList, editRequirement } from 'actions/sampling'
import { Tabs,  Pagination, message } from 'antd'
const TabPane = Tabs.TabPane

export default class RequirementList extends PureComponent {

  constructor () {
    super()

    this.state = {
      state: '0',
      data: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
      },
    }
  }

  componentWillMount () {
    this.getRequirementList()
  }

  handleChange = (e) => {
    this.setState(
      {
        state: e,
        pagination: {
          ...
          {
            total: 0,
            current: 1,
            pageSize: 10,
          }
        }
      },
      this.getRequirementList
    )
  }

  onChange = (page) => {
    this.setState(
      {
        pagination: {
          ...this.state.pagination,
          current : page
        }
      },
      this.getRequirementList
    )
  }

  onEdit = async (id, type) => {
    const res = await editRequirement({
      id,
      status: type === 1 ? '1' : '-1'
    })

    if (res.code === 200) {
      message.success(type === 1 ? '操作成功' : '取消成功')
      this.setState({
        pagination: {
          ...this.state.pagination,
          current: 1
        }
      }, this.getRequirementList)
    }
  }

  getRequirementList = async () => {
    const { current, pageSize } = this.state.pagination
    const { state } = this.state

    const params = {
      limit: pageSize,
      offset: (current - 1) * pageSize,
    }

    if (state === '0' || state === '1') params['state'] = state
    const res = await getRequirementList(params)

    this.setState({
      data: res.data.sampling,
      pagination: {
        ...this.state.pagination,
        total: res.data.total
      }
    })

    document.querySelector('.scroll-mark').scrollTop = 0
  }

  render () {
    const { data } = this.state
    const { total, current } = this.state.pagination

    return (
      <div>
        <Title title="需求单列表" />
        <Tabs onChange={this.handleChange} type="card">
          <TabPane tab="未完成" key="0"></TabPane>
          <TabPane tab="全部" key="-1"></TabPane>
          <TabPane tab="已完成" key="1"></TabPane>
        </Tabs>
        <Table
          data={data}
          onEdit={(id, type) => this.onEdit(id, type)}
        />
        <div style={{textAlign: 'right', padding: '20px 0'}}>
          <Pagination defaultCurrent={1} current={current} onChange={this.onChange} total={total} />
        </div>
      </div>
    )
  }
}
