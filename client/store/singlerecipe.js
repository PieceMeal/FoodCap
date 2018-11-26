import axios from 'axios';

/**
 * ACTION TYPES
 */
import {
  SET_SINGLE_RECIPE,
  DELETE_SINGLE_RECIPE,
  TOGGLE_LIKE,
  TOGGLE_BOOKMARK
} from './constants';

const GET_RECIPE_INGREDIENTS = 'GET_RECIPE_INGREDIENTS';
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
const toggleBookmark = () => ({
  type: TOGGLE_BOOKMARK
});
export const deleteRecipe = () => ({
  type: DELETE_SINGLE_RECIPE
});
const toggleLike = () => ({
  type: TOGGLE_LIKE
});

const getIngredients = (name, ingredients) => ({
  type: GET_RECIPE_INGREDIENTS,
  ingredients,
  name
});

/**
 * THUNK CREATORS
 */
export const getIngredientsThunk = name => async dispatch => {
  try {
    const { data } = await axios.get(`/api/recipes/ingredients/${name}`);
    console.log(data);
    dispatch(getIngredients(name, data));
  } catch (err) {
    console.error(err);
  }
};
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
    case GET_RECIPE_INGREDIENTS: {
      const { name, ingredients } = action;
      return { name, ingredients };
    }
    case TOGGLE_LIKE:
      return { ...state, hasLike: !state.hasLike };
    case TOGGLE_BOOKMARK:
      return { ...state, hasBookmark: !state.hasBookmark };
    default:
      return state;
  }
}
