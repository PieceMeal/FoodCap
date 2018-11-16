import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Segment, Divider, Button } from 'semantic-ui-react';
import { setRecipeThunk, deleteRecipe } from '../store/singlerecipe';

const mapStateToProps = state => {
  return {
    recipe: state.singlerecipe
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setRecipe: searchTerm => dispatch(setRecipeThunk(searchTerm)),
    deleteStore: () => dispatch(deleteRecipe())
  };
};

const style = {
  wholeTray: {
    backgroundColor: '#A9A9A9',
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

  render() {
    const { recipe } = this.props;
    if (recipe.name) {
      return (
        <div style={style.wholeTray}>
          <Segment
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'center'
            }}
          >
            <h2>
              <b>{recipe.name}</b>
            </h2>
          </Segment>
          <img src={recipe.image} alt="no image" />
          <div style={{ textAlign: 'left' }} className="ui horizontal segments">
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
                      {recipe.ingredients[ingredient].type}&emsp;
                      {recipe.ingredients[ingredient].name}
                    </div>
                  );
                })}
                <Divider />
              </div>
              <div
                role="list"
                className="ui ordered list"
                style={style.ingredientContainer}
              >
                <h2>
                  <b>PREPARATION</b>
                </h2>
                {recipe.instructions.map((step, i) => {
                  return (
                    <li role="listitem" className="item" key={i}>
                      {step}
                    </li>
                  );
                })}
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignContent: 'space-between'
              }}
              className="ui grey inverted segment"
            >
              <Button type="button" style={style.buttonMargin}>
                Add to List
              </Button>
              <Button type="button" style={style.buttonMargin}>
                Bookmark
              </Button>
              <div className="ui button" style={style.buttonMargin}>
                <i className="heart icon" /> Like
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return <h1>LOADING!!! WAIT!</h1>;
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SingleRecipe);
