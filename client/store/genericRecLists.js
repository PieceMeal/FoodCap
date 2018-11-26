import axios from 'axios';

/**
 * ACTION TYPES
 */
import {
  SET_POPULAR_RECIPES,
  DELETE_POPULAR_RECIPES,
  SET_LIKED_RECIPES,
  DELETE_LIKED_RECIPES
} from './constants';

/**
 * INITIAL STATE
 */
const defaultRecipeList = { popular: [], pastLikes: [] };

/**
 * ACTION CREATORS
 */
// POPULAR LIST
const setPopular = recipes => ({ type: SET_POPULAR_RECIPES, recipes });
export const deletePopular = () => ({ type: DELETE_POPULAR_RECIPES });

// LIKED
const setLiked = recipes => ({ type: SET_LIKED_RECIPES, recipes });
export const deleteLiked = () => ({ type: DELETE_LIKED_RECIPES });
/**
 * THUNK CREATORS
 */

//POPULAR THUNKS
export const setPopularRecipesThunk = () => async dispatch => {
  try {
    const { data } = await axios.get('/api/recipes/popular');
    dispatch(setPopular(data));
  } catch (err) {
    console.error(err);
  }
};
// LIKED THUNK
export const setLikedRecipesThunk = () => async dispatch => {
  try {
    const { data } = await axios.get('/api/recipes/pastliked');
    dispatch(setLiked(data));
  } catch (err) {
    console.error(err);
  }
};
/**
 * REDUCER
 */
export default function(state = defaultRecipeList, action) {
  switch (action.type) {
    case SET_POPULAR_RECIPES:
      return { ...state, popular: action.recipes };
    case DELETE_POPULAR_RECIPES:
      return { ...state, popular: [] };
    case SET_LIKED_RECIPES:
      return { ...state, pastLikes: action.recipes };
    case DELETE_LIKED_RECIPES:
      return { ...state, pastLikes: [] };
    default:
      return state;
  }
}
