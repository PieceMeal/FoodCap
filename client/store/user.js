import axios from 'axios';
import history from '../history';

/**
 * ACTION TYPES
 */
const GET_USER = 'GET_USER';
const REMOVE_USER = 'REMOVE_USER';
const UPDATE_USER = 'UPDATE_USER';
const GET_RECIPES = 'GET_RECIPES';
/**
 * INITIAL STATE
 */
const defaultUser = {};

/**
 * ACTION CREATORS
 */
const getUser = user => ({ type: GET_USER, user });
const removeUser = () => ({ type: REMOVE_USER });
const updateUser = user => ({
  type: UPDATE_USER,
  user
});
const getRecipes = recipes => ({
  type: GET_RECIPES,
  recipes
});

/**
 * THUNK CREATORS
 */
export const me = () => async dispatch => {
  try {
    const res = await axios.get('/auth/me');
    dispatch(getUser(res.data || defaultUser));
  } catch (err) {
    console.error(err);
  }
};

export const auth = (email, password, method) => async dispatch => {
  let res;
  try {
    res = await axios.post(`/auth/${method}`, { email, password });
  } catch (authError) {
    return dispatch(getUser({ error: authError }));
  }
  try {
    if (res.data.user) {
      let user = res.data.user;
      user['recipes'] = res.data.recipes;
      dispatch(getUser(user));
      console.log('DATAAA', res.data);
    } else {
      dispatch(getUser(res.data));
    }
    if (method === 'signup') {
      history.push('/home/preferences');
    } else if (!res.data.user.formFilled) {
      history.push('/home/preferences');
    } else {
      history.push('/home');
    }
  } catch (dispatchOrHistoryErr) {
    console.error(dispatchOrHistoryErr);
  }
};

export const logout = () => async dispatch => {
  try {
    await axios.post('/auth/logout');
    dispatch(removeUser());
    history.push('/login');
  } catch (err) {
    console.error(err);
  }
};

export const setPreference = (preferencesObj, userId) => async dispatch => {
  try {
    const { data } = await axios.put(`/api/users/${userId}`, preferencesObj);
    dispatch(getUser(data.user));
  } catch (err) {
    console.error(err);
  }
};
export const fetchRecipes = () => async dispatch => {
  //we need to create fetchRecipe thunk that is going to get our recipes on componentDidMount
  //or on componentDidUpdate because now after refreshing the page they are gone.

  try {
    const { data } = await axios.get(`/api/users/userrec`);
    dispatch(getRecipes(data));
  } catch (err) {
    console.error(err);
  }
};
/**
 * REDUCER
 */
export default function(state = defaultUser, action) {
  switch (action.type) {
    case GET_USER:
      return action.user;
    case REMOVE_USER:
      return defaultUser;
    case UPDATE_USER:
      return { ...state, formFilled: action.user.formFilled };
    case GET_RECIPES:
      return { ...state, recipes: action.recipes };
    default:
      return state;
  }
}
