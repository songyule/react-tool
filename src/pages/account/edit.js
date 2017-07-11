import React, { PureComponent } from 'react'
import Title from 'components/title'
import { isEmptyObject } from 'utils/index'
import AccountForm from './form'
import History from './history'
import { connect } from 'react-redux'
import { Button } from 'antd'
import { editUser } from 'actions/user'
import './edit.css'
const ButtonGrop = Button.Group


@connect(
  state => state
)

export default class EditAccount extends PureComponent {
  constructor () {
    super()
    this.state = {
      disabled: true,
      user: []
    }
  }

  handleEdit () {
    this.setState({ disabled: false })
  }

  handleSave () {
    this.accountForm.validateFields(async (err, fieldsValue) => {
      if (err) return

      const { type, userName, phone, email, org, status, role, id } = fieldsValue
      console.log(type ,typeof type)
      const params = {
        name_cn: userName,
        status: status ? 1 : 2,
        mobile: phone,
        mail: email,
        org_id: type === 'a' ? '9e761a02f5d74d3494395a3e46c824e7' : org,
        role: role
      }

      const res = await editUser(params, id)

      if (res.code === 200) {
        this.setState({ disabled: true })
      }
    })

  }

  handleCancel () {
    this.setState({ disabled: true })
  }

  render () {
    const { id, name_cn, mobile, mail, status, role, org } = this.props.location.state
    const { disabled } = this.state

    return (
      <div>

      <Title title={name_cn} >
        <div className="right-button-box">
          {
            disabled
              ? <Button type="primary" onClick={::this.handleEdit}> 编辑 </Button>
              : (
                <ButtonGrop>
                  <Button type="primary" onClick={::this.handleSave}> 保存 </Button>
                  <Button onClick={::this.handleCancel}> 取消 </Button>
                </ButtonGrop>
              )
          }
        </div>
      </Title>
        <AccountForm
          id={id}
          userName={name_cn}
          phone={mobile}
          email={mail}
          status={!!(status === 1)}
          disabled={disabled}
          role={role}
          isPersonal={isEmptyObject(org)}
          ref={(ref) => {this.accountForm = ref}}
        />
        <Title title="登录历史">
        </Title>
        <History id={id}/>
      </div>
    )
  }
}
