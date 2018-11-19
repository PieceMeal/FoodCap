import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../store';
import { Menu, Button, Image } from 'semantic-ui-react';

const Navbar = ({ handleClick }) => (
		<Menu>
			<Menu.Item>
				<Link to="/home">
					<Image src='/logo.png' height="100" />
				</Link>
			</Menu.Item>
			<Menu.Item position="right">
				<Button onClick={handleClick} position="right" color="green" >
					Log out
				</Button>
			</Menu.Item>
		</Menu>
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
