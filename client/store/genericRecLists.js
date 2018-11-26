import axios from 'axios';

/**
 * ACTION TYPES
 */
import { SET_POPULAR_RECIPES, DELETE_POPULAR_RECIPES, GET_ALL_RECIPES, SEARCHED_RECIPES } from './constants';

/**
 * INITIAL STATE
 */
const defaultRecipeList = { popular: [], allRecipes: [], searchRecipes: [] };

/**
 * ACTION CREATORS
 */
// POPULAR LIST
const setPopular = recipes => ({ type: SET_POPULAR_RECIPES, recipes });
export const deletePopular = () => ({ type: DELETE_POPULAR_RECIPES });
//search for specific recipes
const searchRecipes = recipes => ({type: SEARCHED_RECIPES, recipes})
const getAllRecipes = () => ({type: GET_ALL_RECIPES})
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
// export const getAllRecipes = () => async dispatch => {
//   try {
//     const {data} = await axios.get('/api/recipes')
//   } catch (err) {
//     console.error(err)
//   }
// }

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
    default:
      return state;
  }
}
