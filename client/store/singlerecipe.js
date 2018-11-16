import axios from 'axios';
import history from '../history';

/**
 * ACTION TYPES
 */
import { SET_SINGLE_RECIPE, DELETE_SINGLE_RECIPE } from './constants';

/**
 * INITIAL STATE
 */
const defaultSingleRecipe = {};

/**
 * ACTION CREATORS
 */
const setRecipe = recipe => ({
  type: SET_SINGLE_RECIPE,
  recipe
});
export const deleteRecipe = () => ({
  type: DELETE_SINGLE_RECIPE
});
/**
 * THUNK CREATORS
 */
export const setRecipeThunk = searchTerm => async dispatch => {
  try {
    const { data } = await axios.get(`/api/recipes/singleview/${searchTerm}`);

    dispatch(setRecipe(data));
  } catch (err) {
    console.error(err);
  }
};

/**
 * REDUCER
 */

export default function(state = defaultSingleRecipe, action) {
  switch (action.type) {
    case SET_SINGLE_RECIPE:
      return action.recipe;
    case DELETE_SINGLE_RECIPE:
      return defaultSingleRecipe;
    default:
      return state;
  }
}