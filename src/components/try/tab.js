import React, { PureComponent } from 'react'
import { Route } from 'react-router-dom'
import { Tabs } from 'antd'
import Label from 'components/try/antdesign'

const TabPane = Tabs.TabPane
export default class extends PureComponent {
  constructor(props) {
    super(props)
    this.newTabIndex = 0
    const panes = [
      { title: 'Tab 1', content: <Route path='/crm' component={Label}/>, key: '1', closable: false },
      { title: 'Tab 2', content: <p>dhhhhhhhhhhhhhhhhhhhhhhh</p>, key: '2' }
    ]
    this.state = {
      activekey: panes[0].key,
      panes
    }
  }

  onChange = (activekey) => {
    console.log(activekey)
    this.setState({ activekey })
  }

  onEdit = (targetkey, action) => {
    this[action](targetkey)
  }

  add = () => {
    const panes = this.state.panes
    const activeKey = `newTab$(this.newTabIndex++)`
    panes.push({title: 'new Tab', content: 'content of new TAB', key: activeKey})
    this.setState({ panes, activeKey})
  }

  remove = (targetkey) => {
    let activeKey = this.state.activekey
    let lastIndex
    this.state.panes.forEach((pane, i) => {
      if (pane.key === targetkey) {
        lastIndex = i -1
      }
    })
    const panes = this.state.panes.filter(pane => pane.key !== targetkey)
    if (lastIndex >= 0 && activeKey === targetkey) {
      activeKey = panes[lastIndex].key
    }
    this.setState({ panes, activeKey})
  }

  render () {
    return (
      <Tabs
      onChange={this.onChange}
      activeKey={this.state.activekey}
      type="editable-cart"
      onEdit={this.onEdit}
      >
        {this.state.panes.map(pane => <TabPane tab={pane.title} key={pane.key} closeable={pane.closable}>{pane.content}</TabPane>)}
      </Tabs>
    )
  }
}
