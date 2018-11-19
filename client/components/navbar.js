import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../store';
import { Container, Menu, Button, Image } from 'semantic-ui-react';

const Navbar = ({ handleClick, isLoggedIn }) => (
	<Container>
		<Menu size="large">
			<Link to="/home">
				<Image src='/logo.png' height="100" />
			</Link>
			<Menu.Menu position="right">
				{isLoggedIn ? (
					<Button primary onClick={handleClick}>
						Log out
					</Button>
				) : (
					<Menu.Item>
						<Link to="/login">
							<Button primary>Log In</Button>
						</Link>

						<Link to="/signup">
							<Button primary>Sign Up</Button>
						</Link>
					</Menu.Item>
				)}
			</Menu.Menu>
		</Menu>
	</Container>
);

const mapState = state => {
	return {
		isLoggedIn: !!state.user.id,
	};
};

const mapDispatch = dispatch => {
	return {
		handleClick() {
			dispatch(logout());
		},
	};
};

export default connect(mapState, mapDispatch)(Navbar);

Navbar.propTypes = {
	handleClick: PropTypes.func.isRequired,
	isLoggedIn: PropTypes.bool.isRequired,
};
