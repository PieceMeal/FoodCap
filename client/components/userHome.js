import React from 'react'
import PropTypes from 'prop-types'
import ListPreview from './ListPreview'
import {connect} from 'react-redux'
import {Container,Header, Icon, Divider, Grid,Card, Image,Button, Popup, Input ,Form} from 'semantic-ui-react'
import {fetchRecipes} from '../store/user'
import {createList} from '../store/lists'
/**
 * COMPONENT
 */
class UserHome extends React.Component {
state = {
  listName : ''
}
componentDidMount(){
  this.props.fetchRecipes(this.props.user.id)
}
handleSubmit = (e) => {
//have a thunk in lists.js that will take this action and dispatch post request for list api
//clear the state after submit so input is empty

this.props.createList(this.state.listName)
this.setState({
  listName: ''
})
}
handleChange = (e) => {
this.setState({
  listName: e.target.value
})
console.log('my state', this.state.listName)
}
  render(){
    if(this.props.recipes) {
  return (
   <Container>
       <div>
    <Header as='h2' icon textAlign='center'>
      <Icon name='users' circular />
      <Header.Content>Hello {this.props.email}</Header.Content>
    </Header>
    <Form onSubmit={this.handleSubmit}>
    <Input size='large' icon='add' placeholder='create new list...' onChange={this.handleChange} value={this.state.listName} />
  </Form>
  </div>
  <Divider />
  <Container>
  <ListPreview />
  </Container>
  <Divider />
  <Divider />
  <Grid columns={4}>
    <Grid.Row>
   {this.props.recipes.map((rec, id) => {
     return (
      <Grid.Column key={id}>
      <Card>
    <Image src={rec.image} />
    <Card.Content>
      <Card.Header>{rec.name}</Card.Header>
      <Container textAlign='right'><Button icon='upload' /></Container>
      <Card.Meta>Time: {rec.time}</Card.Meta>

    </Card.Content>
  </Card>
      </Grid.Column>
     )
   })}
    </Grid.Row>
  </Grid>
  </Container>
  )}
  else {
    //loading page ??
    return <div/>
  }
}

}
/**
 * CONTAINER
 */
const mapState = state => {
  return {
    email: state.user.email,
    user : state.user,
    recipes: state.user.recipes
  } 
}
const dispatchState = dispatch => ({
  fetchRecipes: (id) => dispatch(fetchRecipes(id)),
  createList: (name) => dispatch(createList(name))
})

export default connect(mapState, dispatchState)(UserHome)

/**
 * PROP TYPES
 */
UserHome.propTypes = {
  email: PropTypes.string
}
