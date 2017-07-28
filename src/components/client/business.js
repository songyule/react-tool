import React, { PureComponent } from 'react'
import { Select, Button } from 'antd'
import { editOrgMes } from 'actions/org'
import { getClass, editOrgClass } from 'actions/commodity'
import MyUpload from '../../pages/topic/components/img-upload'
import style from './css/business.css'

const Option = Select.Option
const children = []

export default class extends PureComponent {
	state = {
    classArr: [],
    selectClass: [],
    defaultClass: [],
    orgMes: {},
    arrIds: [],
    business_license: [],
    org_code: [],
    tax_reg: []
	}
  componentWillMount() {
    getClass({level: 1}).then(res => {
      console.log(res)
      res.data.map(item => {
        return children.push(<Option key={ item.lv1_id.toString() }>{item.name_cn}</Option>)
      })
      this.setState({
        classArr: children
      }, () => {
        console.log(this.state.classArr)
      })
    })
  }
  handleChange(value) {
    this.setState({
      arrIds: value,
      selectClass: value
    })
  }
  handleChangeImg = (fileList, b) => {
    console.log(fileList, b)
    let data = {}
    data.id = this.props.org_id
    if (b === 'a') {
      data.business_license = (fileList && fileList[0].response) || ''
      this.setState({ business_license: [...fileList] })
    } else if (b === 'b') {
      data.org_code = (fileList && fileList[0].response) || ''
      this.setState({ org_code: [...fileList] })
    } else {
      data.tax_reg = (fileList && fileList[0].response) || ''
      this.setState({ tax_reg: [...fileList] })
    }
    editOrgMes(data).then(res => {
      console.log(res)
    })
  }
  saveClass () {
    let data = {}
    data.id = this.props.org_id
    data.class_id = this.state.selectClass
    editOrgClass(data).then(res => {
      console.log(res)
    })
  }
  componentWillReceiveProps (nextProps) { // props 更新时候触发
    this.setState({
      defaultClass: nextProps.orgMes && nextProps.orgMes.class,
      orgMes: nextProps.orgMes
    }, () => {
      if (!this.state.defaultClass) return
      let arrId = []
      this.state.defaultClass.map(item => {
        return arrId.push(item.id.toString())
      })
      let fieldArr = ['business_license', 'org_code', 'tax_reg']
      fieldArr.map((item, index) => {
        if (this.state.orgMes.license && this.state.orgMes.license[item]) {
          this.setState({
            [item]: [{
              uid: -1,
              name: '233',
              status: 'done',
              url: (this.state.orgMes.license && this.state.orgMes.license[item]) || '',
              response: (this.state.orgMes.license && this.state.orgMes.license[item]) || '',
              thumbUrl: (this.state.orgMes.license && this.state.orgMes.license[item]) || '',
            }]
          })
        }
        return 1
      })
      this.setState({
        arrIds: arrId
      })
    })
  }
  render () {
    var { arrIds } = this.state
		return (
      <div>
        <div className={style.class}>
          <p style={{width: 80}}>生产业务：</p>
          <Select
            mode="multiple"
            style={{ width: 300 }}
            placeholder="Please select"
            value={arrIds}
            ref='select'
            onChange={this.handleChange.bind(this)}
          >
            {this.state.classArr}
          </Select>
          <Button type="primary" style={{marginLeft: 10}} onClick={this.saveClass.bind(this)}>保存</Button>
        </div>
        <div className={style.aptitude}>
          <p>上传资质：</p>
          <div className={style.aptitudeBox}>
            <p>工商营业执照</p>
            <div>
              <MyUpload fileList={[...this.state.business_license]} onChange={(file) => this.handleChangeImg(file, 'a')}></MyUpload>
            </div>
          </div>
          <div className={style.aptitudeBox}>
            <p>组织机构代码证</p>
            <div>
              <MyUpload fileList={[...this.state.org_code]} onChange={(file) => this.handleChangeImg(file, 'b')}></MyUpload>
            </div>
          </div>
          <div className={style.aptitudeBox}>
            <p>税务登记证</p>
            <div>
              <MyUpload fileList={[...this.state.tax_reg]} onChange={(file) => this.handleChangeImg(file, 'c')}></MyUpload>
            </div>
          </div>
        </div>
      </div>
		)
	}
}
