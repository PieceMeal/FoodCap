import axios from 'axios';
import history from '../history';

/**
 * ACTION TYPES
 */
import {
  SET_LIST,
  INCREMENT_LIST,
  DELETE_LIST,
  REMOVE_LIST_ITEM,
  ADD_LIST_ITEM
} from './constants';

/**
 * INITIAL STATE
 */
const defaultList = { uuid: null, ingredients: [] };

/**
 * ACTION CREATORS
 */
const setList = list => ({
  type: SET_LIST,
  list
});
const addListItem = ingredientObj => ({
  type: ADD_LIST_ITEM,
  ingredientObj
});
const deleteSingleItem = name => ({
  type: REMOVE_LIST_ITEM,
  name
});
const deleteList = () => ({
  type: DELETE_LIST
});

/**
 * THUNK CREATORS
 */
export const setListThunk = id => async dispatch => {
  try {
    const { data } = await axios.get(`/api/lists/${id}`);
    dispatch(setList(data));
  } catch (err) {
    console.error(err);
  }
};

export const addListItemThunk = ingredientObj => async dispatch => {
  try {
    const { data } = await axios.put('/api/lists/addingredient', ingredientObj);
    dispatch(addListItem(data));
  } catch (err) {
    console.error(err);
  }
};

export const deleteSingleItemThunk = name => async dispatch => {
  try {
    await axios.delete(`/api/lists/deleteIngredient/${name}`);
    dispatch(deleteSingleItem(name));
  } catch (err) {
    console.error(err);
  }
};

export const deleteListThunk = uuid => async dispatch => {
  try {
    await axios.delete(`/api/lists/${uuid}`);
    dispatch(deleteList());
  } catch (err) {
    console.error(err);
  }
};

/**
 * REDUCER
 */

export default function(state = defaultList, action) {
  switch (action.type) {
    case SET_LIST:
      return action.list;
    case ADD_LIST_ITEM:
      return {
        ...state,
        ingredients: [...state.ingredients, action.ingredientObj]
      };
    case REMOVE_LIST_ITEM:
      return {
        ...state,
        ingredients: state.ingredients.filter(
          ingredient => ingredient.name !== action.name
        )
      };

    case DELETE_LIST:
      return defaultList;
    default:
      return state;
  }
}
