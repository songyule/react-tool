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

export const getRoleList = async () => {
  const response = await fetch.get('/user/role/list')
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
