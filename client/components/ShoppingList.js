import React, { Component } from 'react';
import Navbar from './navbar';
import { Header, List, Card } from 'semantic-ui-react';
import { connect } from 'react-redux';

import { setListThunk } from '../store/list';

class ShoppingList extends Component {
	constructor() {
		super();
		this.state = {
			loading: true,
			ingredients: {},
		};
	}
	async componentDidMount() {
		const { id } = this.props.match.params;
		this.setState({ loading: true });

		await this.props.setList(id);
		const categoryMap = this.props.categoryMap;
		const ingredients = {};
		Object.keys(categoryMap).forEach(c => {
			categoryMap[c].forEach(i => {
				ingredients[i.name] = false;
			});
		});
		this.setState({ loading: false, ingredients });
	}

	handleToggle = name => {
		const newIngredients = this.state.ingredients;
		newIngredients[name] = !newIngredients[name];

		this.setState({ ingredients: newIngredients });
	};
	render() {
		//dont display until loaded
		console.log(this.props.categoryMap);
		if (this.state.loading === true) {
			return <div />;
		}
		const categoryMap = this.props.categoryMap;
		if (categoryMap) {
			return (
				<React.Fragment>
					<Card centered>
						<Card.Content header="Shopping List" />
						<Card.Content>
							<List selection divided>
								{Object.keys(categoryMap).map(category => {
									return (
										<React.Fragment key={category}>
											<Header>{category} </Header>

											{categoryMap[category].map(i => {
												return (
													<List.Item
														key={i.name}
														className={
															this.state.ingredients[i.name]
																? 'crossedItem'
																: ''
														}
														onClick={() => this.handleToggle(i.name)}
													>
														{i.quantity} {i.type} {i.name}
														<List.Description>{i.notes}</List.Description>
													</List.Item>
												);
											})}
										</React.Fragment>
									);
								})}
							</List>
						</Card.Content>
					</Card>
				</React.Fragment>
			);
		} else {
			return <div>LOADING</div>;
		}
	}
}

const mapStateToProps = state => {
	const { list } = state;
	console.log(list);
	const categoryMap = {};
	if (list.ingredients) {
		list.ingredients.forEach(i => {
			const { name, quantity, type, category } = i;
			const categoryName = category.length > 0 ? category : 'other';
			if (!categoryMap[categoryName]) categoryMap[categoryName] = [];
			categoryMap[categoryName].push({ name, quantity, type });
		});
	}
	return {
		categoryMap,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		setList: id => dispatch(setListThunk(id)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ShoppingList);
