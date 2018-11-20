import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logout } from '../store';
import { Menu, Input, Icon, Form} from 'semantic-ui-react';


class Navbar extends React.Component {
	constructor() {
		super()
		this.state = {
			active: '',
			value: ''
		}
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

	handleItemClick = (e, { name }) => this.setState({ active: name })

		render() {
			const { active } = this.state
			return (
				<Menu>

					<Menu.Item name='home' active={active === 'home'} onClick={this.handleItemClick}>
          	Home
     			</Menu.Item>

					<Menu.Item name='preferences' active={active === 'preferences'} onClick={this.handleItemClick}>
          	My Preferences
     			</Menu.Item>

					 <Menu.Item name='account' active={active === 'account'} onClick={this.handleItemClick}>
          	My Account
     			</Menu.Item>

					<Menu.Item >
						<Form onSubmit={this.handleSubmit}>
							<Input onChange={this.handleChange} icon={<Icon name='search' inverted circular link />} placeholder='Search Recipes...' value={this.state.value}/>
						</Form>
					</Menu.Item>

					<Menu.Item onClick={this.props.handleClick} position="right">
						Log out
					</Menu.Item>

				</Menu>
			)
		}
	}

const mapState = state => {
	return {
		isLoggedIn: !!state.user.id
	}
}

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
