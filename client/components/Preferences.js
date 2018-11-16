import React from 'react'
import { Button, Form } from 'semantic-ui-react'
import {setPreference} from '../store/user'
import {connect} from 'react-redux'
import history from '../history'


class Preference extends React.Component{
state = {
    favoriteFood: ''
}
handleChange = (e) => {

    this.setState({
        favoriteFood : e.target.value
    })
}
handleSubmit = (e) => {
    e.preventDefault()

    this.props.setPreference(this.state.favoriteFood, this.props.user.id)
    history.push('/home');
}

render(){
    return (
  <div>
    <Form unstackable onSubmit={this.handleSubmit}>
        <Form.Group widths={2}>
        <Form.Input
        onChange={this.handleChange}
        value={this.state.favoriteFood}
        label='favorite food'
        placeholder='favorite food' />
        </Form.Group>
        <h3>Select Your Favorite Cuisines:</h3>
        <Form.Field label='Chinese Food' control='input' type='checkbox' /><br />
        <Form.Field label='Italian Food' control='input' type='checkbox' /><br />
        <Form.Field label='Mexican Food' control='input' type='checkbox' /><br />
        <Form.Field label='American Food' control='input' type='checkbox' /><br />
        <Form.Field label='Indian Food' control='input' type='checkbox' /><br />
        <h3>Select Ingredients You Love:</h3>
        <Form.Field label='Chicken' control='input' type='checkbox' /><br />
        <Form.Field label='Beef' control='input' type='checkbox' /><br />
        <Form.Field label='Pork' control='input' type='checkbox' /><br />
        <Form.Field label='Seafood' control='input' type='checkbox' /><br />
        <Form.Field label='Cheese' control='input' type='checkbox' /><br />
        <Form.Field label='Mushrooms' control='input' type='checkbox' /><br />
        <Form.Field label='Pesto' control='input' type='checkbox' /><br />
        <Form.Field label='Tomatoes' control='input' type='checkbox' /><br />
        <h3>Select the Statements that Apply to You:</h3>
        <Form.Field label='I am vegetarian.' control='input' type='checkbox' /><br />
        <Form.Field label='I prefer low-calorie recipes' control='input' type='checkbox' /><br />
        <Form.Field label='I prefer easy, quick recipes' control='input' type='checkbox' /><br />
        <Button type='submit'>Submit</Button>
    </Form>

  </div>
)
}
}

const mapStateToProps  = state => ({
    user : state.user
})
const mapDispatchToProps = dispatch =>({
    setPreference : (pref, id) => dispatch(setPreference(pref, id))
})
export default connect(mapStateToProps, mapDispatchToProps)(Preference)


