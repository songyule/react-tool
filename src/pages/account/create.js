import React, { PureComponent } from 'react'
import Title from 'components/title'
import AccountForm from './form'
import { Button } from 'antd'

export default class CreateAccount extends PureComponent {

  render () {
    return (
      <div>
        <Title title="新建账户" />
        <AccountForm />
        <Button> 创建 </Button>
      </div>
    )
  }
}
