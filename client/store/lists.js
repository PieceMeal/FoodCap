import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
import {SET_LISTS} from './constants'

/**
 * INITIAL STATE
 */
const defaultLists = []

/**
 * ACTION CREATORS
 */
const setLists = lists => ({
  type: SET_LISTS,
  lists
})
/**
 * THUNK CREATORS
 */
export const setListsThunk = () => async dispatch => {
  try {
    const {data} = await axios.get('/api/lists/')
    console.log('in thunk')
    console.log(data)
    dispatch(setLists(data))
  } catch (err) {
    console.error(err)
  }
}
/**
 * REDUCER
 */

export default function(state = defaultLists, action) {
  switch (action.type) {
    case SET_LISTS:
      return action.lists
    default:
      return state
  }
}
