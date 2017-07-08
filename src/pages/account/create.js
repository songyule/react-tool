import React, { PureComponent } from 'react'
import Title from 'components/title'
import AccountForm from './form'
import { Button } from 'antd'
import { createUser } from 'actions/user'

export default class CreateAccount extends PureComponent {

  handleCreate = () => {
    console.log(this.accountForm)
    this.accountForm.validateFields(async (err, fieldsValue) => {
      if (err) return

      const { type, userName, phone, email, org, status, role } = fieldsValue

      const params = {
        name_cn: userName,
        status: status ? 1 : 2,
        mobile: phone,
        mail: email,
        org_id: type === 'a' ? '' : org,
        role: role
      }
      const res = await createUser(params)
    })

  }

  render () {
    return (
      <div>
        <Title title="新建账户" />
        <AccountForm
          status
          getAccountData={this.handle}
          ref={(ref) => { this.accountForm = ref }}
        />
        <Button onClick={this.handleCreate}> 创建 </Button>
      </div>
    )
  }
}
