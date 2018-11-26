import axios from 'axios';
import history from '../history';

/**
 * ACTION TYPES
 */
import {
  SET_SINGLE_RECIPE,
  DELETE_SINGLE_RECIPE,
  TOGGLE_LIKE,
  TOGGLE_BOOKMARK
} from './constants';

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
const toggleLike = () => ({
  type: TOGGLE_LIKE
});
const toggleBookmark = () => ({
  type: TOGGLE_BOOKMARK
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

export const toggleLikeThunk = recipeName => async dispatch => {
  try {
    const putObj = { recipeName };
    await axios.put('/api/recipes/togglelike', putObj);
    dispatch(toggleLike());
  } catch (err) {
    console.error(err);
  }
};

export const toggleBookmarkThunk = recipeName => async dispatch => {
  try {
    const putObj = { recipeName };
    await axios.put('/api/recipes/togglebookmark', putObj);
    dispatch(toggleBookmark());
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
    case TOGGLE_LIKE:
      return { ...state, hasLike: !state.hasLike };
    case TOGGLE_BOOKMARK:
      return { ...state, hasBookmark: !state.hasBookmark };
    default:
      return state;
  }
}
