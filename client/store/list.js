import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
import {SET_LIST, INCREMENT_LIST} from './constants'

/**
 * INITIAL STATE
 */
const defaultList = {}

/**
 * ACTION CREATORS
 */
const setList = list => ({
  type: SET_LIST,
  list
})
/**
 * THUNK CREATORS
 */
export const setListThunk = (id) => async dispatch => {
  try {
    const {data} = await axios.get(`/api/lists/${id}`)
    dispatch(setList(data))
  } catch (err) {
    console.error(err)
  }
}
/**
 * REDUCER
 */

export default function(state = defaultList, action) {
  switch (action.type) {
    case SET_LIST:
      return action.list
    default:
      return state
  }
}
