import React, { PureComponent } from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import * as commodityActions from 'actions/commodity';
import { Table } from 'antd'
import { spu as spuList } from './commodity.json'

const columns = [
  {
    title: '商品名称',
    dataIndex: 'name_cn',
    render: text => <span>{text}</span>
  }
]

@connect(
  state => state,
  dispatch => bindActionCreators(commodityActions, dispatch)
)
class CommodityList extends PureComponent {
  static state = {
    list: []
  }

  constructor () {
    super()

    // this.clickCode = this.clickCode.bind(this)
  }

  clickCode = (e) => {
    // console.log(this)
    // this.props.sendVerify({ mobile: this.state.mobile })
  }

  changeMobile = (e) => {
    this.setState({
      mobile: e.target.value
    })
  }

  changeCode = (e) => {
    this.setState({
      code: e.target.value
    })
  }

  handleLogin = () => {
    this.props.login({ mobile: this.state.mobile, code: this.state.code })
  }

  componentDidMount () {
    // this.props.getSpuList().then(res => {
    //   console.log(res)
    // })
  }

  render () {
    return (
      <div className="page_goods-list">
        <Table rowKey="id" columns={columns} dataSource={spuList}></Table>
      </div>
    )
  }
}

export default CommodityList
