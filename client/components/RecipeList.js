import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  Image,
  Button,
  Popup,
  Form,
  Checkbox
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import { fetchRecipes } from '../store/user';
import { setListsThunk, addRecipeToListThunk } from '../store/lists';
import {
  setLikedRecipesThunk,
  deleteLiked,
  deletePopular,
  setPopularRecipesThunk,
  setBookmarkedRecipesThunk
} from '../store/genericRecLists';

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
class RecipeList extends Component {
  state = {
    listName: '',
    checked: {}
  };
  componentDidMount() {
    this.props.fetchRecipes();
    if (this.props.lists.length < 1) {
      console.log('running thunk');
      this.props.setListsThunk();
    }
  }
  handleSubmit = e => {
    //have a thunk in lists.js that will take this action and dispatch post request for list api
    //clear the state after submit so input is empty
    e.preventDefault();

    this.props.createList(this.state.listName);
    this.setState({
      listName: ''
    });
  };

  handleChangeList = (e, { value, name }) => {
    //have a thunk that sends information about the list and information about
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
            // backgroundColor: '#ffffe5',

            marginTop: '5vh',
            marginLeft: '10vw',
            marginRight: '10vw',
            marginBottom: '40px'
            // padding: '20px'

            // border: '2px solid black'
            // borderRadius: '5px'
          }}
        >
          <Grid columns={4} centered>
            <Grid.Row stretched>
              {this.props.recipes.map((rec, id) => {
                return (
                  <Grid.Column key={id}>
                    <Card
                      style={{
                        marginTop: '20px',
                        padding: '8px',
                        border: '1px solid black'
                      }}
                    >
                      <Link to={`/recipes/singleview/${rec.name}`}>
                        <Image
                          src={rec.image}
                          style={{ height: '150px', width: '100%' }}
                        />
                      </Link>
                      <Card.Content>
                        <Card.Header>{rec.name}</Card.Header>
                        <Container textAlign="right">
                          {this.props.lists ? (
                            <Popup
                              on="click"
                              open={this.state[rec.name]}
                              onOpen={() => this.handleOpen(rec.name)}
                              onClose={() => this.handleClose(rec.name)}
                              trigger={<Button icon="add" />}
                              content={
                                <Form onSubmit={this.handleSubmitList}>
                                  {this.props.lists.map(list => {
                                    return (
                                      <Form.Field key={list.uuid}>
                                        <Checkbox
                                          name={rec.name}
                                          value={list.uuid}
                                          label={list.name}
                                          onChange={this.handleChangeList}
                                          checked={
                                            list.uuid ===
                                            this.state.checked[rec.name]
                                          }
                                        />
                                      </Form.Field>
                                    );
                                  })}

                                  <Button
                                    disabled={!disableSubmitButton}
                                    type="submit"
                                  >
                                    Submit
                                  </Button>
                                </Form>
                              }
                              on="click"
                            />
                          ) : (
                            <Button icon="x" />
                          )}
                        </Container>
                        <Card.Meta>Time: {rec.time}</Card.Meta>
                      </Card.Content>
                    </Card>
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

export const BookmarkedList = connect(
  mapBookmarksToState,
  mapBookmarksToDispatch
)(RecipeList);
