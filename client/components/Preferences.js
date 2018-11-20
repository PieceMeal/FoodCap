import React from "react";
import { Button, Form, Grid } from "semantic-ui-react";
import { setPreference } from "../store/user";
import { connect } from "react-redux";
import history from "../history";
import Navbar from "./navbar";
import PrefCard from './PreferenceCard'

class Preference extends React.Component {
  state = {
    favCuisines: [],
    favIngredients: [],
    mealTypes: [],
    favCategory: []
  };

  handleSubmit = e => {
    e.preventDefault();
    const preferencesObj = {
      favCuisines: this.state.favCuisines,
      favIngredients: this.state.favIngredients,
      mealTypes: this.state.mealTypes,
      favCategory: this.state.favCategory
    };
    this.props.setPreference(preferencesObj, this.props.user.id);
    history.push("/home");
  };

  handleCheck = e => {
    if (e.target.checked === true) {
      this.state[`${e.target.value}`].push(e.target.name);
    } else {
      const index = this.state[`${e.target.value}`].indexOf(e.target.name);
      this.state[`${e.target.value}`].splice(index, 1);
    }
  };

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
    "pesto",
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
    "I prefer easy, quicky recipes."
  ];

  render() {
    return (
        <div>
            <Navbar />
            <Form onSubmit={this.handleSubmit} >
                <div className="drag_things_to_boxes">
                <PrefCard name="Cuisines" items={this.cuisines} />
                <PrefCard name="Ingredients" items={this.ingredients} />
                <PrefCard name="Categories" items={this.categories} />
                </div>
                <Button type="submit">Submit</Button>
            </Form>
        </div>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user
});
const mapDispatchToProps = dispatch => ({
  setPreference: (pref, id) => dispatch(setPreference(pref, id))
});
export default connect(mapStateToProps, mapDispatchToProps)(Preference);
