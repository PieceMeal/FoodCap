import React, { Component } from 'react';
import Navbar from './navbar';
import { Header, List, Card } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { Loading } from './';
import { setListThunk } from '../store/list';

class ShoppingList extends Component {
	constructor() {
		super();
		this.state = {
			loading: true,
			ingredients: {},
		};
	}
	options = [
		{ key: 'produce', value: 'produce', text: 'Produce' },
		{ key: 'meat', value: 'meat', text: 'Meat/Seafood' },
		{ key: 'dairy', value: 'dairy', text: 'Dairy' },
		{ key: 'beverages', value: 'beverages', text: 'Beverages' },
		{ key: 'bakery', value: 'bakery', text: 'Bakery & Deli' },
		{ key: 'frozen', value: 'frozen', text: 'Refrigerated / Frozen' },
		{ key: 'pantry', value: 'pantry', text: 'Pantry' },
		{ key: 'other', value: 'other', text: 'Other' },
	];
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
									if (categoryMap[category].length === 0) return null;
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
			return <Loading />;
		}
	}
}

const mapStateToProps = state => {
	const options = [
		{ key: 'produce', value: 'produce', text: 'Produce' },
		{ key: 'meat', value: 'meat', text: 'Meat/Seafood' },
		{ key: 'dairy', value: 'dairy', text: 'Dairy' },
		{ key: 'beverages', value: 'beverages', text: 'Beverages' },
		{ key: 'bakery', value: 'bakery', text: 'Bakery & Deli' },
		{ key: 'frozen', value: 'frozen', text: 'Refrigerated / Frozen' },
		{ key: 'pantry', value: 'pantry', text: 'Pantry' },
		{ key: 'other', value: 'other', text: 'Other' },
	];

	const { list } = state;
	const categoryMap = {};
	options.forEach(o => {
		categoryMap[o.text] = [];
	});
	if (list.ingredients) {
		list.ingredients.forEach(i => {
			let { name, quantity, type, category } = i;
			if (category === '') category = 'other';
			//console.log('test');
			// const tempName = category.length > 0 ? category : 'other';
			const mappedOption = options.filter(opt => category === opt.value);
			let categoryName;
			if (mappedOption.length > 0) {
				categoryName = mappedOption[0].text;
			} else {
				categoryName = 'Other';
			}
			//	if (!categoryMap[categoryName]) categoryMap[categoryName] = [];
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
