export const getCurrentAttriburteDetail = (data) => (dispatch, getState) => {
  dispatch({ type: 'ATTRIBUTE_DETAIL', detail: data })
}
