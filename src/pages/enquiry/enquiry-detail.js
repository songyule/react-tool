import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import { Button, Modal, Input, message, Select, Spin, Popconfirm } from 'antd'
import { uploadQiniuBase64 } from 'api/common'
import Title from 'components/title'
import CopyToClipboard from 'react-copy-to-clipboard'
import { sellerInquirySearch, sellerWithdraw, sellComplete, closeEnquiry } from 'actions/sampling'
import { download } from 'utils'
import EnquiryDeatil from './components/enquiry-detail/index'
import QuoMessageF from './components/enquiry-detail/quo-message-f'
import QuoMessageT from './components/enquiry-detail/quo-message-t'
import html2canvas from 'html2canvas'

const Option = Select.Option
export default class extends PureComponent {
  state = {
    id: '',
    enquiryMes: {},
    isEnqShow: false,
    visible: false,
    returnVisible: false,
    returnCauseText: '',
    offer_id: -1,
    borderStyle: false,
    version: {},
    loading: false,
    snapshotVisible: false
  }
  // this.props.match.params.id
  closeEnquiry = () => {
    closeEnquiry({id: this.state.id}).then(res => {
      this.props.history.push('/main/enquiry-list')
    }).catch(err => {
      message.warning('关闭工单时发生错误，请刷新后重试')
    })
  }
  returnQuote = () => {
    this.setState({visible: true})

  }
  confirmResult = () => {
    if (this.state.offer_id === -1) return message.warning('请选择一个报价')
    sellComplete({id: this.state.id, offer_id: this.state.offer_id}).then(res => {
      console.log(res)
      if (res.code === 200) this.props.history.push({pathname: '/main/enquiry-list'})
    })
  }
  isShow = () => {
    this.setState({isEnqShow: !this.state.isEnqShow})
  }
  againQuote = () => {
    this.props.history.push(`/main/edit-enquiry/A${this.state.id}`)
  }
  handleOk = (e) => {
    if (!this.state.returnCauseText) return
    this.setState({
      visible: false,
    }, () => {
      console.log(this.state.returnCauseText)
      sellerWithdraw({id: this.state.id, offer_withdraw_reason: this.state.returnCauseText}).then(res => {
        console.log(res)
        if (res.code === 200) this.props.history.push(`/main/edit-enquiry/B${this.state.id}`)
      })
    })
  }

