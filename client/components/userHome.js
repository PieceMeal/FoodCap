import React from 'react';
import PropTypes from 'prop-types';
import ListPreview from './ListPreview';
import { connect } from 'react-redux';
import Navbar from './navbar';
import {
  Container,
  Header,
  Icon,
  Divider,
  Input,
  Form,
  Image,
  Message
} from 'semantic-ui-react';
import { fetchRecipes } from '../store/user';
import {
  createList,
  setListsThunk,
  addRecipeToListThunk
} from '../store/lists';
import { RecommendationsList, PopularList } from './RecipeList';
/**
 * COMPONENT
 */
class UserHome extends React.Component {
  state = {
    listName: '',
    checked: {}
  };
  componentDidMount() {
    this.props.fetchRecipes();
    // ***************************************
    // run a thunk if the list isnt populated
    // ***************************************
    if (!this.props.lists.length) {
      this.props.setListsThunk();
    }
  }
  handleSubmit = e => {
    //have a thunk in lists.js that will take this action and dispatch post request for list api
    //clear the state after submit so input is empty
    e.preventDefault();

    this.props.createList(this.state.listName);
    this.setState({
      listName: ''
    });
  };
  handleChange = e => {
    this.setState({
      listName: e.target.value
    });
  };
  handleChangeList = (e, { value, name }) => {
    //have a thunk that sends information about the list and information about
    this.setState(prevState => {
      return { checked: { ...prevState.checked, [name]: value } };
    });
  };
  handleSubmitList = e => {
    e.preventDefault();
    let recipe = Object.keys(this.state.checked).toString();
    let uuid = this.state.checked[recipe];
    let body = { uuid, recipe };

    this.props.createList(this.state.listName);
    this.setState({
      listName: ''
    });
  };
  handleChange = e => {
    this.setState({
      listName: e.target.value
    });
  };
  handleChangeList = (e, { value, name }) => {
    //have a thunk that sends information about the list and information about
    this.setState(prevState => {
      return { checked: { ...prevState.checked, [name]: value } };
    });
  };
  handleSubmitList = e => {
    e.preventDefault();
    let recipe = Object.keys(this.state.checked).toString();
    let uuid = this.state.checked[recipe];
    let body = { uuid, recipe };
    //dispatch thank for sending list info, recipe info
    this.props.addRecipeToListThunk(body);
    this.setState({ [recipe]: false });
  };
  handleOpen = name => {
    this.setState({ [name]: true });
  };
  handleClose = name => {
    this.setState({ [name]: false });
  };
  render() {
    const disableSubmitButton = Object.keys(this.state.checked).length;
    const { user } = this.props;
    if (this.props.recipes) {
      return (
        <div>

          <Container fluid style={{ padding: '50px' }}>
            <div>
              <Form onSubmit={this.handleSubmit}>
                <Input
                  size="large"
                  icon="add"
                  placeholder="create new list..."
                  onChange={this.handleChange}
                  value={this.state.listName}
                />
              </Form>
            </div>
            <Divider />
            <Container>
              <ListPreview />
            </Container>

            <Divider horizontal>
              <h3>Recipes You Might Like:</h3>
            </Divider>

            <RecommendationsList />

            <Divider horizontal>
              <h3>Popular Recipes:</h3>
            </Divider>

            <PopularList />
            <Divider />
          </Container>
        </div>
      );
    } else {
      //loading page ??
      return(
      <Message icon>
        <Icon name='circle notched' loading />
         <Message.Content>
           <Message.Header>Just one second</Message.Header>
           We are fetching that content for you.
        </Message.Content>
      </Message>
      )
    }
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    email: state.user.email,
    user: state.user,
    recipes: state.user.recipes,
    lists: state.lists
  };
};
const dispatchState = dispatch => ({
  fetchRecipes: () => dispatch(fetchRecipes()),
  createList: name => dispatch(createList(name)),
  setListsThunk: () => dispatch(setListsThunk()),
  addRecipeToListThunk: body => dispatch(addRecipeToListThunk(body))
});

export default connect(mapState, dispatchState)(UserHome);

/**
 * PROP TYPES
 */
UserHome.propTypes = {
  email: PropTypes.string
};
