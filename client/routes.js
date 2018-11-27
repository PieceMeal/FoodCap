import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
	MyList,
	UserHome,
	Preferences,
	SingleRecipe,
	LoginForm,
	Ingredients,
	ShoppingList,
} from './components';
import { me } from './store';
import AccountHome from './components/UserAcct/AccountHome';
//component
class Routes extends Component {
	componentDidMount() {
		this.props.loadInitialData();
	}
	render() {
		const { isLoggedIn } = this.props;
		return (
			<div>
				{!isLoggedIn && (
					<Switch>
						<Route exact path="/" component={LoginForm} />
						<Route path="/login" component={LoginForm} />
					</Switch>
				)}
				{isLoggedIn && (
					<Switch>
						{/* Routes placed here are only available after logging in */}
						<Route exact path="/" component={UserHome} />
						<Route exact path="/home" component={UserHome} />
						<Route exact path="/ingredients" component={Ingredients} />

						<Route path="/home/preferences" component={Preferences} />
						<Route path="/lists/:id" component={MyList} />
						<Route path="/shopping/:id" component={ShoppingList} />

						<Route
							path="/recipes/singleview/:recipename"
							component={SingleRecipe}
						/>
						<Route path="/user/account" component={AccountHome} />
					</Switch>
				)}
			</div>
		);
	}
}

const mapState = state => {
	return {
		// Being 'logged in' for our purposes will be defined has having a state.user that has a truthy id.
		// Otherwise, state.user will be an empty object, and state.user.id will be falsey
		isLoggedIn: !!state.user.id,
	};
};

const mapDispatch = dispatch => {
	return {
		loadInitialData() {
			dispatch(me());
		},
	};
};

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Routes));

/**
 * PROP TYPES
 */
Routes.propTypes = {
	loadInitialData: PropTypes.func.isRequired,
	isLoggedIn: PropTypes.bool.isRequired,
};
