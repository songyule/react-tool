import React, { Component } from 'react'
import { Icon, Tabs, Input, Checkbox, Pagination } from 'antd'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { findIndex } from 'lodash'
import * as orgActions from 'actions/org'
import style from './select-area.css'
const TabPane = Tabs.TabPane

@connect(
  state => state,
  dispatch => bindActionCreators(orgActions, dispatch)
)
class SelectArea extends Component {
  constructor (props) {
    super(props)

    this.state = {
      selecteds: [],
      labelScroll: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
        params: {},
        list: [],
        kw: ''
      },
      clientScroll: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
        params: {},
        list: [],
        kw: ''
      }
    }
  }

  searchLabel = (e) => {
    this.state.labelScroll.kw = e.target.value
    this.commonGet('label')
  }

  searchClient = (e) => {
    this.state.clientScroll.kw = e.target.value
    this.commonGet('client')
  }

  commonGet = (type) => {
    const scrollType = type + 'Scroll'
    const state = this.state
    // state[scrollType].currentPage = 1
    const params = {
      offset: (state[scrollType].currentPage - 1) * state[scrollType].pageSize,
      limit: state[scrollType].pageSize
    }
    if (state[scrollType].kw) params.kw = state[scrollType].kw
    const getPromise = type === 'client' ? this.props.getClients(params) : this.props.getLabels(params)
    const afterGetPromise = getPromise.then(res => {
      const list = type === 'client' ? res.data.org : res.data.client_label
      this.setState({
        [scrollType]: {
          ...this.state[scrollType],
          total: res.data.total,
          list: list.map(item => {
            item.selected = findIndex(this.props.selecteds, { id: item.id, type }) > -1
            return item
          })
        }
      })
      // const infiniteRef = type === 'client' ? 'clientInfiniteLoading' : 'labelInfiniteLoading'
      // if (state[scrollType].total <= state[scrollType].currentPage * state[scrollType].pageSize) this.$refs[infiniteRef].$emit('$InfiniteLoading:noResults')
    })
    return afterGetPromise
  }

  changeLabel (label) {
    const storageLabel = { id: label.id, type: 'label', data: label, label: `${label.name_cn}（${label.client_count || 0}）` }
    this.commonChangeHandle(storageLabel)
  }

  changeClient (client) {
    const storageClient = { id: client.id, type: 'client', data: client, label: client.name_official }
    this.commonChangeHandle(storageClient)
  }

  commonChangeHandle (item) {
    const index = findIndex(this.props.selecteds, { id: item.id, type: item.type })
    const selecteds = [...this.props.selecteds]
    ~index ? selecteds.splice(index, 1) : selecteds.push(item)
    this.props.onChange(selecteds)
    // this.setState({
    //   selecteds
    // })
  }

  componentWillMount () {
    this.commonGet('label')
    this.commonGet('client')
  }

  render () {
    return (
      <div className={style['select-area']}>
        <div className={style['select-area__left']}>
          <p>从下面选择要添加的客户：</p>
          <Tabs defaultActiveKey="1">
            <TabPane tab="标签" key="1">
              <Input placeholder="请输入客户标签名" onChange={this.searchLabel}></Input>
              <div className={style['select-area__checkbox-scroll']}>
                {this.state.labelScroll.list.map(item =>
                  <div className="select-area__checkbox-box">
                    <Checkbox onChange={ () => this.changeLabel(item) }>{ item.name_cn }（{ item.client_count }）</Checkbox>
                  </div>
                )}
              </div>
              <Pagination defaultCurrent={this.state.labelScroll.currentPage} total={this.state.labelScroll.total}></Pagination>
            </TabPane>
            <TabPane tab="客户" key="2">
              <Input placeholder="请输入客户简称或全称"></Input>
              <div className={style['select-area__checkbox-scroll']}>
                {this.state.clientScroll.list.map(item =>
                  <div className="select-area__checkbox-box">
                    <Checkbox onChange={ () => this.changeClient(item) }>{ item.name_official }</Checkbox>
                  </div>
                )}
              </div>
              <Pagination defaultCurrent={this.state.clientScroll.currentPage} total={this.state.clientScroll.total} onChange={this.searchClient}></Pagination>
            </TabPane>
          </Tabs>
        </div>
        <div className={style['select-area__arrow']}>
          <Icon type="right"></Icon>
        </div>
        <div className={style['select-area__right']}>
          <p>已选择的客户：</p>
          {this.props.selecteds.map(item =>
            <div className="select-area__checkbox-box">
              { item.label }
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default SelectArea
