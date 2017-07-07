import React, { PureComponent } from 'react'
import Title from 'components/title'
import { isEmptyObject } from 'utils/index'
import AccountForm from './form'
import AccountTabs from './tabs'
import { connect } from 'react-redux'
import { Button } from 'antd'
import { getUserInfo } from 'actions/user'
import { getGroupList } from 'actions/org'
import style from './edit.css'
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
    this.setState({ disabled: true })
  }

  handleCancel () {
    this.setState({ disabled: true })
  }

  render () {
    console.log(this.props)
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
          status={!!status}
          disabled={disabled}
          role={role}
          isPersonal={isEmptyObject(org)}
        />
        <AccountTabs
          role={role}
          isOrg={!isEmptyObject(org)}
          disabled={disabled}
        />
      </div>
    )
  }
}
