import React, { PureComponent } from 'react'

export default class EditAccount extends PureComponent {

  componentWillMount () {
    console.log(this.props.location.state)
  }

  render () {
    return (
      <div className="page_account-edit">
      </div>
    )
  }
}
