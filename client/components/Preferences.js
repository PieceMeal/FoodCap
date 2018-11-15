import React from 'react'
import { Button, Form } from 'semantic-ui-react'
import {setPreference} from '../store/user'
import {connect} from 'react-redux'
class Preference extends React.Component{
state = {
    favoriteFood: ''
}
handleChange = (e) => {
    console.log('this is my hcange =====', this.state.favoriteFood)
    this.setState({
        favoriteFood : e.target.value
    })
}
handleSubmit = (e) => {
    e.preventDefault()
    console.log('this is our thunk', this.state.favoriteFood)
    this.props.setPreference(this.state.favoriteFood, this.props.user.id)
}

render(){
    return (
  <Form unstackable onSubmit={this.handleSubmit}>
    <Form.Group widths={2}>
      <Form.Input 
      onChange={this.handleChange} 
      value={this.state.favoriteFood} 
      label='favorite food' 
      placeholder='favorite food' />

    </Form.Group>
    <Form.Checkbox label='I agree to the Terms and Conditions' />
    <Button type='submit'>Submit</Button>
  </Form>
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


