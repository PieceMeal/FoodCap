import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Segment, Divider, Button, Message, Icon } from 'semantic-ui-react';
import {
  setRecipeThunk,
  deleteRecipe,
  toggleLikeThunk,
  toggleBookmarkThunk
} from '../store/singlerecipe';
import Navbar from './navbar';
import { AlsoLikedList } from './RecipeList';
const mapStateToProps = state => {
  return {
    recipe: state.singlerecipe,
    alsoLiked: state.genericRecLists.alsoLiked,
    name: state.singlerecipe.name
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setRecipe: searchTerm => dispatch(setRecipeThunk(searchTerm)),
    deleteStore: () => dispatch(deleteRecipe()),
    toggleLike: name => dispatch(toggleLikeThunk(name)),
    toggleBookmark: name => dispatch(toggleBookmarkThunk(name))
  };
};

const style = {
  wholeTray: {
    backgroundColor: '#D3D3D3',
    marginTop: '5vh',
    marginLeft: '10vw',
    marginRight: '10vw',
    marginBottom: '4vw',
    padding: '20px',

    border: '2px solid black',
    borderRadius: '15px',
    textAlign: 'center'
  },
  ingredientContainer: { paddingLeft: '60px', paddingRight: '80px' },
  buttonMargin: { marginTop: '30px' }
};
class SingleRecipe extends Component {
  async componentDidMount() {
    await this.props.setRecipe(this.props.match.params.recipename);
  }
  async componentDidUpdate(prevProps) {
    if (
      prevProps.match.params.recipename !== this.props.match.params.recipename
    ) {
      await this.props.setRecipe(this.props.match.params.recipename);
      window.scrollTo(0, 0);
    }
  }
  componentWillUnmount() {
    this.props.deleteStore();
  }

  handleAddLike = () => {
    this.props.toggleLike(this.props.recipe.name);
  };

  handleBookmark = () => {
    this.props.toggleBookmark(this.props.recipe.name);
  };

  render() {
    const { recipe } = this.props;
    if (recipe.name) {
      return (
        <React.Fragment>
          <Divider horizontal>
            <h3>{recipe.name}</h3>
          </Divider>
            <img
              src={recipe.image}
              style={{
                display: 'block',
                margin: 'auto',
                width: '50%',
                maxHeight: '550px',
                minHeight: '375px',
                marginTop: '30px',
                border: '13px solid black',
                padding: '7px',
                backgroundColor: 'white'
              }}
              alt="/logo.png"
            />
            <div
              style={{
                textAlign: 'left',
                border: '3px solid black',
                borderRadius: '10px'
              }}
              className="ui horizontal segments"
            >
              <div
                style={{ paddingBottom: '30px', fontSize: '1.25rem' }}
                className="ui container"
              >
                <Segment>
                  &emsp;&emsp;&emsp;Preparation Time:&emsp;
                  {recipe.time} min
                </Segment>

                <div
                  style={style.ingredientContainer}
                  role="list"
                  className="ui bulleted list"
                >
                  <Divider horizontal>
                    <h3>Ingredients</h3>
                  </Divider>
                  {Object.keys(recipe.ingredients).map(ingredient => {
                    return (
                      <div role="listitem" className="item" key={ingredient}>
                        {recipe.ingredients[ingredient].quantity}
                        &emsp;
                        {recipe.ingredients[ingredient].type ? (
                          <span>{recipe.ingredients[ingredient].type} </span>
                        ) : null}
                        {recipe.ingredients[ingredient].name}
                      </div>
                    );
                  })}
                </div>
                <div
                  role="list"
                  className="ui list"
                  style={style.ingredientContainer}
                >
                  <Divider horizontal>
                    <h3>Preparation:</h3>
                  </Divider>
                  {recipe.instructions.map((step, i) => {
                    return (
                      <li
                        role="listitem"
                        className="item"
                        key={i}
                        style={{ lineHeight: '1.5' }}
                      >
                        <b>{i + 1}:</b>&emsp;{step}
                      </li>
                    );
                  })}
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignContent: 'space-between',
                  width: '175px'
                }}
                className="ui grey inverted segment"
              >
                <Button type="button" style={style.buttonMargin}>
                  Add to List
                </Button>

                <Button
                  className={
                    recipe.hasBookmark ? 'ui yellow button' : 'ui button'
                  }
                  type="button"
                  style={style.buttonMargin}
                  onClick={this.handleBookmark}
                >
                  {recipe.hasBookmark ? 'Bookmarked' : 'Bookmark'}
                </Button>
                <div
                  className={recipe.hasLike ? 'ui green button' : 'ui button'}
                  style={style.buttonMargin}
                  onClick={this.handleAddLike}
                >
                  <i className="heart icon" />{' '}
                  {recipe.hasLike ? 'Liked' : 'Like'}
                </div>
              </div>
            </div>
          <Divider horizontal>
            <h3>Users Who Liked This Also Liked:</h3>
          </Divider>
          {this.props.name ? (
            <AlsoLikedList recipeName={this.props.name} />
          ) : null}
        </React.Fragment>
      );
    } else {
      return   ( <Message icon>
      <Icon name='circle notched' loading />
       <Message.Content>
         <Message.Header>Just one second</Message.Header>
         We are fetching that content for you.
      </Message.Content>
    </Message>
      )
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SingleRecipe);
