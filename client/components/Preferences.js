import React from 'react'
import { Button, Form } from 'semantic-ui-react'
import {setPreference} from '../store/user'
import {connect} from 'react-redux'
import history from '../history'
import {DragDropContainer, DropTarget} from 'react-drag-drop-container'


class Preference extends React.Component{
state = {
    favCuisines: [],
    favIngredients: [],
    mealTypes: []
}

handleSubmit = (e) => {
    e.preventDefault()
    const preferencesObj = {
        favCuisines: this.state.favCuisines,
        favIngredients: this.state.favIngredients,
        mealTypes: this.state.mealTypes
    }
    this.props.setPreference(preferencesObj, this.props.user.id)
    history.push('/home');
}

handleCheck = (e) => {
    if (e.target.checked === true) {
        this.state[`${e.target.value}`].push(e.target.name)
    } else {
        const index = this.state[`${e.target.value}`].indexOf(e.target.name)
        this.state[`${e.target.value}`].splice(index, 1)
    }
}

cuisines = ["Chinese Food", "Italian Food", "Mexican Food", "American Food", "Indian Food"]
ingredients = ["chicken", "beef", "pork", "seafood", "cheese", "mushrooms", "pesto", "tomatoes", "potatoes"]
statements = ["I am vegetarian.", "I prefer low-calorie recipes.", "I prefer easy, quicky recipes."]

render(){
    return (
    <Form unstackable onSubmit={this.handleSubmit}>

        <h3>Select Your Favorite Cuisines:</h3>
        {this.cuisines.map(cuisine => {
            return (
                <div>
                    <Form.Field label={cuisine} name={cuisine} value='favCuisines' control='input' type='checkbox' onChange={this.handleCheck} defaultChecked={false} /><br />
                </div>
            )
        })}

        <h3>Select Ingredients You Love:</h3>
        {this.ingredients.map(ingredient => {
            return (
                <div>
                    <Form.Field label={ingredient} name={ingredient} value='favIngredients' control='input' type='checkbox' onChange={this.handleCheck} defaultChecked={false} /><br />
                </div>
            )
        })}

        <h3>Select the Statements that Apply to You:</h3>
        {this.statements.map(statement => {
            return (
                <div>
                    <Form.Field label={statement} name={statement} value='mealTypes' control='input' type='checkbox' onChange={this.handleCheck} defaultChecked={false} /><br />
                </div>
            )
        })}

        <Button type='submit'>Submit</Button>
    </Form>
)
}
}

const mapStateToProps  = state => ({
    user: state.user
})
const mapDispatchToProps = dispatch => ({
    setPreference: (pref, id) => dispatch(setPreference(pref, id))
})
export default connect(mapStateToProps, mapDispatchToProps)(Preference)


