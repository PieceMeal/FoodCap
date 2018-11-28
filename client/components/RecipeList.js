import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { fetchRecipes } from '../store/user';
import { setListsThunk, addRecipeToListThunk } from '../store/lists';
import {
  setLikedRecipesThunk,
  deleteLiked,
  deletePopular,
  setPopularRecipesThunk,
  getAllRecipesThunk,
  setBookmarkedRecipesThunk,
  setAlsoLikedThunk
} from '../store/genericRecLists';
import RecipeCard from './RecipeCard';

// STATE AND DISPATCH FOR RECOMMENDATIONS
const mapRecommendationsListToState = state => {
  return {
    user: state.user,
    recipes: state.user.recipes,
    lists: state.lists
  };
};
const dispatchRecommendationsListState = dispatch => ({
  fetchRecipes: () => dispatch(fetchRecipes()),
  setListsThunk: () => dispatch(setListsThunk()),
  addRecipeToListThunk: body => dispatch(addRecipeToListThunk(body))
});

// POPULAR STATE AND DISPATCH
const mapPopularToState = state => ({
  recipes: state.genericRecLists.popular,
  lists: state.lists
});
const mapPopularDispatch = dispatch => ({
  fetchRecipes: () => dispatch(setPopularRecipesThunk()),
  deleteRecipes: () => dispatch(deletePopular()),
  setListsThunk: () => dispatch(setListsThunk()),
  addRecipeToListThunk: body => dispatch(addRecipeToListThunk(body))
});
//ALL STATE AND DISPATCH
const mapAllToState = state => ({
  recipes: state.genericRecLists.allRecipes,
  lists: state.lists
})
const mapAllDispatch = dispatch => ({
  fetchRecipes: () => dispatch(getAllRecipesThunk()),
  setListsThunk: () => dispatch(setListsThunk())
})
// LIKED RECIPES LIST
const mapLikesToState = state => ({
  recipes: state.genericRecLists.pastLikes,
  lists: state.lists
});
const mapLikesDispatch = dispatch => ({
  fetchRecipes: () => dispatch(setLikedRecipesThunk()),
  deleteRecipes: () => dispatch(deleteLiked()),
  setListsThunk: () => dispatch(setListsThunk()),
  addRecipeToListThunk: body => dispatch(addRecipeToListThunk(body))
});
// BOOKMARKS
const mapBookmarksToState = state => ({
  recipes: state.genericRecLists.bookmarks,
  lists: state.lists
});
const mapBookmarksToDispatch = dispatch => ({
  fetchRecipes: () => dispatch(setBookmarkedRecipesThunk()),
  setListsThunk: () => dispatch(setListsThunk()),
  addRecipeToListThunk: body => dispatch(addRecipeToListThunk(body))
});
//USERS ALSO LIKED
const mapAlsoLikedToState = state => ({
  lists: state.lists,
  recipes: state.genericRecLists.alsoLiked,
  singleRecipe: state.singleRecipe
});
const mapAlsoLikedToDispatch = dispatch => ({
  setListsThunk: () => dispatch(setListsThunk()),
  addRecipeToListThunk: body => dispatch(addRecipeToListThunk(body)),
  fetchRecipesWithName: recipeName => dispatch(setAlsoLikedThunk(recipeName))
});
class RecipeList extends Component {
  state = {
    listName: '',
    checked: {},
    recipes: []
  };
  componentDidMount() {
    
    if (this.props.fetchRecipesWithName) {
      this.props.fetchRecipesWithName(this.props.recipeName);
    } else {
      this.props.fetchRecipes();
    }
    if(this.props.lists){
    if (this.props.lists.length < 1) {
      this.props.setListsThunk();
    }
  }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.recipeName !== this.props.recipeName) {
      this.props.fetchRecipesWithName(this.props.recipeName);
    }
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.createList(this.state.listName);
    this.setState({
      listName: ''
    });
  };

  handleChangeList = (e, { value, name }) => {
    this.setState(prevState => {
      return { checked: { ...prevState.checked, [name]: value } };
    });
  };
  handleSubmitList = e => {
    e.preventDefault();
    let recipe = Object.keys(this.state.checked).toString();
    let uuid = this.state.checked[recipe];
    let body = { uuid, recipe };
    //dispatch thank for sending list info, recipe info
    this.props.addRecipeToListThunk(body);
    this.setState({ [recipe]: false, checked: {} });
  };
  handleOpen = name => {
    this.setState({ [name]: true });
  };
  handleClose = name => {
    this.setState({ [name]: false });
  };
  render() {
    const disableSubmitButton = Object.keys(this.state.checked).length;
    if (this.props.recipes) {
      return (
        <div
          style={{
            marginTop: '5vh',
            marginLeft: '10vw',
            marginRight: '10vw',
            marginBottom: '40px'
          }}
        >
          <Grid columns={4} centered>
            <Grid.Row stretched>
              {this.props.recipes.map((rec, id) => {
                return (
                  <Grid.Column key={id}>
                    <RecipeCard
                      recipe={rec}
                      lists={this.props.lists}
                      open={this.state[rec.name]}
                      handleOpen={this.handleOpen}
                      handleClose={this.handleClose}
                      handleSubmitList={this.handleSubmitList}
                      handleChangeList={this.handleChangeList}
                      checked={this.state.checked[rec.name]}
                      disableSubmitButton={disableSubmitButton}
                    />
                  </Grid.Column>
                );
              })}
            </Grid.Row>
          </Grid>
        </div>
      );
    } else {
      return <h1>LOADING!</h1>;
    }
  }
}

export const RecommendationsList = connect(
  mapRecommendationsListToState,
  dispatchRecommendationsListState
)(RecipeList);

export const PopularList = connect(mapPopularToState, mapPopularDispatch)(
  RecipeList
);

export const LikedList = connect(mapLikesToState, mapLikesDispatch)(RecipeList);
export const AllRecipes = connect(mapAllToState, mapAllDispatch)(RecipeList)

export const BookmarkedList = connect(
  mapBookmarksToState,
  mapBookmarksToDispatch
)(RecipeList);

export const AlsoLikedList = connect(
  mapAlsoLikedToState,
  mapAlsoLikedToDispatch
)(RecipeList);
