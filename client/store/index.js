import { createStore, combineReducers, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import user from './user';
import list from './list';
import lists from './lists';
import ingredients from './ingredients';
import singlerecipe from './singlerecipe';
import genericRecLists from './genericRecLists';
const reducer = combineReducers({
  user,
  list,
  lists,
  singlerecipe,
  ingredients,
  genericRecLists
});
const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({ collapsed: true }))
);
const store = createStore(reducer, middleware);

export default store;
export * from './user';
