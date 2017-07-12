import React, { PureComponent } from 'react'
import ClientNew from 'components/client/new'
import style from './css/edit.css'
import { Tabs, Select, Button } from 'antd'
import ClientLinkman from 'components/client/linkman'
import ClientAccount from 'components/client/account-number'
import { getOrgMes, getSales, getAccountNumber, setSales } from 'actions/org'
import store from '@/redux/store'

const TabPane = Tabs.TabPane
const Option = Select.Option

export default class extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      orgMes: {},
      props: {
        org_id: this.props.location.state,
        name_cn: '2333'
      },
      disabled: true,
      salesArr: [],
      salesId: '',
      defaultSales: '',
      isClientEdit: true
    }
  }

  componentWillMount() {
    console.log(store.getState().userLogin.org.id)
    if (this.props.location.pathname.substr(6) !== 'clientEdit') {
      this.setState({
        isClientEdit: false
      }, () => {
        this.init()
      })
    } else {
      this.init()
    }
  }

  init () {
    getOrgMes(this.props.location.state).then(res => {
      if (res.data.sn) res.data.snCode = this.state.isClientEdit ? 'CL' + res.data.sn : 'SU' + res.data.sn
      res.data.orgId = this.props.location.state
      res.data.from = this.state.isClientEdit ? 'clientEdit' : 'supplierEdit'
      this.setState({
        orgMes: res.data
      })
    })
    getAccountNumber({offset: 0, limit: 1000, org_id: store.getState().userLogin.org.id}).then(res => {
      this.setState({
        salesArr: res.data.user
      })
    })
    getSales({client_id:this.props.location.state}).then(res => {
      this.setState({
        defaultSales: res.data.id
      })
    })
  }

  tabChange (key) {
    console.log(key)
  }

  eidtSales () {
    this.setState({
      disabled: !this.state.disabled
    }, () => {
      if (this.state.disabled) {
        setSales({client_id: this.props.location.state, user_id: this.state.salesId}).then(res => {
        })
      }
    })
  }

  selectSales (val) {
    this.setState({
      salesId: val
    })
  }

  render () {
    return (
      <div>
        <ClientNew {...this.props} orgMes={this.state.orgMes} isClientEdit={this.state.isClientEdit}></ClientNew>
        <div className={style.tabBox}>
          <Tabs type='card' onChange={this.tabChange} defaultActiveKey="1">
            <TabPane tab='联系人,地址' key='1'>
              <ClientLinkman org_id={this.props.location.state}></ClientLinkman>
            </TabPane>
            {
              this.state.isClientEdit &&
              <TabPane tab='账号管理' key='2'>
                <ClientAccount {...this.state.props}></ClientAccount>
              </TabPane>
            }
            {
              this.state.isClientEdit &&
              <TabPane tab='销售信息' key='3'>
                <span>对接销售：</span>
                <Select style={{ width: 300 }} disabled={this.state.disabled} onChange={this.selectSales.bind(this)} defaultValue={this.state.defaultSales}>
                  {
                    this.state.salesArr && this.state.salesArr.map((item, index) => {
                      return <Option value={item.id} key={index}>{item.name_cn}</Option>
                    })
                  }
                </Select>
                <Button type="primary" style={{marginLeft: 10}} onClick={this.eidtSales.bind(this)}>{this.state.disabled ? '编辑' : '完成'}</Button>
              </TabPane>
            }
          </Tabs>
        </div>
      </div>
    )
  }
}
