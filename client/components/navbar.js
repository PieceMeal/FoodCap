import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../store';
import { Container, Menu, Button } from 'semantic-ui-react';

const Navbar = ({ handleClick, isLoggedIn }) => (
	<Container>
		<Menu size="large">
			<Link to="/">
				<Menu.Item name="Home" />
			</Link>
			<Link to="/home">
				<Menu.Item name="User Home" />
			</Link>
			{/* <Link to="/lists">
				<Menu.Item name="User Lists" />
			</Link> */}
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

/**
 * CONTAINER
 */
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

/**
 * PROP TYPES
 */
Navbar.propTypes = {
	handleClick: PropTypes.func.isRequired,
	isLoggedIn: PropTypes.bool.isRequired,
};
