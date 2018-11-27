import axios from 'axios';

/**
 * ACTION TYPES
 */
import { SET_SINGLE_RECIPE, DELETE_SINGLE_RECIPE } from './constants';

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
	recipe,
});
export const deleteRecipe = () => ({
	type: DELETE_SINGLE_RECIPE,
});

const getIngredients = (name, ingredients) => ({
	type: GET_RECIPE_INGREDIENTS,
	ingredients,
	name,
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
		default:
			return state;
	}
}
