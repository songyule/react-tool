import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Collapse } from 'antd'
const [ Panel ] = [ Collapse.Panel ]

@connect(
  state => state
)
export default class OrderCollapse extends PureComponent {
  render () {
    return (
      <Collapse>
        <Panel header="展开工单详情" key="1">
        </Panel>
      </Collapse>
    )
  }
}