  returnHandleOk = (e) => {
    this.setState({
      returnVisible: false,
    })
  }
  handleCancel = (e) => {
    this.setState({
      visible: false,
    })
  }
  returnHandleCancel = (e) => {
    this.setState({
      returnVisible: false,
    })
  }
  returnCause = (e) => {
    this.setState({returnCauseText: e.target.value})
  }
  callBack = (val) => {
    console.log(val)
    this.setState({
      offer_id: val.id
    })
  }
  history = (e) => {
    console.log(this.state.version.snapshot_arr[e])
    this.setState({enquiryMes: this.state.version.snapshot_arr[e]})
  }
  handleSnapshot = () => {
    const $body = document.body
    const $root = $body.querySelector('#root')
    const $dataSource = $body.querySelector('#dataSource')
    const $clientInfo = $body.querySelector('#clientInfo')
    const that = this
    $root.style.height = 'auto'
    $dataSource.style.display = 'none'
    $clientInfo.style.display = 'none'
    this.setState({ loading: true })

    html2canvas(this.refs.enquiryPage, {
      profile: true,
      useCORS: true,
      background: '#ffffff',
      onrendered: async function (canvas) {
        $root.style.height = '100%'
        $dataSource.style.display = 'block'
        $clientInfo.style.display = 'block'
        const res = await uploadQiniuBase64(canvas.toDataURL())
        that.setState({ loading: false, snapshotVisible: true, snapshot: res })
      }
    })
  }
  snapshotClose = () => {
    this.setState({ snapshotVisible: false })
  }
  componentWillMount () {
    this.setState({id: this.props.match.params.id}, () => {
      sellerInquirySearch({id: this.state.id, get_snapshot: 1}).then(res => {
        if (res.code === 200) {
          this.setState({
            enquiryMes: res.data.inquiry[0],
            returnVisible: res.data.inquiry[0].status === -2 && res.data.inquiry[0].no_supplier_withdraw_reason,
            version: res.data.inquiry[0]
          })
        }
      })
    })
  }
  render () {
    const { enquiryMes, version } = this.state
    const Shelters = (<div style={{width: 1000, display: 'flex', justifyContent: 'center'}}>
                        <Popconfirm title="确认要关闭该工单？" okText="确认" cancelText="取消" onConfirm={this.closeEnquiry}>
                          <Button type="primary">关闭工单</Button>
                        </Popconfirm>
                      </div>)
    const InTheQuotation = (<div style={{width: 1000, display: 'flex', justifyContent: 'center'}}>
                              <Button type="primary"><Link to='/main/enquiry-list'>返回列表页</Link></Button>
                            </div>)
    const ToBeConfirmed = (<div style={{width: 1000, display: 'flex', justifyContent: 'center'}}>
                              <Button type="primary" onClick={this.confirmResult}>确认结果</Button>
                              <Button style={{marginLeft: 10,marginRight: 10}} type="primary" onClick={this.returnQuote}>退回重新报价</Button>
                              <Popconfirm title="确认要关闭该工单？" okText="确认" cancelText="取消" onConfirm={this.closeEnquiry}>
                                <Button type="primary">关闭工单</Button>
                              </Popconfirm>
                          </div>)
    const OffTheStocks = (<div style={{width: 1000, display: 'flex', justifyContent: 'center'}}>
                            <Button type="primary" onClick={this.againQuote}>重新询价</Button>
                          </div>)
    const ByReturned = (<div style={{width: 1000, display: 'flex', justifyContent: 'center'}}>
                          <Button type="primary" onClick={this.againQuote}>重新询价</Button>
                        </div>)
    const offerArr = () => (<div>
                              {enquiryMes && enquiryMes.offer_arr.map((item, index) => (
                                item.material_offer_arr.length ?
                                <QuoMessageT style={{background: 'red'}} material_arr={enquiryMes.material_arr} borderStyle={this.state.offer_id} quoMes={item} key={index} callBack={this.callBack}></QuoMessageT>
                                 :
                                <QuoMessageF style={{background: 'red'}} borderStyle={this.state.offer_id} quoMes={item} key={index} callBack={this.callBack}></QuoMessageF>
                              ))}
                            </div>)
    return (
      <div style={{paddingBottom: 20}} ref="enquiryPage">
        <Spin spinning={this.state.loading}>
          <Title title={'询价单详情: ' + enquiryMes.id}>
            {
              (version.snapshot_arr && version.snapshot_arr.length) && ( <Select style={{width: 120}} defaultValue='历史版本' onChange={this.history}>
                                                                          {
                                                                            version.snapshot_arr.map((item, index) => {
                                                                              return (<Option  key={index} value={index.toString()}>{item.version}</Option>)
                                                                            })
                                                                          }
                                                                        </Select>)
            }
            <Button type="primary" style={{ marginLeft: '8px' }} onClick={this.handleSnapshot}>生成快照</Button>
          </Title>
          <EnquiryDeatil enquiryMes={enquiryMes}></EnquiryDeatil>
          <div style={{borderTop: '1px solid #ccc', display: 'flex', justifyContent: 'center', marginBottom: 10}}>
            <p style={{border: '1px solid #ccc', padding: '5px 20px', marginTop: -1, cursor: 'pointer'}} onClick={this.isShow}>{this.state.isEnqShow ? '折叠' : '展开'}</p>
          </div>
          { enquiryMes && enquiryMes.offer_arr && enquiryMes.offer_arr.length && this.state.isEnqShow ? offerArr() : ''}
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
            ([1, 3, -1].indexOf(enquiryMes.status) !== -1) && InTheQuotation
          }
          {/* 已完成 */}
          {
            enquiryMes.status === 2 && OffTheStocks
          }
          {/* 被退回 */}
          {
            enquiryMes.status === -2 && ByReturned
          }
          <Modal
            title="是否退回报价"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <Input placeholder="请填写退回原因" onChange={this.returnCause}></Input>
          </Modal>
          <Modal
            title="是否退回报价"
            visible={this.state.returnVisible}
            onOk={this.returnHandleOk}
            onCancel={this.returnHandleCancel}
          >
            <p>{enquiryMes.no_supplier_withdraw_reason}</p>
          </Modal>

          <Modal
            title="快照展示"
            visible={this.state.snapshotVisible}
            width={800}
            footer={null}
            onCancel={this.snapshotClose}>
            <img src={this.state.snapshot} style={{ maxWidth: '100%' }} alt=""/>
            <Button style={{ marginRight: '8px' }} onClick={() => download(this.state.snapshot)}>下载图片</Button>
            <CopyToClipboard text={this.state.snapshot}>
              <Button>复制图片链接</Button>
            </CopyToClipboard>
          </Modal>
        </Spin>
      </div>
    )
  }
}
