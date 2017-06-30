import React, { PureComponent } from 'react'
import AccountForm from './form'
import { Button } from 'antd'

export default class CreateAccount extends PureComponent {

  componentWillMount () {
    console.log(this.props.location.state)
  }

  render () {
    return (
      <div className="page_account-edit">
        <AccountForm>
        </AccountForm>
        <Button>
          创建
        </Button>
      </div>
    )
  }
}
