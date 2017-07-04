import React, { PureComponent } from 'react'
import Title from 'components/title'
import AccountForm from './form'
import AccountTabs from './tabs'
import { Button } from 'antd'

export default class EditAccount extends PureComponent {

  componentWillMount () {
    console.log(this.props.location.state)
  }

  handleSave () {

  }

  render () {
    const { id, user_name, login_name, phone, email } = this.props.location.state
    return (
      <div>
        <Title title={user_name}>
        </Title>
        <AccountForm
          id={id}
          userName={user_name}
          loginName={login_name}
          phone={phone}
          email={email}
        >
        </AccountForm>
        <Button onClick={this.handleSave}>
          保存
        </Button>
        <AccountTabs>
        </AccountTabs>
      </div>
    )
  }
}
