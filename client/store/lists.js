import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
import {SET_LISTS, CREATE_LIST, ADD_RECIPE_TO_LIST} from './constants'

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
const addRecipeToList = lists => ({
  type: ADD_RECIPE_TO_LIST,
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
export const createList = (listName) => async dispatch => {
  try {
    const {data} = await axios.post('/api/lists', {listName})

    dispatch(createLists(data.properties))
  } catch (err) {
    console.error(err)
  }
}
export const addRecipeToListThunk = (body) => async dispatch => {
  try {
    const {data} = await axios.put('/api/lists/addrecipe', body)
    debugger;
    dispatch(addRecipeToList(data))
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
    case CREATE_LIST: 
      return [...state, action.lists]
    case ADD_RECIPE_TO_LIST: 
      return [...state ]  
    default:
      return state
  }
}
