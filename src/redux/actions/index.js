import * as constants from 'constants'

export const add = (number) => ({
  type: constants.ADD_NUMBER,
  number
})
