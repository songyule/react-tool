import React, { PureComponent } from 'react'
import { Input, Button, Row, Col, Pagination, Card, Select } from 'antd'
import { Link } from 'react-router-dom'
import { searchOrg } from 'actions/org'
import Title from 'components/title'
import style from './css/list.css'

const Search = Input.Search
const Option = Select.Option

export default class extends PureComponent {

  state = {
    searchData:{
      offset: 0,
      limit: 15,
      kw: ''
    },
    pageSize: 0,
    resultData: [],
    isClientList: true
  }

  constructor(props) {
    super(props)
    console.log(props)
  }

  getOrgMess (val, current) { // 搜索结果
    let a = this.state.isClientList ? 2 : 3
    this.setState({
      searchData: {
        kw: val,
        limit: 15,
        offset: (current - 1) * 15,
        org_type: a
      }
    }, () => {
      searchOrg(this.state.searchData).then(res => {
        this.setState({
          total: res.data.total,
          resultData: res.data.org
        })
      })
    })
  }

  changeData(current) { // 点击分页
    this.setState({
      pageSize: current
    })
    this.getOrgMess(this.state.searchData.kw, current)
  }

  componentWillMount() { // 进入页面执行
    if (this.props.location.pathname.substr(6) !== 'clientList') {
      this.setState({
        isClientList: false
      })
    }
    setTimeout(() => {
      this.getOrgMess('', 1)
    }, 0)
  }

  gotoEdit (id) {
    this.state.isClientList ? this.props.history.push({pathname: '/main/clientEdit', state: id}) : this.props.history.push({pathname: '/main/supplierEdit', state: id})
  }

  render () {
    const selectBefore = (
      <Select defaultValue="公司名称" style={{ width: 80 }} onChange={this.changeSearchType} disabled>
        <Option value="title">公司名称</Option>
      </Select>
    )
    return (
      <div className={style.box}>

        <Title title={this.state.isClientList ? '客户列表' : '供应商列表'}>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <Search
              addonBefore={selectBefore}
              placeholder="input search text"
              style={{ width: 300 }}
              onSearch={value => this.getOrgMess(value, 1)}
            />
            <Button type="primary">
              {
                this.state.isClientList ?
                (<Link to="/main/clientNew">新建客户</Link>) :
                (<Link to="/main/supplierNew">新建供应商</Link>)
              }
            </Button>
          </div>
        </Title>

        <div>
        {
          this.state.total > 0 ? (
            <Row gutter={16}>
              {
                this.state.resultData.map((item, index) => {
                  return <Col span={8} key={index} className={style.orgCardBox}>
                            <Card>
                              <div className={style.orgCard} onClick={this.gotoEdit.bind(this, item.id)}>
                                <img src={item.icon ? item.icon : 'http://odsbdg1pr.bkt.clouddn.com/ffff.jpg'} className={style.orgImg} alt='' title="点我可以编辑哦"/>
                                <div className={style.orgMessage}>
                                  <p>{item.name_cn}</p>
                                  <p>{item.name_official}</p>
                                  <p>{item.phone}</p>
                                  <p>{item.website}</p>
                                </div>
                              </div>
                            </Card>
                          </Col>
                })
              }
            </Row>
          ) : (
            <p className={style.text}>没有结果，试试新建一个客户吧。</p>
          )
        }
        </div>
        <div className={style.boxBottom}>
          <Pagination defaultCurrent={1} total={this.state.total} defaultPageSize={15} onChange={this.changeData.bind(this)}/>
        </div>
      </div>
    )
  }
}
