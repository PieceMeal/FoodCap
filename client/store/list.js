import axios from 'axios';
import history from '../history';

/**
 * ACTION TYPES
 */
import {
  LIST_SET,
  LIST_INCREMENT,
  LIST_DELETE,
  LIST_REMOVE_ITEM,
  LIST_ADD_ITEM
} from './constants';

/**
 * INITIAL STATE
 */
const defaultList = { uuid: null, ingredients: [] };

/**
 * ACTION CREATORS
 */
const setList = list => ({
  type: LIST_SET,
  list
});
const addListItem = ingredientObj => ({
  type: LIST_ADD_ITEM,
  ingredientObj
});
const deleteSingleItem = name => ({
  type: LIST_REMOVE_ITEM,
  name
});
const deleteList = () => ({
  type: LIST_DELETE
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
    case LIST_SET:
      return action.list;
    case LIST_ADD_ITEM:
      return {
        ...state,
        ingredients: [...state.ingredients, action.ingredientObj]
      };
    case LIST_REMOVE_ITEM:
      return {
        ...state,
        ingredients: state.ingredients.filter(
          ingredient => ingredient.name !== action.name
        )
      };

    case LIST_DELETE:
      return defaultList;
    default:
      return state;
  }
}
