import React, { PureComponent } from 'react'
import Title from 'components/title'
import { isEmptyObject } from 'utils/index'
import AccountForm from './form'
import History from './history'
import { connect } from 'react-redux'
import { Button, message } from 'antd'
import { editUser } from 'actions/user'
import { getUserInfo } from 'actions/user'
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
      user: [],
      resetForm: false,
      data: {}
    }
  }

  componentWillMount () {
    this.getInfo()
  }

  handleEdit () {
    this.setState({
      disabled: false,
      resetForm: false
    })
  }

  handleSave () {
    this.accountForm.validateFields(async (err, fieldsValue) => {
      if (err) return

      const { type, userName, phone, email, org, status, role, id } = fieldsValue

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
        message.success('保存成功')
        this.setState({ disabled: true })
        this.getInfo()
      }
    })

  }

  handleCancel () {
    this.setState({
      disabled: true,
      resetForm: true,
    })
  }

  getInfo = async () => {
    const { data } = await getUserInfo(this.props.location.state.id)
    this.setState({ data })
  }

  render () {

    const { id, name_cn, mobile, mail, status, role, org, org_id } = this.state.data
    const { disabled, resetForm } = this.state
    console.log(id)
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
          resetForm={resetForm}
          isPersonal={isEmptyObject(org)}
          orgId={org_id}
          ref={(ref) => {this.accountForm = ref}}
        />
        <Title title="登录历史">
        </Title>
        { id ? <History id={id} /> : null}
      </div>
    )
  }
}
