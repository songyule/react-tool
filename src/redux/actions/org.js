import fetch from 'api/utils'

export const searchOrg = async params => { // 搜索客户或者供应商
  try {
    let response = await fetch.get('/management/org', { params })
    return response
  } catch (error) {
    console.log('error: ', error)
  }
}

export const clientOrgSearch = async body => { // 客户组织搜索接口
  try {
    let response = await fetch.post('/org/search/client', { body })
    return response
  } catch (error) {
    console.log('error: ', error)
  }
}

export const searchClientUser = async body => { // 销售搜索负责的客户中的用户
  try {
    let response = await fetch.post('/user/seller/search/client/user', { body })
    return response
  } catch (error) {
    console.log('error: ', error)
  }
}

export const creatOrg = async body => { // 创建组织
  try {
    let response = await fetch.post('/management/org', { body })
    return response
  } catch (error) {
    console.log('error: ', error)
  }
}

export const getDistrict = async params => { // 获取地址的json
  try {
    let response = await fetch.get('/logistics/district', { params })
    return response
  } catch (error) {
    console.log('error: ', error)
  }
}

export const getTag = async params => { // 根据category查询所有tag
  try {
    let response = await fetch.get('/tag/', { params })
    return response
  } catch (error) {
    console.log('error: ', error)
  }
}

export const getOrgMes = async params => { // 获取组织信息
  try {
    let response = await fetch.get(`/management/org/${params}`)
    return response
  } catch (error) {
    console.log('error: ', error)
  }
}

export const editOrgMes = async body => { // 修改组织信息
  try {
    let response = await fetch.patch(`/management/org/${body.id}`, {body})
    return response
  } catch (error) {
    console.log('error: ', error)
  }
}

export const getAccountNumber = async params => { // 获取组织下的账号
  try {
    let response = await fetch.get('/user/list', { params })
    return response
  } catch (error) {
    console.log('error: ', error)
  }
}

export const createUser = async body => { // 创建用户
  try {
    let response = await fetch.post('/user/list', { body })
    return response
  } catch (error) {
    console.log('error: ', error)
  }
}

export const editUser = async body => { // 修改。或删除用户
  try {
    let response = await fetch.patch(`/user/u/${body.id}`, {body})
    return response
  } catch (error) {
    console.log('error: ', error)
  }
}

export const delUser = async body => { // 修改。或删除用户
  try {
    let response = await fetch.delete(`/user/u/${body.id}`, {body})
    return response
  } catch (error) {
    console.log('error: ', error)
  }
}

export const getSales = async params => { // 获取对接销售
  try {
    let response = await fetch.get(`/management/client/seller`, {params})
    return response
  } catch (error) {
    console.log('error: ', error)
  }
}

export const setSales = async body => { // 设置对接销售
  try {
    let response = await fetch.post(`/management/client/seller`, {body})
    return response
  } catch (error) {
    console.log('error: ', error)
  }
}

export const getContact = async params => { // 获取联系人接口
  try {
    let response = await fetch.get(`/management/contact`, {params})
    return response
  } catch (error) {
    console.log('error: ', error)
  }
}

export const patchContact = async body => { // 联系人修改
  try {
    let response = await fetch.patch(`/management/contact`, {body})
    return response
  } catch (error) {
    console.log('error: ', error)
  }
}

export const postContact = async body => { // 创建联系人接口
  try {
    let response = await fetch.post(`/management/contact`, {body})
    return response
  } catch (error) {
    console.log('error: ', error)
  }
}

export const getGroupList = async () => {
  const response = await fetch.get('/org/fly/group')
  return response
}

export const getClients = (params) => async (dispatch, getState) => {
  try {
    let response = await fetch.get('/org/client', { params })
    return response
  } catch (error) {
    console.log('error：', error)
  }
}

export const getLabels = (params) => async (dispatch, getState) => {
  try {
    let response = await fetch.get('/org/label/client', { params })
    return response
  } catch (error) {
    console.log('error：', error)
  }
}
