import axios from 'axios';
import history from '../history';

/**
 * ACTION TYPES
 */
import { SET_LIST, LIST_REMOVE_ITEM, LIST_UPDATE_ITEMS } from './constants';

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
			return newList;
			//NEED TO make this accurate
		}
		default:
			return state;
	}
}
