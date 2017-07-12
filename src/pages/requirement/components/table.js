import React, { PureComponent } from 'react'
import { format } from 'utils/index'
import { Tag, Button } from 'antd'
import style from './table.css'
const ButtonGroup = Button.Group

export default class RequirementTable extends PureComponent {

  handleEdit = (e, id, type) => {
    console.log(id, type)
    const { onEdit } = this.props
    onEdit(id, type)
  }

  render () {
    const { data } = this.props
    const TABLE_TH_NAMES = ['需求内容', '数量', '状态', '操作']
    const STATUS_MAP = {
      0: '刚创建',
      1: '已完成',
      [-1]: '已关闭'
    }

    return (
      <table className={style['table']}>
        <thead>
          <tr>
            {TABLE_TH_NAMES.map((name, idx) => (
              <th className={style['thead__th']} key={idx}>{name}</th>
            ))}
          </tr>
        </thead>
        {
          data.map(item => (
            <tbody key={item.id} className={style['tbody']}>
            <tr className={style['tbody__tr--blank']}>
              <th className={style['tbody__th--blank']} colSpan ="4" />
            </tr>
            <tr className={style['tbody__tr']}>
              <th className={style['tbody__th']} colSpan ="4">
                <div className={style['tbody__th-content']}>
                  <span>
                    打样单号：{item.id}
                    创建时间：{format(item.created_at * 1000, 'yyyy-MM-dd HH:mm:ss')}
                  </span>
                  <span>
                    客户：{item.applicant_user.name_cn}
                  </span>
                </div>
              </th>
            </tr>
            <tr className={style['tbody__tr']}>
              <td width="50%">
                <div className={style['content']}>
                  <img src={item.img_arr[0]} alt="1" />
                  <div className={style['content__detail']}>
                    <div className={style['content__detail-wrapper']}>
                      <div className={style['content__name']}>{item.sku_snapshot.spu_name_cn}</div>
                      <div>
                        {
                          item.classification === 0
                            ? <Tag color="blue"> 原版 </Tag>
                            : item.classification === 1
                              ? <Tag color="green"> 改版 </Tag>
                              : <Tag color="orange"> 定制 </Tag>
                        }
                        <span>SKUID：{item.sku_snapshot.id}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
              <td width="15%">
              {item.sample_amount}
              </td>
              <td width="15%">
              {
                STATUS_MAP[item.status]
              }
              </td>
              <td width="20%">
                {
                  item.status === 0
                    ? (
                      <ButtonGroup>
                        <Button> 详情 </Button>
                        <Button type="primary" onClick={(e, id, type) => this.handleEdit(e, item.id, 1)}> 标为完成 </Button>
                        <Button type="danger"onClick={(e, id, type) => this.handleEdit(e, item.id, 2)}> 取消需求 </Button>
                      </ButtonGroup>
                    )
                    : <Button> 详情 </Button>
                }
              </td>
            </tr>
            </tbody>
          ))
        }
      </table>
    )
  }
}
