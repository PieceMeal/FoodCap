import React from "react";
import PropTypes from "prop-types";
import ListPreview from "./ListPreview";
import { connect } from "react-redux";
import Navbar from './navbar'
import {
  Container,
  Header,
  Icon,
  Divider,
  Grid,
  Card,
  Image,
  Button
} from "semantic-ui-react";
import { fetchRecipes } from "../store/user";
/**
 * COMPONENT
 */
class UserHome extends React.Component {
  componentDidMount() {
    this.props.fetchRecipes(this.props.user.id);
  }
  render() {
    if (this.props.recipes) {
      return (
        <div>
          <Navbar />
          <Container>
            <div>
              <Header as="h2" icon textAlign="center">
                <Icon name="users" circular />
                <Header.Content>Hello {this.props.email}</Header.Content>
              </Header>
            </div>
            <Divider />
            <ListPreview />
            <Divider />
            <Grid columns={4}>
              <Grid.Row>
                {this.props.recipes.map((rec, id) => {
                  console.log("this is my rec", rec);
                  return (
                    <Grid.Column key={id}>
                      <Card>
                        <Image src={rec.image} />
                        <Card.Content>
                          <Card.Header>{rec.name}</Card.Header>
                          <Container textAlign="right">
                            <Button icon="upload" />
                          </Container>
                          <Card.Meta>Time: {rec.time}</Card.Meta>
                        </Card.Content>
                      </Card>
                    </Grid.Column>
                  );
                })}
              </Grid.Row>
            </Grid>
          </Container>
        </div>
      );
    } else {
      //loading page ??
      return <div />;
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
    recipes: state.user.recipes
  };
};
const dispatchState = dispatch => ({
  fetchRecipes: id => dispatch(fetchRecipes(id))
});

export default connect(mapState, dispatchState)(UserHome);

/**
 * PROP TYPES
 */
UserHome.propTypes = {
  email: PropTypes.string
};
