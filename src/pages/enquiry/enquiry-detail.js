import React, { PureComponent } from 'react'
import { Button } from 'antd'
import { closeEnquiry } from 'actions/sampling'
import EnquiryDeatil from './components/enquiry-detail/index'

export default class extends PureComponent {
  state = {
    id: ''
  }
  // this.props.match.params.id
  closeEnquiry = () => {
    closeEnquiry({id: this.state.id}).then(res => {
      console.log(res)
    })
  }
  componentWillMount () {
    this.setState({id: this.props.match.params.id})
  }
  render () {
    return (
      <div style={{paddingBottom: 20}}>
        <EnquiryDeatil></EnquiryDeatil>
        <div style={{width: 1000, display: 'flex', justifyContent: 'center'}}>
          <Button type="primary" onClick={this.closeEnquiry}>关闭工单</Button>
        </div>
      </div>
    )
  }
}
