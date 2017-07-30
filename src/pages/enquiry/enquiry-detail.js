import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'antd'
import { sellerInquirySearch, sellerWithdraw, sellComplete, closeEnquiry } from 'actions/sampling'
import EnquiryDeatil from './components/enquiry-detail/index'
import QuoMessageF from './components/enquiry-detail/quo-message-f'
import QuoMessageT from './components/enquiry-detail/quo-message-t'

export default class extends PureComponent {
  state = {
    id: '',
    enquiryMes: {},
    isEnqShow: true
  }
  // this.props.match.params.id
  closeEnquiry = () => {
    closeEnquiry({id: this.state.id}).then(res => {
      console.log(res)
    })
  }
  returnQuote = () => {
    sellerWithdraw({id: this.state.id}).then(res => {
      console.log(res)
    })
  }
  confirmResult = () => {
    sellComplete().then(res => {
      console.log(res)
    })
  }
  isShow = () => {
    this.setState({isEnqShow: !this.state.isEnqShow})
  }
  componentWillMount () {
    this.setState({id: this.props.match.params.id}, () => {
      sellerInquirySearch({id: this.state.id, get_snapshot: 1}).then(res => {
        if (res.code === 200) this.setState({enquiryMes: res.data.inquiry[0]})
      })
    })
  }
  render () {
    const { enquiryMes } = this.state
    const Shelters = (<div style={{width: 1000, display: 'flex', justifyContent: 'center'}}>
                        <Button type="primary" onClick={this.closeEnquiry}>关闭工单</Button>
                      </div>)
    const InTheQuotation = (<div style={{width: 1000, display: 'flex', justifyContent: 'center'}}>
                              <Button type="primary"><Link to='/main/enquiry-list'>返回列表页</Link></Button>
                            </div>)
    const ToBeConfirmed = (<div style={{width: 1000, display: 'flex', justifyContent: 'center'}}>
                              <Button type="primary" onClick={this.confirmResult}>确认结果</Button>
                              <Button style={{marginLeft: 10,marginRight: 10}} type="primary" onClick={this.returnQuote}>退回重新报价</Button>
                              <Button type="primary" onClick={this.closeEnquiry}>关闭工单</Button>
                          </div>)
    const OffTheStocks = (<div style={{width: 1000, display: 'flex', justifyContent: 'center'}}>
                            <Button type="primary">重新询价</Button>
                          </div>)
    const ByReturned = (<div style={{width: 1000, display: 'flex', justifyContent: 'center'}}>
                          <Button type="primary" onClick={this.closeEnquiry} style={{marginRight: 10}}>关闭工单</Button>
                          <Button type="primary">重新询价</Button>
                        </div>)
    const offerArr = () => (<div>
                              {enquiryMes && enquiryMes.offer_arr.map((item, index) => (
                                item.material_offer_arr.length ?
                                <QuoMessageT quoMes={item} key={index}></QuoMessageT>
                                 :
                                <QuoMessageF quoMes={item} key={index}></QuoMessageF>
                              ))}
                            </div>)
    return (
      <div style={{paddingBottom: 20}}>

        <EnquiryDeatil enquiryMes={enquiryMes}></EnquiryDeatil>
        <div style={{borderTop: '1px solid #ccc', display: 'flex', justifyContent: 'center', marginBottom: 10}}>
          <p style={{border: '1px solid #ccc', padding: '5px 20px', marginTop: -1, cursor: 'pointer'}} onClick={this.isShow}>{this.state.isEnqShow ? '折叠' : '展开'}</p>
        </div>
        { enquiryMes.status === 4 && this.state.isEnqShow ? offerArr() : ''}
        {/* 待认领 */}
        {
          enquiryMes.status === 0 &&  Shelters
        }
        {/* 待确认 */}
        {
          enquiryMes.status === 4 &&  ToBeConfirmed
        }
        {/* 报价中 */}
        {
          enquiryMes.status === (1 || 3 || -1) && InTheQuotation
        }
        {/* 已完成 */}
        {
          enquiryMes.status === 2 && OffTheStocks
        }
        {/* 被退回 */}
        {
          enquiryMes.status === -2 && ByReturned
        }
      </div>
    )
  }
}
