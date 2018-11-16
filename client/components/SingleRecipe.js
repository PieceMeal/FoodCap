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

const data = {
  '15 minute pasta': {
    ingredients: {
      flour: { quantity: 1, type: 'cup' },
      'olive oil': { quantity: 8, type: 'tbsp' },
      'penne pasta': { quantity: 1, type: 'package' },
      'Parma ham': { quantity: 2, type: 'package' },
      'small brown chestnut mushrooms': { quantity: 1, type: 'package' },
      'crème fraîche': { quantity: 7, type: 'oz' },
      Parmesan: { quantity: 3.5, type: 'oz' },
      parsley: { quantity: 2, type: 'tbsp' }
    },
    method: [
      'Cook the pasta in a pan of boiling salted water according to the packet instructions. Drain and set aside',
      'Heat a frying pan until hot. Add the pieces of Parma ham and fry until crisp, remove half of the ham onto a plate and set aside. Add the mushrooms to the pan and fry for two minutes. Add the crème fraîche and bring up to the boil. Add the pasta, Parmesan and parsley and toss together over the heat. Season well with salt and pepper.',
      'Serve with a green salad and crunchy bread.'
    ],
    url: 'www_bbc_com_food_recipes_15_minute_pasta_33407',
    title: '15 minute pasta',
    time: {
      preparation: 'less than 30 minsless than 30 mins',
      preparationMins: 30,
      cooking: '10 to 30 mins10 to 30 mins',
      cookingMins: 30,
      totalMins: 60
    },
    serves: 'Serves 6Serves 6',
    image:
      'https://ichef.bbci.co.uk/food/ic/food_16x9_448/recipes/15_minute_pasta_33407_16x9.jpg',
    isVegetarian: false,
    recommendations: 0,
    categories: ['pasta', 'italian', 'quick']
  }
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
