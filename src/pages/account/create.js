import React, { PureComponent } from 'react'
import Title from 'components/title'
import style from './create.css'
import AccountForm from './form'
import { Button, message } from 'antd'
import { createUser } from 'actions/user'

export default class CreateAccount extends PureComponent {

  handleCreate = () => {
    this.accountForm.validateFields(async (err, fieldsValue) => {
      if (err) return

      const { type, userName, phone, email, org, status, role } = fieldsValue

      const params = {
        name_cn: userName,
        status: status ? 1 : 2,
        mobile: phone,
        mail: email,
        org_id: type === 'a' ? '9e761a02f5d74d3494395a3e46c824e7' : org,
        role: role
      }

      const res = await createUser(params)

      if (res.code === 200) {
        message.success('创建成功')
        this.props.history.push('/main/account-list')
      }
    })

  }

  render () {
    return (
      <div>
        <Title title="新建账户" />
        <AccountForm
          status
          getAccountData={this.handle}
          ref={(ref) => {this.accountForm = ref}}
        />
        <div className={style['create-button']}>
          <Button type="primary" size="large" onClick={this.handleCreate}> 创建 </Button>
        </div>
      </div>
    )
  }
}
