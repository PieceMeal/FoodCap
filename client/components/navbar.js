import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../store';
import { Menu, Button, Image, Input, Icon, Form} from 'semantic-ui-react';
import axios from 'axios';

class Navbar extends React.Component{
	state={
		value:''
	}
	// handleChange = (e) => {
	// 	console.log('we are getting this from navbar----->>', this.state.value)
	// 	this.setState({value: e.target.value})
	// }
	// handleSubmit = async(e) => {
	// 	console.log('is this happenign??')
	// 	e.preventDefault()
	// 	const {data} = await axios.get(`/api/recipes?key=${this.state.value}`)
	// 	console.log('data from axios.get recipes', data)
	// }

	render(){
		return(
		<Menu >
			<Menu.Item>
				<Link to="/home">
					<Image src='/logo.png' height="100" />
				</Link>
			</Menu.Item>
			<Menu.Item >
				<Form onSubmit={this.handleSubmit}>
			<Input onChange={this.handleChange} icon={<Icon name='search' inverted circular link />} placeholder='Search...' value={this.state.value}/>
			</Form>
			</Menu.Item>
			<Menu.Item position="right">
				<Button onClick={this.props.handleClick} position="right" color="green" >
					Log out
				</Button>
			</Menu.Item>

		</Menu>
		)
	}
}

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
