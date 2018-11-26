import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Segment, Divider, Button } from 'semantic-ui-react';
import {
  setRecipeThunk,
  deleteRecipe,
  toggleLikeThunk,
  toggleBookmarkThunk
} from '../store/singlerecipe';
import Navbar from './navbar';
const mapStateToProps = state => {
  return {
    recipe: state.singlerecipe
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
    backgroundColor: '#E6E6FA',
    marginTop: '5vh',
    marginLeft: '10vw',
    marginRight: '10vw',
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
          <Navbar />
          <div style={style.wholeTray}>
            <Segment
              style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'center',
                border: '1px solid black'
              }}
            >
              <h2>
                <b>{recipe.name}</b>
              </h2>
            </Segment>
            <img
              src={recipe.image}
              style={{
                maxHeight: '550px',
                minHeight: '375px',
                marginTop: '30px',
                border: '13px solid #3e2b14',
                padding: '7px',
                backgroundColor: 'white'
              }}
              alt="no image"
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
                  <h2>
                    <b>INGREDIENTS</b>
                  </h2>
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
                  <Divider />
                </div>
                <div
                  role="list"
                  className="ui list"
                  style={style.ingredientContainer}
                >
                  <h2>
                    <b>PREPARATION</b>
                  </h2>
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
          </div>
        </React.Fragment>
      );
    } else {
      return <h1>LOADING!!! WAIT!</h1>;
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SingleRecipe);
