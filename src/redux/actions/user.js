import fetch from 'api/utils'

export const sendVerify = (data) => async (dispatch, getState) => {
  try {
    let response = await fetch.post('/user/sms_verify_code', {
      headers: { 'Content-Type': 'application/json'
    }, body: data })
    return response
  } catch (error) {
    console.log('error: ', error)
  }
}

export const login = (data) => async (dispatch, getState) => {
  try {
    let response = await fetch.post('/user/login', {
      headers: { 'Content-Type': 'application/json'
    }, body: data })
    if (response) dispatch({ type: 'LOGIN_SUCCESS', user: response.data })
    return response
  } catch (error) {
    console.log('error: ', error)
  }
}

export const getUserList = async (body) => {
  const response = await fetch.post('/user/search', { body })
  return response
}

export const getRoleList = () => async (dispatch, getState) => {
  const response = await fetch.get('/user/role/list')
  if (response) dispatch({ type: 'ROLE_LIST', role: response.data })
  return response
}

export const getResourceList = async () => {
  const response = await fetch.get('/user/resource/list')
  return response
}

export const getUserInfo = async (id) => {
  const response = await fetch.get(`/user/u/${id}`)
  return response
}

export const getLogs = async (params) => {
  const response = await fetch.get('/user/log/access', { params })
  return response
}

export const userEdit = async (body, id) => {
  const response = await fetch.patch(`/user/u/${id}`, { body })
  return response
}

export const deleteUser = async (id) => {
  const response = await fetch.delete(`/user/u/${id}`)
  return response
}

export const createUser = async (body) => {
  const response = await fetch.post('/user/list', { body })
  return response
}
