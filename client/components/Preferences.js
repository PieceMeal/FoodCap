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
    hateCategory: [],
    cuisine: [
      "chinese",
      "italian",
      "mexican",
      "american",
      "indian",
      "german",
      "japanese",
      "british",
      "french"
    ],
    ingredient: [
      "chicken",
      "beef",
      "pork",
      "seafood",
      "cheese",
      "mushrooms",
      "milk",
      "tomatoes",
      "potatoes"
    ],
    category: [
      "pasta",
      "quick",
      "dessert",
      "alcohol",
      "salad",
      "baking",
      "roast",
      "breakfast",
      "appetizer"
    ]
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
    console.log('PREFERENCES:', preferencesObj)
    // this.props.setPreference(preferencesObj, this.props.user.id);
    // history.push("/home");
  };

  // eslint-disable-next-line complexity
  handleDrop = (e, boxName) => {
    const { label, type } = e.dragData
    if (boxName === 'love') {
      if (type === 'cuisine') {
        let items = this.state.favCuisines.slice()
        items.push(label)
        this.setState({favCuisines: items})
      } else if (type === 'ingredient') {
        let items = this.state.favIngredients.slice()
        items.push(label)
        this.setState({favIngredients: items})
      } else if (type === 'category') {
        let items = this.state.favCategory.slice()
        items.push(label)
        this.setState({favCategory: items})
      }
    } else if (boxName === 'hate') {
      if (type === 'cuisine') {
        let items = this.state.hateCuisines.slice()
        items.push(label)
        this.setState({hateCuisines: items})
      } else if (type === 'ingredient') {
        let items = this.state.hateIngredients.slice()
        items.push(label)
        this.setState({hateIngredients: items})
      } else if (type === 'category') {
        let items = this.state.hateCategory.slice()
        items.push(label)
        this.setState({hateCategory: items})
      }
    }
  };

  restore = item => {
    item[0].event.containerElem.style.visibility = "visible"
  }

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
                    items={this.state.cuisine}
                    type="cuisine"
                  />
                </Grid.Column>
                <Grid.Column>
                <Header as='h3' textAlign="center" attached="top">Ingredients:</Header>
                  <PrefCard
                    name="Ingredients"
                    items={this.state.ingredient}
                    type="ingredient"
                  />
                </Grid.Column>
                <Grid.Column>
                <Header as='h3' textAlign="center" attached="top">Categories:</Header>
                  <PrefCard
                    name="Categories"
                    items={this.state.category}
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
                    targetKey="target"
                    handleDrop={this.handleDrop}
                    restore={this.restore}
                    attached
                   />
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
                    targetKey="target"
                    handleDrop={this.handleDrop}
                    restore={this.restore}
                    attached
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
                    targetKey="target"
                    handleDrop={this.handleDrop}
                    restore={this.restore}
                    attached
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
