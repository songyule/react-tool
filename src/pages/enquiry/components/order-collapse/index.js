import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Collapse } from 'antd'
import EnquiryDeatil from 'pages/enquiry/components/enquiry-detail/index'
import style from './index.css'
const [ Panel ] = [ Collapse.Panel ]

@connect(
  state => state
)

export default class OrderCollapse extends PureComponent {
  state = {
    enquiryMes: {}
  }
  componentWillReceiveProps (nextProps) {
    console.log(nextProps.enquiryMes)
    this.setState({
      enquiryMes: nextProps.enquiryMes
    })
  }
  render () {
    return (
      <Collapse className={style['order-collapse']}>
        <Panel header="展开工单详情" key="1">
          <EnquiryDeatil enquiryMes={this.props.enquiryMes}></EnquiryDeatil>
        </Panel>
      </Collapse>
    )
  }
}
