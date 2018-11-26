import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logout } from '../store';
import { Link } from 'react-router-dom'
import { Menu, Input, Icon, Form } from 'semantic-ui-react';
import {searchRecipesThunk} from '../store/genericRecLists'
import history from '../history'

class Navbar extends React.Component {
	constructor() {
		super()
		this.state = {
			active: '',
			value: ''
		}
	}
	handleClick = () => {
		this.props.logout()
	}
	handleChange = (e) => {
		this.setState({value: e.target.value})
	}

	handleSubmit = async(e) => {
		e.preventDefault()
		const query = this.state.value
		this.props.searchRecipesThunk(query);
		this.setState({value: ''})
		history.push(`/search?key=${query}`)
	}

	handleItemClick = (e, { name }) => this.setState({ active: name })

		render() {
			const { active } = this.state
			return (
				<Menu>

					<Menu.Item as={Link} to='/home' name='home' active={active === 'home'} onClick={this.handleItemClick}>
          	Home
     			</Menu.Item>

					<Menu.Item as={Link} to='/home/preferences'name='preferences' active={active === 'preferences'} onClick={this.handleItemClick}>
          	My Preferences
     			</Menu.Item>

					<Menu.Item >
						<Form onSubmit={this.handleSubmit}>
							<Input onChange={this.handleChange} icon={<Icon name='search' inverted circular link />} placeholder='Search Recipes...' value={this.state.value}/>
						</Form>
					</Menu.Item>

					<Menu.Item onClick={this.handleClick} position="right">
						Log out
					</Menu.Item>

				</Menu>
			)
		}
	}

const mapState = state => ({isLoggedIn: !!state.user.id})

const mapDispatch = dispatch => ({
	logout: () => dispatch(logout()),
	searchRecipesThunk: (q) => dispatch(searchRecipesThunk(q))
})

export default connect(mapState, mapDispatch)(Navbar);

Navbar.propTypes = {
	// handleClick: PropTypes.func.isRequired,
	isLoggedIn: PropTypes.bool.isRequired,
};
