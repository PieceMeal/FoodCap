import axios from 'axios';
import history from '../history';

/**
 * ACTION TYPES
 */
import { SET_LIST, LIST_REMOVE_ITEM, LIST_UPDATE_ITEMS } from './constants';

const ADD_ITEM_TO_LIST = 'ADD_ITEM_TO_LIST';
/**
 * INITIAL STATE
 */
const defaultList = {};

/**
 * ACTION CREATORS
 */
const setList = list => ({
	type: SET_LIST,
	list,
});

const removeListItem = ingredient => ({
	type: LIST_REMOVE_ITEM,
	ingredient,
});

const updateListItems = updatedItems => ({
	type: LIST_UPDATE_ITEMS,
	updatedItems,
});

const addItemToList = (uuid, ingredient, quantity, type) => ({
	type: ADD_ITEM_TO_LIST,
	uuid,
	ingredient,
	quantity,
	ingredientType: type,
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

export const removeListItemThunk = (uuid, ingredient) => async dispatch => {
	try {
		const { data } = await axios.put('/api/lists/removeingredient', {
			uuid,
			ingredient,
		});
		dispatch(removeListItem(ingredient));
	} catch (err) {
		console.error(err);
	}
};

export const updateListQuantityThunk = (
	uuid,
	updatedItems
) => async dispatch => {
	try {
		updatedItems.forEach(async update => {
			console.log('attempt ', update);
			await axios.put('/api/lists/updateingredient', {
				uuid,
				ingredient: update.name,
				quantity: update.quantity,
				type: update.type,
			});
		});
		dispatch(updateListItems(updatedItems));
	} catch (err) {
		console.error(err);
	}
};

export const addItemToListThunk = (
	uuid,
	ingredient,
	quantity,
	type
) => async dispatch => {
	try {
		await axios.put('/api/lists/addingredient', {
			uuid,
			ingredient,
			quantity,
			type,
		});
		dispatch(addItemToList(uuid, ingredient, quantity, type));
	} catch (err) {
		console.error(err);
	}
};
/**
 * REDUCER
 */

export default function(state = defaultList, action) {
	switch (action.type) {
		case SET_LIST:
			return action.list;
		case LIST_REMOVE_ITEM: {
			const newList = { ...state };
			newList.ingredients = newList.ingredients.filter(
				ingredient => ingredient.name !== action.ingredient
			);
			return newList;
		}
		case LIST_UPDATE_ITEMS: {
			const newList = { ...state };
			console.log(newList);

			// newList.ingredients = [...newList.ingredients, ...action.updatedItems];
			action.updatedItems.forEach(update => {
				newList.ingredients[
					newList.ingredients.findIndex(x => x.name === update.name)
				] = update;
			});
			console.log(newList);
			return newList;
			//NEED TO make this accurate
		}
		case ADD_ITEM_TO_LIST: {
			const { ingredient, quantity, ingredientType } = action;
			const newItem = { name: ingredient, quantity, type: ingredientType };
			console.log(newItem);
			const newState = { ...state };
			const ingredients = [...newState.ingredients, newItem];
			return { ...newState, ingredients };
		}
		default:
			return state;
	}
}
