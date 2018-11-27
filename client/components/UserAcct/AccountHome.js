import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Navbar from '../navbar';
import { LikedList, BookmarkedList } from '../RecipeList';
import AccountUpdateForm from './AccountUpdateForm';
import { Menu, Grid, Button } from 'semantic-ui-react';
// Make new Recipe List
// import RecipeList from '../RecipeList'

class AccountHome extends Component {
  constructor() {
    super();
    this.state = {
      active: '',
      formOpen: false
    };
  }
  handleItemClick = (e, { name }) => this.setState({ active: name });
  handleToggleForm = () => {
    this.setState(prevState => ({ formOpen: !prevState.formOpen }));
  };
  render() {
    const { active, formOpen } = this.state;
    const { user } = this.props;
    if (user.profilePicture) {
      return (
        <div
          style={{
            background:
              'linear-gradient(0deg, rgba(91,25,193,0.16430322128851538) 0%, rgba(53,232,78,0.07466736694677867) 100%)',
            minHeight: '110vh',
            backgroundSize: 'cover',
            justifyContent: 'center'
          }}
        >
          <Grid divided columns={3} style={{ margin: '6vw', height: '40vh' }}>
            <Grid.Row>
              <Grid.Column width={3}>
                <h4>Your Picture</h4>
                <img
                  src={`${user.profilePicture}`}
                  style={{
                    height: '190px',
                    width: 'auto'
                  }}
                />
              </Grid.Column>
              <Grid.Column width={5} style={{ marginLeft: '4vw' }}>
                <h4>User Info</h4>
                <p>
                  <b>Email:</b> &nbsp;{user.email}
                </p>
                <p>
                  <b>Handle:</b> &nbsp;
                  {user.userName || 'Add your handle below'}
                </p>
                <p>
                  <b>Picture Url:</b>&nbsp;
                  {user.profilePicture === '/list.svg'
                    ? 'Update your picture below'
                    : user.profilePicture}
                </p>
                <Button
                  size="small"
                  className="ui black button"
                  type="button"
                  onClick={this.handleToggleForm}
                >
                  Update Info
                </Button>
              </Grid.Column>
              <Grid.Column>
                {formOpen ? (
                  <AccountUpdateForm
                    toggleForm={this.handleToggleForm}
                    user={user}
                  />
                ) : null}
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <h4 style={{ margin: '4vh' }}>Search through your favorites</h4>
          <Menu style={{ margin: '3vh', justifyContent: 'left' }} inverted>
            <Menu.Item
              name="liked"
              active={active === 'liked'}
              onClick={this.handleItemClick}
            >
              Likes
            </Menu.Item>

            <Menu.Item
              name="bookmark"
              active={active === 'bookmark'}
              onClick={this.handleItemClick}
            >
              Bookmarks
            </Menu.Item>
          </Menu>
          {active === 'liked' ? <LikedList /> : null}
          {active === 'bookmark' ? <BookmarkedList /> : null}
        </div>
      );
    } else {
      return <div />;
    }
  }
}

const mapStateToProps = state => ({
  user: state.user
});
export default connect(mapStateToProps)(AccountHome);
