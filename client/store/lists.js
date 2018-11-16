import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
import {SET_LISTS, CREATE_LIST} from './constants'

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
const createLists = lists => ({
  type: CREATE_LIST,
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
export const createList = (listName) => async dispatch => {
  try {
    const {data} = await axios.post('/api/lists', {listName})
    dispatch(createLists(data))
  } catch (err) {
    console.error(err)
  }
}
export default function(state = defaultLists, action) {
  switch (action.type) {
    case SET_LISTS:
      return action.lists
      case CREATE_LIST: 
      return {...state, ...action.lists}      
    default:
      return state
  }
}
