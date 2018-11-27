import axios from 'axios';

/**
 * ACTION TYPES
 */
import {
  SET_POPULAR_RECIPES,
  DELETE_POPULAR_RECIPES,
  SET_LIKED_RECIPES,
  DELETE_LIKED_RECIPES,
  SET_BOOKMARKED_RECIPES,
  SET_ALSO_LIKED_RECIPES
} from './constants';

/**
 * INITIAL STATE
 */
const defaultRecipeList = {
  popular: [],
  pastLikes: [],
  bookmarks: [],
  alsoLiked: []
};

/**
 * ACTION CREATORS
 */
// POPULAR LIST
const setPopular = recipes => ({ type: SET_POPULAR_RECIPES, recipes });
export const deletePopular = () => ({ type: DELETE_POPULAR_RECIPES });

// LIKED
const setLiked = recipes => ({ type: SET_LIKED_RECIPES, recipes });
export const deleteLiked = () => ({ type: DELETE_LIKED_RECIPES });

//BOOKMARKS
const setBookmarks = recipes => ({ type: SET_BOOKMARKED_RECIPES, recipes });

//ALSO LIKED
const alsoLiked = recipes => ({ type: SET_ALSO_LIKED_RECIPES, recipes });
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
// BOOKMARK THUNK
export const setBookmarkedRecipesThunk = () => async dispatch => {
  try {
    const { data } = await axios.get('/api/recipes/bookmarks');
    dispatch(setBookmarks(data));
  } catch (err) {
    console.error(err);
  }
};

// ALSO LIKED THUNK
export const setAlsoLikedThunk = recipeName => async dispatch => {
  try {
    const { data } = await axios.get(`/api/recipes/alsoliked/${recipeName}`);
    dispatch(alsoLiked(data));
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
    case SET_BOOKMARKED_RECIPES:
      return { ...state, bookmarks: action.recipes };
    case SET_ALSO_LIKED_RECIPES:
      return { ...state, alsoLiked: action.recipes };
    default:
      return state;
  }
}
