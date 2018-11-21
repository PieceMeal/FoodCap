import axios from 'axios';
import history from '../history';

/**
 * ACTION TYPES
 */
import {
  SET_LISTS,
  CREATE_LIST,
  ADD_RECIPE_TO_LIST,
  DELETE_LIST
} from './constants';

/**
 * INITIAL STATE
 */
const defaultLists = [];

/**
 * ACTION CREATORS
 */
const setLists = lists => ({
  type: SET_LISTS,
  lists
});
const createLists = lists => ({
  type: CREATE_LIST,
  lists
});
const addRecipeToList = () => ({
  type: ADD_RECIPE_TO_LIST
});
const deleteList = () => ({
  type: DELETE_LIST
});
/**
 * THUNK CREATORS
 */
export const setListsThunk = () => async dispatch => {
  try {
    const { data } = await axios.get('/api/lists/');
    dispatch(setLists(data));
  } catch (err) {
    console.error(err);
  }
};
export const createList = listName => async dispatch => {
  try {
    const { data } = await axios.post('/api/lists', { listName });
    console.log('this is my data from createList in lists.js', data);
    dispatch(createLists(data));
  } catch (err) {
    console.error(err);
  }
};
export const addRecipeToListThunk = body => async dispatch => {
  try {
    const { data } = await axios.put('/api/lists/addrecipe', body);
    //do we need to change anything in our `allListView`?
    //the data we are getting back from the express is
    //an array of objects representing the ingredients
    //we just want to create connection between the list and the recipe
    //which will show list of ingredients on the single view list

    dispatch(addRecipeToList());
  } catch (err) {
    console.error(err);
  }
};
export const deleteListThunk = uuid => async dispatch => {
  try {
    const { data } = await axios.delete(`/api/lists`, { data: { uuid } });
    dispatch(setLists(data));
  } catch (err) {
    console.error(err);
  }
};
/**
 * REDUCER
 */

export default function(state = defaultLists, action) {
  switch (action.type) {
    case SET_LISTS:
      return action.lists;
    case CREATE_LIST:
      return [...state, action.lists];
    case ADD_RECIPE_TO_LIST:
      return [...state];
    default:
      return state;
  }
}
