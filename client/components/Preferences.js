import React from "react";
import { Button, Form, Grid, Header, Icon } from "semantic-ui-react";
import { setPreference } from "../store/user";
import { connect } from "react-redux";
import history from "../history";
import Navbar from "./navbar";
import PrefCard from "./PreferenceCard";
import Box from "./Box";

class Preference extends React.Component {
  state = {
    favCuisines: [],
    favIngredients: [],
    favCategory: [],
    hateCuisines: [],
    hateIngredients: [],
    hateCategory: []
  };

  //preference object has changed: update
  handleSubmit = e => {
    e.preventDefault();
    const preferencesObj = {
      favCuisines: this.state.favCuisines,
      favIngredients: this.state.favIngredients,
      favCategory: this.state.favCategory,
      hateCuisines: this.state.hateCuisines,
      hateIngredients: this.state.hateIngredients,
      hateCategory: this.state.hateCategory
    };
    this.props.setPreference(preferencesObj, this.props.user.id);
    history.push("/home");
  };

  handleDrop = (item) => {
    console.log('SET', item)
    if (item.status === 'love') {
      console.log('i love', item)
    } else if (item.status === 'hate') {
      console.log('i hate', item)
    }
  };

  handleX = evt => {
    this.setState((prevState) => {
      const newItem = evt.label
      const options = [...prevState.options, newItem]
      return {...prevState, options }
    })
  }

  restore = (item) => {
    console.log('item', item)
  }

  cuisines = [
    "chinese",
    "italian",
    "mexican",
    "american",
    "indian",
    "german",
    "japanese",
    "british",
    "french"
  ];
  ingredients = [
    "chicken",
    "beef",
    "pork",
    "seafood",
    "cheese",
    "mushrooms",
    "milk",
    "tomatoes",
    "potatoes"
  ];
  categories = [
    "pasta",
    "quick",
    "dessert",
    "alcohol",
    "salad",
    "baking",
    "roast",
    "breakfast",
    "appetizer"
  ];
  statements = [
    "I am vegetarian.",
    "I prefer low-calorie recipes.",
    "I prefer easy, quick recipes."
  ];

  render() {
    return (
      <div>
        <Navbar />
        <Form onSubmit={this.handleSubmit}>
        <div className="drag_things_to_boxes">
          <Grid columns={3}>

              <Grid.Row>
                <Grid.Column>
                  <Header as='h3' textAlign="center" attached="top">Cuisines:</Header>
                  <PrefCard
                    name="Cuisines"
                    items={this.cuisines}
                    handleDrop={this.handleDrop}
                    type="cuisine"
                  />
                </Grid.Column>
                <Grid.Column>
                <Header as='h3' textAlign="center" attached="top">Ingredients:</Header>
                  <PrefCard
                    name="Ingredients"
                    items={this.ingredients}
                    handleDrop={this.handleDrop}
                    type="ingredient"
                  />
                </Grid.Column>
                <Grid.Column>
                <Header as='h3' textAlign="center" attached="top">Categories:</Header>
                  <PrefCard
                    name="Categories"
                    items={this.categories}
                    handleDrop={this.handleDrop}
                    type="category"
                  />
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid.Column>
                  <Header as='h3' attached="top">
                    <Icon name='heart' />
                    <Header.Content>
                      Love:
                      <Header.Subheader>
                        Prioritize recommendations for your favorites!
                      </Header.Subheader>
                    </Header.Content>
                  </Header>

                  <Box
                    name='love'
                    targetKey="favCuisines"
                    handleX={this.handleX}
                    attached
                    restoreOption={this.restore} />
                </Grid.Column>

                <Grid.Column>
                  <Header as='h3' attached="top">
                    <Icon name='balance scale' />
                    <Header.Content>
                      Neutral:
                      <Header.Subheader>
                        You don't hate 'em, you don't love 'em.
                      </Header.Subheader>
                    </Header.Content>
                  </Header>
                  <Box
                    name='neutral'
                    targetKey="favCuisines"
                    handleX={this.handleX}
                    attached
                    restoreOption={this.restore}
                  />
                </Grid.Column>

                <Grid.Column>
                  <Header as='h3' attached="top">
                    <Icon name='ban' />
                    <Header.Content>
                      Hate:
                      <Header.Subheader>
                        We won't recommend anything with these!
                      </Header.Subheader>
                    </Header.Content>
                  </Header>
                  <Box
                    name='hate'
                    targetKey="favCuisines"
                    handleX={this.handleX}
                    attached
                    restoreOption={this.restore}
                  />
                </Grid.Column>

              </Grid.Row>
          </Grid>
        </div>
        <Button type="submit">Submit</Button>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});
const mapDispatchToProps = dispatch => ({
  setPreference: (pref, id) => dispatch(setPreference(pref, id))
});
export default connect(mapStateToProps, mapDispatchToProps)(Preference);
