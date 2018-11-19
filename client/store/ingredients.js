import axios from 'axios';

/**
 * ACTION TYPES
 */
import { SET_INGREDIENTS, CREATE_INGREDIENT } from './constants';

/**
 * INITIAL STATE
 */
const defaultIngredients = [];

/**
 * ACTION CREATORS
 */
const setIngredients = ingredients => ({
	type: SET_INGREDIENTS,
	ingredients,
});

const createIngredient = ingredient => ({
	type: CREATE_INGREDIENT,
	ingredient,
});
/**
 * THUNK CREATORS
 */
export const setIngredientsThunk = () => async dispatch => {
	try {
		const { data } = await axios.get('/api/ingredients/');
		dispatch(setIngredients(data));
	} catch (err) {
		console.error(err);
	}
};

export const createIngredientThunk = name => async dispatch => {
	try {
		const { data } = await axios.post('/api/ingredients/', { name });
		dispatch(createIngredient(name));
	} catch (err) {
		console.error(err);
	}
};
/**
 * REDUCER
 */

export default function(state = defaultIngredients, action) {
	switch (action.type) {
		case SET_INGREDIENTS:
			return action.ingredients;
		case CREATE_INGREDIENT:
			return [...state, action.ingredient];
		default:
			return state;
	}
}
