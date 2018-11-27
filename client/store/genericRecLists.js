import axios from 'axios';

/**
 * ACTION TYPES
 */
import {
  GET_ALL_RECIPES, 
  SEARCHED_RECIPES,
  SET_POPULAR_RECIPES,
  DELETE_POPULAR_RECIPES,
  SET_LIKED_RECIPES,
  DELETE_LIKED_RECIPES
} from './constants';

/**
 * INITIAL STATE
 */
const defaultRecipeList = { popular: [], pastLikes: [], allRecipes: [], searchRecipes: [] };

/**
 * ACTION CREATORS
 */
// POPULAR LIST
const setPopular = recipes => ({ type: SET_POPULAR_RECIPES, recipes });
export const deletePopular = () => ({ type: DELETE_POPULAR_RECIPES });
//search for specific recipes
const searchRecipes = recipes => ({type: SEARCHED_RECIPES, recipes})
const getAllRecipes = recipes => ({type: GET_ALL_RECIPES, recipes})

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
//search for recipe thunk
export const searchRecipesThunk = (query) => async dispatch => {
  try {
    const {data} = await axios.get(`/api/recipes?key=${query}`)
    // debugger;
    console.log('this is data', data);
    dispatch(searchRecipes(data))
  } catch (err) {
    console.error(err)
  }
}
//finish the story of getting all the recipes from the back.
export const getAllRecipesThunk = () => async dispatch => {
  try {
    const {data} = await axios.get('/api/recipes')
    dispatch(getAllRecipes(data))
  } catch (err) {
    console.error(err)
  }
}

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
    case SEARCHED_RECIPES: 
      return {...state, searchRecipes: action.recipes}
    case SET_LIKED_RECIPES:
      return { ...state, pastLikes: action.recipes };
    case DELETE_LIKED_RECIPES:
      return { ...state, pastLikes: [] };
    case GET_ALL_RECIPES: 
      return {...state, allRecipes: action.recipes}
    default:
      return state;
  }
}
