import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Segment, Divider } from 'semantic-ui-react';

const mapStateToProps = state => {};

const mapDispatchToProps = dispatch => {};

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
    marginLeft: '10vw',
    marginRight: '10vw',
    padding: '12px',
    border: '2px solid black',
    borderRadius: '15px',
    textAlign: 'center'
  },
  ingredientContainer: { paddingLeft: '60px', paddingRight: '80px' }
};
class SingleRecipe extends Component {
  componentDidMount() {}
  render() {
    return (
      <div style={style.wholeTray}>
        <Segment style={{ display: 'flex' }}>
          <h3 style={{ flexBasis: '15em' }}>{Object.keys(data)[0]}</h3>
          <button style={{ flexBasis: '10em' }}>Bookmark</button>
          <button style={{ flexBasis: '10em' }}>Add to Tray</button>
        </Segment>
        <img src={data['15 minute pasta'].image} />
        <div style={{ textAlign: 'left' }} className="ui horizontal segments">
          <div className="ui container">
            <Segment>
              &emsp;&emsp;&emsp;Preparation Time:{' '}
              {data['15 minute pasta'].time.totalMins} min
              &emsp;&emsp;&emsp;Cooking Time:{' '}
              {data['15 minute pasta'].time.cookingMins} min
            </Segment>

            <div
              style={style.ingredientContainer}
              role="list"
              className="ui bulleted list"
            >
              <h2>
                <b>INGREDIENTS</b>
              </h2>
              {Object.keys(data['15 minute pasta'].ingredients).map(
                ingredient => {
                  return (
                    <div role="listitem" className="item" key={ingredient}>
                      {data['15 minute pasta'].ingredients[ingredient].quantity}{' '}
                      &emsp;
                      {
                        data['15 minute pasta'].ingredients[ingredient].type
                      }&emsp;
                      {ingredient}
                    </div>
                  );
                }
              )}
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
              {data['15 minute pasta'].method.map(step => {
                return (
                  <li role="listitem" class="item">
                    {step}
                  </li>
                );
              })}
            </div>
          </div>
          <Segment>
            <button style={{ flexBasis: '10em' }}>Bookmark</button>
            <button style={{ flexBasis: '10em' }}>Add to Tray</button>
          </Segment>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SingleRecipe);
