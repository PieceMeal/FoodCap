import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Label, Container, Button } from 'semantic-ui-react';
import { setAccountInfoThunk } from '../../store/user';

class AccountUpdateForm extends Component {
  constructor(props) {
    super(props);
    const { user } = this.props;
    this.state = {
      email: user.email,
      userName: user.userName,
      profilePicture: user.profilePicture
    };
  }
  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  handleSubmit = e => {
    e.preventDefault();
    const { email, userName, profilePicture } = this.state;
    const dispatchObj = { email, userName, profilePicture };
    this.props.setAccountInfo(dispatchObj);
    this.props.toggleForm();
  };
  render() {
    const { email, userName, profilePicture } = this.state;
    return (
      <Container
        style={{
          background: 'white',
          borderRadius: '5px',
          padding: '10px',
          border: '1px solid teal'
        }}
      >
        <Form onSubmit={e => this.handleSubmit(e)}>
          <Form.Field>
            <Label>Email</Label>
            <Form.Input
              type="text"
              name="email"
              value={email}
              onChange={this.handleChange}
            />
          </Form.Field>
          <Form.Field>
            <Label>Handle</Label>
            <Form.Input
              type="text"
              name="userName"
              value={userName || ''}
              onChange={this.handleChange}
            />
          </Form.Field>
          <Form.Field>
            <Label>Picture Url</Label>
            <Form.Input
              type="text"
              name="profilePicture"
              value={profilePicture}
              onChange={this.handleChange}
            />
          </Form.Field>
          <Button className="ui teal button" size="mini" type="submit">
            Update
          </Button>
        </Form>
      </Container>
    );
  }
}
const mapDispatchToProps = dispatch => ({
  setAccountInfo: updateData => dispatch(setAccountInfoThunk(updateData))
});

export default connect(null, mapDispatchToProps)(AccountUpdateForm);
