import React from 'react'
import {connect} from 'react-redux'
import {auth} from '../store'
import { Button, Form, Grid, Header, Image, Segment, Modal } from 'semantic-ui-react'

const LoginForm = props => {
  const {handleSubmit, error} = props

  return (
    <div className='login-form'>
      <style>{`
        body > div,
        body > div > div,
        body > div > div > div.login-form {
          height: 100%;
        }
      `}
      </style>
      <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
        <Grid.Column style={{ maxWidth: 450 }}>
          <Image src='/logo.png' centered />
          <Header as='h2' color='green' textAlign='center'>
            Log-in to your account
          </Header>
          <Form size='large' onSubmit={handleSubmit} name='login' >
            <Segment stacked>
              <Form.Input
                fluid icon='user'
                iconPosition='left'
                placeholder='E-mail address'
                name="email"
                type="text" />
              <Form.Input
                fluid
                icon='lock'
                iconPosition='left'
                placeholder='Password'
                name="password"
                type='password'
              />

              <Button color='green' fluid size='large' type="submit" >
                Log In
              </Button>
            </Segment>
          </Form>
          <br />

          <Modal trigger={<Button>Sign Up</Button>}>
            <Modal.Header />
            <Modal.Content>
              <Image src='/logo.png' centered />
              <Modal.Description>
                <Header textAlign='center'>Sign up with pieceMeal!</Header>
                <Form size='large' onSubmit={handleSubmit} name='signup' >
                  <Segment stacked>
                    <Form.Input
                      fluid icon='user'
                      iconPosition='left'
                      placeholder='E-mail address'
                      name="email"
                      type="text" />
                    <Form.Input
                      fluid
                      icon='lock'
                      iconPosition='left'
                      placeholder='Password'
                      name="password"
                      type='password'
                    />
                    <Button color='green' fluid size='large' type="submit" >
                      Sign Up
                    </Button>
                  </Segment>
                </Form>
                {error && error.response && <div> {error.response.data} </div>}
              </Modal.Description>
            </Modal.Content>
          </Modal>

          {error && error.response && <div> {error.response.data} </div>}
        </Grid.Column>
      </Grid>
    </div>
  )
}

const mapState = state => {
  return {
    error: state.user.error
  }
}

const mapDispatch = dispatch => {
  return {
    handleSubmit(evt) {
      evt.preventDefault()
      const formName = evt.target.name
      const email = evt.target.email.value
      const password = evt.target.password.value
      dispatch(auth(email, password, formName))
    }
  }
}

export default connect(mapState, mapDispatch)(LoginForm)
